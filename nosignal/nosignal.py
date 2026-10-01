#!/usr/bin/env python3


import argparse
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path

# Common Linux/OpenSSH-style lines:
# Sep 29 18:41:02 server sshd[1234]: Failed password for invalid user admin from 203.0.113.10 port 44210 ssh2
# Sep 29 18:41:05 server sshd[1234]: Failed password for root from 203.0.113.10 port 44211 ssh2
FAIL_RE = re.compile(
    r"^(?P<ts>[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}).*?"
    r"sshd(?:\[\d+\])?: Failed password for "
    r"(?:(?:invalid user)\s+)?(?P<user>\S+)\s+from\s+(?P<ip>[0-9a-fA-F:.]+)"
)

SUCCESS_RE = re.compile(
    r"^(?P<ts>[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}).*?"
    r"sshd(?:\[\d+\])?: Accepted (?:password|publickey) for "
    r"(?P<user>\S+)\s+from\s+(?P<ip>[0-9a-fA-F:.]+)"
)

MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], start=1
)}

def parse_ts(raw: str, year: int) -> datetime:
    month, day, clock = raw.split()
    return datetime(year, MONTHS[month], int(day), *map(int, clock.split(":")))

def parse_log(path: Path, year: int):
    events = []
    successes = []
    for line_no, line in enumerate(path.read_text(errors="replace").splitlines(), 1):
        m = FAIL_RE.search(line)
        if m:
            events.append({
                "time": parse_ts(m.group("ts"), year),
                "user": m.group("user"),
                "ip": m.group("ip"),
                "line": line_no,
                "raw": line,
            })
            continue
        m = SUCCESS_RE.search(line)
        if m:
            successes.append({
                "time": parse_ts(m.group("ts"), year),
                "user": m.group("user"),
                "ip": m.group("ip"),
                "line": line_no,
                "raw": line,
            })
    return events, successes

def detect(events, successes, threshold=10, window=10, multi_user=4):
    by_ip = defaultdict(list)
    by_user = defaultdict(list)

    for e in events:
        by_ip[e["ip"]].append(e)
        by_user[e["user"]].append(e)

    findings = []

    # High-volume source
    for ip, items in by_ip.items():
        if len(items) >= threshold:
            findings.append({
                "type": "HIGH_FAILURE_VOLUME",
                "severity": "HIGH",
                "ip": ip,
                "count": len(items),
                "detail": f"{len(items)} failed authentication attempts from one source",
            })

        # Burst detection
        items = sorted(items, key=lambda x: x["time"])
        for i, current in enumerate(items):
            cutoff = current["time"] + timedelta(minutes=window)
            burst = [x for x in items[i:] if x["time"] <= cutoff]
            if len(burst) >= threshold:
                users = sorted({x["user"] for x in burst})
                findings.append({
                    "type": "AUTH_BURST",
                    "severity": "HIGH",
                    "ip": ip,
                    "count": len(burst),
                    "detail": (
                        f"{len(burst)} failures within {window} minutes; "
                        f"{len(users)} user(s) targeted"
                    ),
                })
                break

        # Many-account targeting / password spraying indicator
        users = {x["user"] for x in items}
        if len(users) >= multi_user:
            findings.append({
                "type": "MULTI_ACCOUNT_TARGETING",
                "severity": "MEDIUM",
                "ip": ip,
                "count": len(items),
                "detail": f"{len(users)} distinct usernames targeted",
            })

    # Failed attempts followed by a success from same IP/user in a short window.
    for success in successes:
        prior = [
            e for e in events
            if e["ip"] == success["ip"]
            and e["user"] == success["user"]
            and timedelta(0) <= success["time"] - e["time"] <= timedelta(minutes=window)
        ]
        if len(prior) >= 3:
            findings.append({
                "type": "FAILURES_THEN_SUCCESS",
                "severity": "HIGH",
                "ip": success["ip"],
                "count": len(prior),
                "detail": (
                    f"{len(prior)} failures for user '{success['user']}' "
                    f"followed by a successful authentication"
                ),
            })

    # De-duplicate equivalent findings.
    unique = []
    seen = set()
    for f in findings:
        key = (f["type"], f["ip"], f["detail"])
        if key not in seen:
            seen.add(key)
            unique.append(f)
    return unique

def render(events, successes, findings, source):
    users = Counter(e["user"] for e in events)
    ips = Counter(e["ip"] for e in events)

    lines = [
        "=== AUTHWATCH SECURITY REPORT ===",
        f"Source: {source}",
        f"Failed authentication events: {len(events)}",
        f"Successful authentication events parsed: {len(successes)}",
        "",
        "Top source IPs:",
    ]
    for ip, count in ips.most_common(10):
        lines.append(f"  {ip:<18} {count} failures")

    lines += ["", "Top targeted usernames:"]
    for user, count in users.most_common(10):
        lines.append(f"  {user:<18} {count} failures")

    lines += ["", f"Findings: {len(findings)}"]
    if not findings:
        lines.append("  No configured detection threshold was exceeded.")
    else:
        for i, f in enumerate(findings, 1):
            lines += [
                f"  [{f['severity']}] {f['type']}",
                f"      Source: {f['ip']}",
                f"      Evidence: {f['detail']}",
            ]

    lines += [
        "",
        "NOTE: Findings are indicators for investigation, not proof of compromise.",
    ]
    return "\n".join(lines) + "\n"

def main():
    parser = argparse.ArgumentParser(
        description="Analyze Linux/OpenSSH-style authentication logs for suspicious patterns."
    )
    parser.add_argument("logfile", type=Path)
    parser.add_argument("--year", type=int, default=datetime.now().year)
    parser.add_argument("--threshold", type=int, default=10,
                        help="failed attempts needed for volume/burst detection (default: 10)")
    parser.add_argument("--window", type=int, default=10,
                        help="time window in minutes for burst/correlation detection (default: 10)")
    parser.add_argument("--multi-user", type=int, default=4,
                        help="distinct usernames from one IP before flagging (default: 4)")
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    events, successes = parse_log(args.logfile, args.year)
    findings = detect(events, successes, args.threshold, args.window, args.multi_user)
    report = render(events, successes, findings, str(args.logfile))

    print(report)
    if args.output:
        args.output.write_text(report)
        print(f"Report written to {args.output}")

if __name__ == "__main__":
    main()
