# References

1. MITRE ATT&CK, **Brute Force (T1110)**.
   https://attack.mitre.org/techniques/T1110/
   Used to ground the detection objective and the relationship between repeated
   authentication failures and brute-force activity.

2. MITRE ATT&CK, **Password Guessing (T1110.001)**.
   https://attack.mitre.org/techniques/T1110/001/
   Used for the password-guessing / repeated authentication-failure context.

3. MITRE ATT&CK, **Brute Force Authentication Failures with Multi-Platform
   Log Correlation (DET0463)**.
   https://attack.mitre.org/detectionstrategies/DET0463/
   Used to inform correlation of repeated failures, configurable time windows,
   thresholds, and failures followed by success.

4. Python Documentation, **Logging HOWTO**.
   https://docs.python.org/3/howto/logging.html
   Reference for Python's standard logging concepts and timestamped events.

## Notes

The sample log is synthetic. The example addresses use documentation ranges
(203.0.113.0/24 and 198.51.100.0/24) and are not intended as real targets.

The detection thresholds in AuthWatch are configurable heuristics, not universal
security standards.
