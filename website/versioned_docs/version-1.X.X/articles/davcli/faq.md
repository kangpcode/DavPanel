# FAQ 

`davcli faq` displays answers to the most frequently asked questions:

```bash
davcli faq
```

<details>
  <summary>Example output</summary>

```bash
# davcli faq

Frequently Asked Questions

1. What is the login link for admin panel?

LINK: https://demo.davpanel.com:2087/
------------------------------------------------------------

2. What is the login link for user panel?

LINK: https://demo.davpanel.com:2083/
------------------------------------------------------------

3. How to restart DavAdmin or DavPanel services?

- DavPanel: docker restart davpanel
- DavAdmin: service admin restart
------------------------------------------------------------

4. How to reset admin password?

execute command davcli admin password USERNAME NEW_PASSWORD
------------------------------------------------------------

5. How to create new admin account?

execute command davcli admin new USERNAME PASSWORD
------------------------------------------------------------

6. How to list admin accounts?

execute command davcli admin list
------------------------------------------------------------

7. How to check DavPanel version?

execute command davcli --version
------------------------------------------------------------

8. How to update DavPanel?

execute command davcli update --force
------------------------------------------------------------

9. How to disable automatic updates?

execute command davcli config update autoupdate off
------------------------------------------------------------

10. Where are the logs?

- User panel errors:      /var/log/davpanel/user/error.log
- User panel access log:  /var/log/davpanel/user/access.log
- Admin panel errors:     /var/log/davpanel/admin/error.log
- Admin panel access log: /var/log/davpanel/admin/access.log
- Admin panel API access: /var/log/davpanel/admin/api.log
- Admin panel logins:     /var/log/davpanel/admin/login.log
- Admin panel alerts:     /var/log/davpanel/admin/notifications.log
- Admin panel crons:      /var/log/davpanel/admin/cron.log
------------------------------------------------------------

11. How to enable detailed logs?

- davcli config update dev_mode yes
------------------------------------------------------------
```
</details>
