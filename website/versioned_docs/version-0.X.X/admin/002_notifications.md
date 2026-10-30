---
sidebar_position: 6
---

# Notifications

Notifications are accessible from the notification icon in upper right corner. 


DavPanel records the following actions:

- server reboot
- service is inactive
- update is available
- admin login from new ip address
- ssh login from new ip address
- high memory usage
- high average load 
- high cpu usage
- high disk usage
- high swap usage
- dns changed

Each notification  type can be disabled and threshold limits can be set by the Admin user.

<Tabs>
  <TabItem value="davadmin-notifications-view" label="With DavAdmin" default>

To view current notification settings, click on the bell icon in the top menu.
You can view the current settings, and modify them.

  </TabItem>
  <TabItem value="CLI-notifications-view" label="With DavCLI">

To view current notification settings run:

```bash
davcli admin notifications get <OPTION>
```

Example:

```bash
# davcli admin notifications get reboot
yes
```

To change the notification settings run:

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
    
To confirm receipt of a notification, select the checkmark icon located in front of it. Once a notification is confirmed, subsequent notifications of the same type will be logged if the issue persists. For instance, if a service is unavailable, the system will generate an initial notification. However, if you acknowledge the notification and the service remains unrecovered, the next time the check is executed, it will log another notification.

### Email alerts

To receive email alerts, simply add your email address to the 'Email for notifications' field or leave it empty to disable email alerts.


If enabled, by default DavPanel will send email alerts from noreply@davpanel.co

To configure your own SMTP for email delivery, you need to update values:

- mail_server - your domain or ip where email is hosted
- mail_port - outgoing smtp port (default is 465)
- mail_use_tls - default is False
- mail_use_ssl - default is True
- mail_username - email address to use for sending
- mail_password - password for email address
- mail_default_sender - email to display, defaults is same as mail_username

Each value is configured using `davcli config update` option. examples:

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
davcli config update mail_username stefan@example.net
```
```bash
davcli config update mail_password strongpass1231
```
```bash
davcli config update mail_default_sender stefan@example.net
```


### Daily Usage Reports

If email alerts are enabled, you will also receive Usage Reports:

