# AuthWatch

Lightweight Python authentication-log analyzer for defensive security work.

## Problem

Authentication logs can become noisy quickly. Manually correlating repeated failures
by source IP, targeted account, timing, and subsequent successful authentication is
tedious and can make suspicious sequences harder to spot.

## What AuthWatch does

AuthWatch parses Linux/OpenSSH-style authentication logs and reports:

- high-volume failed authentication from one source
- bursts of failures within a configurable time window
- one source targeting multiple usernames
- repeated failures followed by a successful authentication from the same IP/user

The thresholds are configurable because there is no universal number of failed logins
that proves malicious activity.

## Usage

```bash
python3 authwatch.py sample_logs/auth.log --year 2026
```

Write the report to a file:

```bash
python3 authwatch.py sample_logs/auth.log --year 2026 -o reports/sample_report.txt
```

Tune detection:

```bash
python3 authwatch.py sample_logs/auth.log --threshold 8 --window 5 --multi-user 3
```

## Example

The included synthetic log contains repeated failures from `203.0.113.10` and
three failures followed by a success from `198.51.100.22`.

These addresses are documentation/example IP ranges, not real targets.

## Detection methodology

### High failure volume
Flags a source when the number of failed authentication events reaches the
configured `--threshold`.

### Authentication burst
Flags a source when the threshold is reached inside the configured `--window`.

### Multi-account targeting
Flags a source when it attempts authentication against at least `--multi-user`
distinct usernames. This can be an indicator of password spraying or broad
credential guessing.

### Failures followed by success
Flags a successful authentication when at least three failures for the same
source/user occurred within the configured correlation window immediately before it.

These are detection indicators. A finding does not establish that an account was
compromised. Analysts should validate the source, account context, expected
administrative activity, and surrounding events.

## Limitations

- Primarily supports Linux/OpenSSH-style `Failed password` and `Accepted password/publickey` lines.
- It does not inspect passwords or attempt authentication.
- It uses simple threshold-based correlation rather than statistical anomaly detection.
- Syslog timestamps do not contain a year, so `--year` must be supplied when analyzing archived logs from another year.
- IPv4/IPv6 addresses are supported by the parser, but log formats vary between systems.

## Defensive scope

Designed for authorized log analysis and security monitoring. The tool reads supplied
log files only and does not contact remote hosts.
