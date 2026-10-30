---
sidebar_position: 1
---

# Services Status

*DavAdmin > Services > Status* allows Administrators to view current status and manage monitored system services or Docker containers.

![services_page](/img/admin/davadmin_services_status.png)

To add custom services to the list, edit the `/etc/davpanel/davadmin/config/services.json` file.

Default DavPanel services are actively monitored by the SentinelAI and on failure, DavAdmin will automatically try to determinate the root cause and restart them. If you manually stop a service, you should also disable this feature from the  [DavAdmin Notifications](/docs/admin/notifications/) page.

