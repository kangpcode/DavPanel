# DavPanel Log Files locations

DavPanel generates the following logs:

| Log file | Description |
|----------|-------------|
|`/var/log/davpanel/user/access.log`| access logs for the DavPanel|
|`docker logs davpanel`|verbose logs and errors for the DavPanel when dev_mode is enabled|
|`/var/log/davpanel/admin/access.log`|access logs for the DavAdmin |
|`/var/log/davpanel/admin/api.log`|DavAdmin API log |
|`/var/log/davpanel/admin/login.log`|DavAdmin successful logins|
|`/var/log/davpanel/admin/failed_login.log`|DavAdmin failed login attempts |
|`/var/log/davpanel/user/failed_login.log`|DavPanel failed login attempts |
|`/var/log/davpanel/admin/notifications.log`|DavAdmin notifications (system and 8ser alerts) |
|`/var/log/davpanel/admin/cron.log`|DavAdmin systme cron logs |
|`/var/log/davpanel/admin/error.log`|DavAdmin error log |


:::info
By default, logging for DavPanel, DavAdmin, and the API is minimal in production. Administrators can [enable dev_mode](/docs/articles/support/how-to-troubleshoot-davpanel-error/#dev-mode) during troubleshooting to view more verbose logs.
:::


Services used by DavPanel have the following logs:

| Log file | Description |
|----------|-------------|
|`docker logs davpanel_mysql`|MySQL error log|
|`docker logs davpanel_dns`|DNS service logs|


Logs can be viewed from the [DavAdmin > Services > Log Viewer](/docs/admin/services/logs/) and Administrators can even [add custom log files to DavAdmin Log Viewer](/docs/admin/services/logs/#settings).
