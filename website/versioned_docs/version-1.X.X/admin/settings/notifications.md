---
sidebar_position: 7
---

# Notifications

Configure DavAdmin notifications and Email alerts settings.

<Tabs>
  <TabItem value="davadmin-notifications-view" label="With DavAdmin" default>

  To view or edit current notification settings, go to **DavAdmin > Settings > Notifications** or click the 'Edit Settings' button on the Notification page.
  
  ![davadmin notifications settings](/img/admin/davadmin_notifications_settings.png)

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

## Email

Configure email address to be used for receiving system notifications and alerts.

Enter your email address in the **Email for notifications** field. Leave it empty to disable email alerts.

If email address is set, daily usage report will be sent to the address, schedule is configurable from 'Advanced > System Cron Jobs'.

![report example](/img/admin/daily_report.png)


---

## Webhook

Send notifications to a webhook URL (discord or any other).

---

## Services

Receive notifications when services are down or unresponsive. Services are checked every 5 minutes.

- **DavPanel:** Notification if DavPanel UI fails.
- **DavAdmin:** Notification if DavAdmin UI fails.
- **Caddy:** Notification if webserver is not responding.
- **MySQL:** Notification if database is unreachable.
- **Docker:** Notification if Docker service is down.
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

---

## Server actions

Receive notifications when specific server-level actions are detected:

* Server rebooted
* Website under attack
* User reaches plan limit
* DavAdmin accessed from a new IP address
* New DavPanel update available

---

## User Actions

Get notified whenever an action occurs in the admin or user panels.

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

---

## SMTP Settings

By default, email alerts are sent from `noreply@davpanel.com`.

To use your own SMTP server for email delivery, configure the following:

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
