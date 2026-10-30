---
sidebar_label: "Debugging Failed Welcome Emails in DavPanel Enterprise"
---

# How to Fix Welcome Emails Not Being Sent (SMTP)

**Symptom:** `davcli user-add` / DavAdmin UI reports `Failed to send welcome email`, with no error in `/var/log/davpanel/admin/error.log` and no `/var/log/davpanel/admin/emails/` directory, even though direct SMTP tests succeed.

## Debug Steps

**1. Enable verbose logging**

```bash
davcli config update dev_mode on
systemctl restart admin
tail -f /var/log/davpanel/admin/error.log
```

Reproduce via CLI with `-x` for a full trace:

```bash
davcli -x user-add <username> '<password>' <email> <plan>
```

Check whether the email step is actually attempted or silently skipped, e.g.:

```
+ send_welcome_email
+ [[ false == true ]]
+ return 0
```

If skipped, make sure the CLI command includes the same flags the UI sends (e.g. `--send-email`) — otherwise you're not reproducing the same code path.

**2. Verify stored SMTP config matches intended credentials**

Special characters can get stripped/mis-escaped via the UI:

```bash
grep '^mail_' /etc/davpanel/davpanel/conf/davpanel.config
```

Fix via CLI if needed:

```bash
davcli config update mail_password '<password>'
```

**3. Run a clean diagnostic pass**

```bash
#!/bin/bash
CONFIGURED_EMAIL=$(davcli config get email)
DEV_MODE=$(davcli config get dev_mode)

[[ -z "$CONFIGURED_EMAIL" ]] && { echo "ERROR: no notification email configured. Run: davcli config update email example@yourdomain.com"; exit 1; }
[[ "$DEV_MODE" != "on" ]] && { echo "ERROR: dev_mode must be on. Run: davcli config update dev_mode on && service admin restart"; exit 1; }

mv /var/log/davpanel/admin/error.log /var/log/davpanel/admin/error.log.OLD 2>&1 && touch /var/log/davpanel/admin/error.log
mv /var/log/davpanel/admin/notifications.log /var/log/davpanel/admin/notifications.log.OLD && touch /var/log/davpanel/admin/notifications.log

davcli -x sentinel --startup 2>&1 | tail -n 10
grep "/send_email" /var/log/davpanel/admin/access.log | tail -n 1
cat /var/log/davpanel/admin/error.log
```

This isolates whether the request even reaches `/send_email` and captures the resulting error.

## Common Root Causes

**Hairpin NAT** — if the panel calls its own public domain internally (rather than `localhost`) and the network/firewall doesn't support hairpin NAT, the internal call times out.

Fix: add a local hosts entry so the server resolves its own domain to itself:
```
127.0.0.1 <admin-panel-domain>
```

**SMTP provider IP block** — repeated test connections can trigger an anti-abuse block, e.g.:
```
421 - 4.4.5 Directory harvest attack detected
```

Fix: ask the mail provider to clear the block and whitelist the server's outgoing IP.

## Checklist

- [ ] Reproduce with `davcli -x user-add ...` using the same flags as the UI
- [ ] Enable `dev_mode`, restart admin, tail `error.log`
- [ ] Confirm the email step isn't being silently skipped
- [ ] Verify config file values match intended credentials
- [ ] Run the diagnostic script to confirm the request reaches `/send_email`
- [ ] Check for hairpin NAT issues
- [ ] Check with SMTP provider for IP blocks from repeated testing
