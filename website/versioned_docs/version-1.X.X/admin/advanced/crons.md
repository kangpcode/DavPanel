---
sidebar_position: 4
---

# Cron jobs

**DavAdmin > Advanced > System Cron Jobs** lets Administrators view the scheduled cron tasks used by DavPanel, modify their schedules, or enable/disable logging to the file `/etc/davpanel/davadmin/cron.log`.

![screenshot](/img/admin/davadmin_cronjobs.png)


Changing schedules may cause some DavPanel features to stop working correctly. Only adjust these settings if:

- You need to fine-tune execution on servers with limited resources, or
- You have been advised to do so by DavPanel support.

These cron jobs are essential for DavPanel’s internal operations.

If you want to add your own custom cron jobs, use the root user’s crontab.
