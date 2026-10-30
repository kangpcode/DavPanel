# DavAdmin System Crons

Cron jobs used by DavPanel are configured in **`/etc/cron.d/davpanel`** file and should **not be edited manually**, as they will be overwritten during updates.  

If you need to customize or add system cron jobs, use the **root user's crontab**.  


## docker-collect_stats --all
Command `davcli docker-collect_stats --all` collects the container stats for all users. THis data is visible by end-users From 'Resurce Usage' pag, and for Amdinistrators form *Users > single user*  page.

Default schedule: hourly (`0 * * * *`)

Documentation: https://dev.davpanel.com/cli/docker.html#Collect-Stats




## domains-stats
Command `davcli domains-stats` parses (Caddy) access logs for all active users and their domains/.

- **Default schedule:** daily at 02:30 (`30 2 * * *`)  
- **Documentation:** [davcli domains-stats](https://dev.davpanel.com/cli/domains.html#Parse-domain-access-logs)



## websites-pagespeed --all
Command `davcli websites-pagespeed --all` collects **Google PageSpeed** data for all websites on the server. This data is visible by end-users from Site Manager and WP Manager pages.

If user has configured pagespeed api keys, those will be used automatically for all their domains.

- **Default schedule:** daily at 04:00 (`0 4 * * *`)  
- **Documentation:** [davcli websites-pagespeed](https://dev.davpanel.com/cli/websites.html#PageSpeed)


## update
Command `davcli update` checks for DavPanel updates and performs them if `autopatch` or `autoupdate` are enabled.

- **Default schedule:** daily at 00:15 (`15 0 * * *`)  
- **Documentation:** [davcli update](https://dev.davpanel.com/cli/update.html)



## server-ips
Command `davcli server-ips` generates a fresh list of the server’s IP addresses.

- **Default schedule:** monthly on the 12th at 00:00 (`0 0 12 * *`)  
- **Documentation:** This command is DEPRECATED.


## ftp-users
Command `davcli ftp-users` recreates the FTP users file that displays users in DavAdmin interface.

- **Default schedule:** every 8 hours (`0 */8 * * *`)  
- **Documentation:** [davcli ftp-users](https://dev.davpanel.com/cli/ftp.html#Users)



## email-server pflogsumm
Command `davcli email-server pflogsumm` generates an **HTML email summary report**, visible in **DavAdmin > Emails > Summary Reports**.

- **Default schedule:** daily at 01:45 (`45 1 * * *`)  
- **Documentation:** [davcli email-server pflogsumm](https://dev.davpanel.com/cli/email.html#pflogsumm)



## docker-images --all
Command `davcli docker-images --all` checks all active user's container images for updates using [Cup 🥤](https://github.com/sergi0g/cup) and displays the data to end-users on *Containers > Image Updates* page.

- **Default schedule:** daily at 03:45 (`45 3 * * *`)  
- **Documentation:** [davcli docker-images](https://dev.davpanel.com/cli/docker.html#Images)



## files-purge_trash
Command `davcli files-purge_trash` purges **FileManager Trash folders** for all users, based on the `autopurge_trash` setting retention.

- **Default schedule:** daily at 04:45 (`45 4 * * *`)  
- **Documentation:** [davcli files-purge_trash](https://dev.davpanel.com/cli/files.html#Purge-Trash)



## waf-update
Command `davcli waf-update` updates the default **OWASP CRS WAF rules**. Logs can be viewed via: `davcli waf-update log`.

- **Default schedule:** monthly on the 1st at 00:00 (`0 0 1 * *`)  
- **Documentation:** [davcli waf-update](https://dev.davpanel.com/cli/waf.html#Update)



## docker-backup
Command `davcli docker-backup` executes a **backup for all users’ containers** This is disabled by default, as each end-user can then [schedule and manage their own backups from DavPanel UI](/docs/panel/files/backups/).

- **Default schedule:** `59 23 31 2 *`  
- **Documentation:** [Configuring DavPanel Backups: Admin-configured](/docs/articles/backups/configuring-backups/#1-admin-configured)



## sentinel
Command `davcli sentinel` runs the notification script for server monitoring.

- **Default schedule:** every 5 minutes (`*/5 * * * *`)  
- **Documentation:** [davcli sentinel](https://dev.davpanel.com/cli/sentinel.html)



## sentinel --report
Command `davcli sentinel --report` generates the [**daily usage report**](/docs/admin/settings/notifications).

- **Default schedule:** daily at 11:45 (`45 11 * * *`)
- **Documentation:** [davcli sentinel report](/docs/admin/settings/notifications)



## sentinel --startup
Command `davcli sentinel --startup` sends notification after server reboot.

- **Command:** `davcli sentinel --startup`
- **Default schedule:** `@reboot`



## Redis Temp Directory
At reboot, this cron ensures the Redis temporary directory exists with proper permissions.

- **Command:** `mkdir -p /tmp/redis && chmod 777 /tmp/redis`
- **Default schedule:** `@reboot`
