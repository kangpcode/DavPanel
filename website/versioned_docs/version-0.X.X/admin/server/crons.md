---
sidebar_position: 4
---

# Cron jobs

*DavAdmin > Server >  DavPanel Cron Jobs* allows Administrators to view scheduled crons for DavAdmin and edit their schedule or enable/disable logging to `/etc/davpanel/davadmin/cron.log` file.

![screenshot](/img/admin/davadmin_cronjobs.png)

:::danger 
We recommend against editing the cronjobs!
Editing the schedule or commands is not recommended, as it may render certain features inaccessible. This should only be done in cases where fine-tuning execution on servers with low resources is necessary, or when instructed by the DavPanel support team. These are crons that DavPanel uses. If you want to add custom cronjobs, you can safely [add them in crontab for the root user](https://www.google.com/search?q=linux+add+cron).
:::

Cron format is:

```bash
SCHEDULE USER COMMAND
```
