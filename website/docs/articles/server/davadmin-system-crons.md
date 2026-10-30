---
sidebar_label: "DavAdmin System Crons"
---

# System Cron Jobs Explained

Cron jobs used by DavPanel are configured in the **`/etc/cron.d/davpanel`** file and should **not be edited manually**. Schedules and logging can be changed from [DavAdmin > Server > Scheduled Actions](/docs/admin/advanced/crons), and the whole file is replaced with the default one when running [`davcli update --cron`](/docs/articles/davcli/update/).

Each job logs a line to `/var/log/davpanel/admin/cron.log` when it runs.

If you need to customize or add system cron jobs, use the **root user's crontab**.


## docker-collect_stats --all
Command `davcli docker-collect_stats --all` collects the container stats for all users. This data is visible to end-users from the *Resource Usage* page, and to Administrators from the *Users > single user* page.

- **Default schedule:** hourly (`0 * * * *`)
- **Documentation:** [davcli docker-collect_stats](/docs/articles/davcli/docker/#collect-stats)


## user-quota
Command `davcli user-quota` generates the disk and inodes usage report for all users and saves it to `/etc/davpanel/davpanel/quota_report.json`.

- **Default schedule:** every 5 minutes (`*/5 * * * *`)
- **Documentation:** [davcli user-quota](/docs/articles/davcli/user/#quota)


## domains-stats
Command `davcli domains-stats` parses (Caddy) access logs for all active users and their domains.

- **Default schedule:** daily at 02:30 (`30 2 * * *`)
- **Documentation:** [davcli domains-stats](/docs/articles/davcli/domains/#stats)


## websites-pagespeed --all
Command `davcli websites-pagespeed --all` collects **Google PageSpeed** data for all websites on the server. This data is visible to end-users from Site Manager and WP Manager pages.

If a user has configured PageSpeed API keys, those will be used automatically for all their domains.

- **Default schedule:** daily at 04:00 (`0 4 * * *`)
- **Documentation:** [davcli websites-pagespeed](/docs/articles/davcli/websites/#pagespeed)


## websites-vulnerability --all
Command `davcli websites-vulnerability --all` scans all WordPress websites on the server for known vulnerabilities in their plugins and themes.

- **Default schedule:** at 05:00 every second day (`0 5 */2 * *`)
- **Documentation:** [davcli websites-vulnerability](/docs/articles/davcli/websites/#vulnerability)


## files-calculate_resellers_storage
Command `davcli files-calculate_resellers_storage` calculates the total disk usage of each reseller's users and saves it to the reseller's limits file `/etc/davpanel/davadmin/resellers/<reseller>.json`.

- **Default schedule:** every 4 hours (`0 */4 * * *`)
- **Documentation:** [davcli files-calculate_resellers_storage](/docs/articles/davcli/files/#resellers-storage)


## update
Command `davcli update` checks for DavPanel updates and performs them if `autopatch` or `autoupdate` are enabled.

- **Default schedule:** daily at 00:15 (`15 0 * * *`)
- **Documentation:** [davcli update](/docs/articles/davcli/update/)


## ftp-users
Command `davcli ftp-users` recreates the FTP users file that displays users in DavAdmin interface.

- **Default schedule:** every 8 hours (`0 */8 * * *`)
- **Documentation:** [davcli ftp-users](/docs/articles/davcli/ftp/#users)


## email-server pflogsumm
Command `davcli email-server pflogsumm` generates an **HTML email summary report**, visible in **DavAdmin > Emails > Summary Reports**.

- **Default schedule:** daily at 01:45 (`45 1 * * *`)
- **Documentation:** [davcli email-server pflogsumm](/docs/articles/davcli/email/#pflogsumm)


## files-purge_trash
Command `davcli files-purge_trash` purges **FileManager Trash folders** for all users, based on the `autopurge_trash` setting retention.

- **Default schedule:** daily at 04:45 (`45 4 * * *`)
- **Documentation:** [davcli files-purge_trash](/docs/articles/davcli/files/#purge-trash)


## waf update
Command `davcli waf update` updates the default **OWASP CRS WAF rules**. Update history can be viewed with: `davcli waf update log`.

- **Default schedule:** monthly on the 1st at 00:00 (`0 0 1 * *`)
- **Documentation:** [davcli waf update](/docs/articles/davcli/waf/#update)


## backup
Command `davcli backup` backs up the DavPanel and DavAdmin system configuration. User data (website files, databases, mailboxes) is not included. Runs can be viewed from **DavAdmin > Backups > System > Runs**.

- **Default schedule:** weekly on Sunday at 01:00 (`0 1 * * 0`)
- **Documentation:** [davcli backup](/docs/articles/davcli/backup/)


## files-malware_scan --all
Command `davcli files-malware_scan --all` scans website files of all users with ClamAV and quarantines any infected file found. Requires ClamAV to be enabled on the server.

- **Default schedule:** weekly on Sunday at 00:00 (`0 0 * * 0`)
- **Documentation:** [davcli files-malware_scan](/docs/articles/davcli/files/#malware-scan)


## docker-backup
Command `davcli docker-backup` executes a **backup for all users' containers**. This is disabled by default, as each end-user can then [schedule and manage their own backups from DavPanel UI](/docs/panel/backups/).

- **Default schedule:** `59 23 31 2 *` (never runs)
- **Documentation:** [davcli docker-backup](/docs/articles/davcli/docker/#backup), [Configuring DavPanel Backups: Admin-configured](/docs/articles/backups/configuring-backups/#1-admin-configured)


## sentinel
Command `davcli sentinel` checks services, resource usage, traffic, logins and DNS, and sends alerts to DavAdmin > Notifications (and email/webhook). Notifications for issues that are resolved on a later run are marked as read.

- **Default schedule:** every 5 minutes (`*/5 * * * *`)
- **Documentation:** [davcli sentinel](/docs/articles/davcli/sentinel/)


## sentinel --report
Command `davcli sentinel --report` sends the [**daily usage report**](/docs/admin/settings/notifications) to the Administrator email address.

- **Default schedule:** daily at 11:45 (`45 11 * * *`)
- **Documentation:** [davcli sentinel](/docs/articles/davcli/sentinel/)


## sentinel --startup
Command `davcli sentinel --startup` runs after a server reboot: it prepares the Redis temporary directory, starts stopped containers for root and all users, and sends the reboot notification.

- **Default schedule:** `@reboot`
- **Documentation:** [davcli sentinel](/docs/articles/davcli/sentinel/)
