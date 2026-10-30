---
sidebar_label: "Access DavAdmin"
---

# How to Access the DavAdmin Panel (URL, Port and Login)

Run `davcli admin` command to find the address on which admin panel is accessible. Example output:

```bash
root@server:/home# davcli admin
● DavAdmin is running and is available on: https://server.davpanel.org:2087/
```

To login to admin panel you need a username and password.

![davadmin login page](/img/admin/davadmin_login_page.png)

Both username and password are random generated on installation.

To view admin accounts:

```bash
davcli admin list
```

To set a new password for the admin account run command: `davcli admin password USER_HERE NEW_PASSWORD_HERE`

Example:
```bash
root@server:/home# davcli admin password stefan ba63vfav7fq36vas
Password for user 'stefan' changed.

===============================================================
● DavAdmin is running and is available on: https://server.davpanel.co:2087/

- username: stefan
- password: ba63vfav7fq36vas

===============================================================
```
