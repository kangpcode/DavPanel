
# Admin

enable/disable the admin panel, reset password, add admin users, etc.

```bash
Usage: davcli admin <command> [options]

Commands:
  on                                            Enable and start the DavAdmin service.
  off                                           Stop and disable the DavAdmin service.
  log                                           Display the last 25 lines of the DavAdmin error log.
  logs                                          Display live logs for all DavAdminn services.
  list                                          List all current admin users.
  new <user> <pass>                             Add a new user with the specified username and password.
  password <user> <pass>                        Reset the password for the specified admin user.
  update <user> --allowed_plans=[] --max_accounts=<int> --max_disk_blocks=1000000 Assign plans and set limits for reseller.
  rename <old> <new>                            Change the admin username.
  suspend <user>                                Suspend admin user.
  unsuspend <user>                              Unsuspend admin user.
  notifications <command> <param> [value]       Control notification preferences.

  Notifications Commands:
    check                                       Check and write notifications.
    get <param>                                 Get the value of the specified notification parameter.
    update <param> <value>                      Update the specified notification parameter with the new value.

Examples:
  davcli admin on
  davcli admin off
  davcli admin log
  davcli admin logs
  davcli admin list
  davcli admin new stefan SuperStrong1
  davcli admin password stefan SuperStrong2
  davcli admin rename stefan pejcic
  davcli admin suspend pejcic
  davcli admin unsuspend pejcic
  davcli admin notifications check
  davcli admin notifications get ssl
  davcli admin notifications update ssl true
```



### Check Status

Check if admin panel is enabled or disabled and display link on which the DavAdmin is accessibe:

```bash
davcli admin
```

Example:
```bash
# davcli admin
● DavAdmin is running and is available on: https://server.davpanel.co:2087/
```

### Enable / Disable DavAdmin

DavAdmin can run in headless mode, that is to say without a front-end UI. This can further save on memory requirements and keep your server secure.

To disable access to the DavAdmin panel:

```bash
davcli admin off
```

To enable access to the DavAdmin panel:

```bash
davcli admin on
```
### List Admin users

To view all admin accounts:

```bash
davcli admin list
```

### Create new Admin

To create new admin accounts:

```bash
davcli admin new <username> <password>
```


### Create new Reseller

To create new reseller accounts:

```bash
davcli admin new <username> <password> --reseller
```

### Reset Admin Password

To reset the password for an admin user:

```bash
davcli admin password <username> <new_password>
```

### Rename Admin User

To rename an existing admin user:

```bash
davcli admin rename <old_username> <new_username>
```

### Suspend Admin User

To suspend an existing admin user:

```bash
davcli admin suspend <username>
```

### Unsuspend Admin User

To unsuspend an existing admin user:

```bash
davcli admin unsuspend <username>
```

### Delete Admin User

To rename an existing admin user:

```bash
davcli admin delete <username>
```

:::info
Note: User with 'admin' role can not be deleted.
:::



## Notifications

`davcli admin notifications` allows you to change the notification preferences.

Settings are stored in `/etc/davpanel/davadmin/config/notifications.ini` file. However, it is recommended not to modify this file directly. Instead, it's best to utilize the davcli commands. This way, any changes made are immediately applied, and the admin service is automatically restarted only when necessary.

#### Get

The `get` parameter allows you to view current notification settings.

```bash
davcli admin notifications get <OPTION>
```

Example:

```bash
# davcli admin notifications get reboot
yes
```

#### Update

The `update` parameter allows you to change the notification settings.


```bash
davcli admin notifications update <OPTION> <NEW-VALUE>
```

Example:
```bash
davcli admin notifications update load 10
Updated load to 10
```

#### Options

Currently available options for notifications are:

- reboot
- attack
- limit
- update
- load
- swap
- cpu
- ram
- du


### View DavAdmin logs

To multitail [all DavAdmin logs](/logs.html):

```bash
davcli admin logs
```


To tail DavAdmin error log:

```bash
davcli admin log
```




