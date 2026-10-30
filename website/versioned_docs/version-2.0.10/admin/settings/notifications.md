---
sidebar_position: 7
---

# Notifications

Configure DavAdmin notifications and Email alerts settings.

<Tabs>
  <TabItem value="davadmin-notifications-view" label="With DavAdmin" default>

  To view or edit current notification settings, go to **DavAdmin > Settings > Notifications** or click the 'Edit Settings' button on the Notification page.
  
  ![Email section with the address for notifications and daily usage reports](/img/davadmin-screenshots/settings/notifications-email.png#gh-light-mode-only)
  ![Email section with the address for notifications and daily usage reports](/img/davadmin-screenshots/settings/notifications-email_dark.png#gh-dark-mode-only)

  </TabItem>
  <TabItem value="CLI-notifications-view" label="With DavCLI">

To view notification settings, run:

```bash
davcli admin notifications get <OPTION>
```

Example:

```bash
# davcli admin notifications get reboot
yes
```

To update notification settings, run:

```bash
davcli admin notifications update <OPTION> <NEW-VALUE>
```

Example:

```bash
davcli admin notifications update load 10
Updated load to 10
```

  </TabItem>
</Tabs>

---

## Pause Notifications

Temporarily silence email and webhook alerts without changing any of the settings below — useful during planned maintenance so a batch of expected service restarts doesn't flood your inbox.

The control lives on the **Notifications** page itself (next to the search box), not here — click the bell icon to pick a duration: 10 minutes, 30 minutes, 1 hour, 6 hours, or 1 day. While paused, the bell shows "Paused until \<time\>" and doubles as a button to resume immediately.

Pausing only skips the email/webhook sends — notifications still get logged and show up on the Notifications page as usual, and the pause always expires on its own even if you never click resume.

Under the hood this writes a timestamp to a flag file (`/tmp/davpanel_notifications_paused`) that `davcli sentinel` checks before sending any alert. See [`GET/POST /api/notifications/pause`](/docs/admin/settings/api) and [`POST /api/notifications/resume`](/docs/admin/settings/api) to control it via the API.

---

## Email

Configure email address to be used for receiving system notifications and alerts.

Enter your email address in the **Email address** field. Leave it empty to disable email alerts.

If email address is set, daily usage report will be sent to the address, schedule is configurable from 'Server > Scheduled Actions'.

![report example](/img/admin/daily_report.png)


---

## Webhook

Send notifications to a webhook URL (discord or any other).

![Webhook section with the webhook URL field](/img/davadmin-screenshots/settings/notifications-webhook.png#gh-light-mode-only)
![Webhook section with the webhook URL field](/img/davadmin-screenshots/settings/notifications-webhook_dark.png#gh-dark-mode-only)

---

## Services

Receive notifications when services are down or unresponsive. Services are checked every 5 minutes.

![Services section with a toggle per monitored service](/img/davadmin-screenshots/settings/notifications-services.png#gh-light-mode-only)
![Services section with a toggle per monitored service](/img/davadmin-screenshots/settings/notifications-services_dark.png#gh-dark-mode-only)

- **DavPanel:** Notification if DavPanel UI fails.
- **DavAdmin:** Notification if DavAdmin UI fails.
- **Caddy:** Notification if webserver is not responding.
- **MySQL:** Notification if database is unreachable.
- **Podman:** Notification if Podman service is down.
- **BIND9:** Notification if DNS service is down or unresponsive.
- **Sentinel Firewall:** Notification if Sentinel (CSF) is disabled.

---

## Resource Usage

Get alerts when resource usage exceeds thresholds (checked every 5 minutes):

* Load Average
* CPU %
* RAM %
* Disk Usage %
* SWAP %

![Resource Usage section with the load, CPU, memory, disk and swap thresholds](/img/davadmin-screenshots/settings/notifications-thresholds.png#gh-light-mode-only)
![Resource Usage section with the load, CPU, memory, disk and swap thresholds](/img/davadmin-screenshots/settings/notifications-thresholds_dark.png#gh-dark-mode-only)

---

## Server actions

Receive notifications when specific server-level actions are detected:

* **Server reboot:** Triggered when the server is restarted.
* **Unusual traffic or SYN flood:** Fires when suspicious traffic or DDoS attacks are detected. When enabled, an additional **Website traffic** section appears where you can set the **Max total connections** and **Max connections per IP** thresholds (on ports 80/443) that trigger the notification.
* **Out of Memory (OOM) errors:** Checks journal logs for system services and user processes killed by OOM in the last 24 hours.
* **DNS issue detected:** Triggered when the panel domain or nameservers are misconfigured or not resolving to this server. Disable if using external nameservers or a Cloudflare proxy.
* **DavAdmin login from new IP:** Triggered when the DavAdmin panel is accessed from an unrecognized IP address.
* **SSH login from new IP:** Triggered when root SSH access is detected from an unknown IP address. The IP can be whitelisted in the SSH Allowlist section below.
* **New update available:** Triggered when a new version of DavPanel is available for update.

![Server actions section with toggles for reboot, OOM, DNS and other server events](/img/davadmin-screenshots/settings/notifications-server.png#gh-light-mode-only)
![Server actions section with toggles for reboot, OOM, DNS and other server events](/img/davadmin-screenshots/settings/notifications-server_dark.png#gh-dark-mode-only)

---

## User Actions

Get notified whenever an action occurs in the admin or user panels.

![User actions section with toggles for account and domain change notifications](/img/davadmin-screenshots/settings/notifications-users.png#gh-light-mode-only)
![User actions section with toggles for account and domain change notifications](/img/davadmin-screenshots/settings/notifications-users_dark.png#gh-dark-mode-only)

- DavAdmin enabled/disabled
- API access enabled/disabled
- Admin account created
- Reseller account created
- Admin password changed
- Admin/Reseller renamed
- Admin/Reseller suspended
- Admin/Reseller unsuspended
- WAF enabled/disabled for a domain
- WAF enabled/disabled on the server
- User added
- User deleted
- User suspended/unsuspended
- User email changed
- User IP changed
- User password changed
- User renamed
- FTP account created
- FTP account deleted
- FTP account password change
- Domain added
- Domain deleted
- Domain suspended/unsuspended
- SSL type changed
- HSTS enabled/disabled

---

## SSH Allowlist

Specify IP addresses (or CIDRs) that will be exempt from SSH login checks.

![SSH Allowlist section with the allowed IP addresses](/img/davadmin-screenshots/settings/notifications-ssh.png#gh-light-mode-only)
![SSH Allowlist section with the allowed IP addresses](/img/davadmin-screenshots/settings/notifications-ssh_dark.png#gh-dark-mode-only)

---

## SMTP Settings

No SMTP server is configured by default — email notifications will **not** be sent until you set one up here.

![SMTP section with the mail server settings and the Test SMTP connection button](/img/davadmin-screenshots/settings/notifications-smtp.png#gh-light-mode-only)
![SMTP section with the mail server settings and the Test SMTP connection button](/img/davadmin-screenshots/settings/notifications-smtp_dark.png#gh-dark-mode-only)

To configure an SMTP server for email delivery, configure the following:

<Tabs>
  <TabItem value="davadmin-notifications-smtp" label="With DavAdmin" default>
    Set server port, TLS or SSL, Username and Password to use for authentication.
  </TabItem>
  <TabItem value="CLI-notifications-smtp" label="With DavCLI">

Configure each value via `davcli config update` commands, for example:

```bash
davcli config update mail_server example.net
```

```bash
davcli config update mail_port 465
```

```bash
davcli config update mail_use_tls False
```

```bash
davcli config update mail_use_ssl True
```

```bash
davcli config update mail_username user@example.net
```

```bash
davcli config update mail_password strongpassword123
```

```bash
davcli config update mail_default_sender user@example.net
```

  </TabItem>
</Tabs>
