
# Admin

enable/disable the admin panel, reset password, add admin users, etc.

```bash
Usage: davcli admin <command> [options]

Commands:
  on                                            Enable and start the DavAdmin service.
  off                                           Stop and disable the DavAdmin service.
  port [new_port]                               Display or update DavAdmin port.
  log                                           Display the last 25 lines of the DavAdmin error log.
  logs                                          Display live logs for all DavAdmin services.
  list                                          List all current admin users.
  new <user> <pass> [--reseller|--super] [--plan=<name>] Add a new user, optionally as a reseller (on a reseller plan) or super admin.
  password <user> <pass>                        Reset the password for the specified admin user.
  update <user> --plan=<name> --allowed_plans=[] --max_accounts=<int> --max_disk_blocks=1000000 --logo_url=<url> Assign a reseller plan, limits, and branding for reseller.
  rename <old> <new>                            Change the admin username.
  suspend <user>                                Suspend admin user.
  unsuspend <user>                              Unsuspend admin user.
  delete <user>                                 Delete admin user.
  notifications <command> <param> [value]       Control notification preferences.

  Notifications Commands:
    check                                       Check and write notifications.
    get <param>                                 Get the value of the specified notification parameter.
    update <param> <value>                      Update the specified notification parameter with the new value.

Examples:
  davcli admin on
  davcli admin off
  davcli admin port
  davcli admin port 8443
  davcli admin log
  davcli admin logs
  davcli admin list
  davcli admin new stefan SuperStrong1
  davcli admin new stefan SuperStrong1 --reseller
  davcli admin new stefan SuperStrong1 --reseller --plan=reseller_basic
  davcli admin update stefan --plan=reseller_pro
  davcli admin new stefan SuperStrong1 --super
  davcli admin password stefan SuperStrong2
  davcli admin rename stefan pejcic
  davcli admin suspend pejcic
  davcli admin unsuspend pejcic
  davcli admin notifications check
  davcli admin notifications get reboot
  davcli admin notifications update reboot yes
  davcli admin notifications update load 10
  davcli admin notifications update webhook_url https://discord.com/api/webhooks/XXXX/YYYYYYY
  davcli admin notifications update webhook_url "https://discord.com/api/webhooks/XXXX/YYYYYYY https://hooks.slack.com/services/XXX"
```



### Check Status

Check if admin panel is enabled or disabled and display link on which the DavAdmin is accessibe:

```bash
davcli admin
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin
● DavAdmin is running and is available on: https://server.example.com:2087/
```
</details>

### Enable / Disable DavAdmin

DavAdmin can run in headless mode, that is to say without a front-end UI. This can further save on memory requirements and keep your server secure.

To disable access to the DavAdmin panel:

```bash
davcli admin off
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin off
Disabling the DavAdmin...
× DavAdmin is disabled. To enable it run 'davcli admin on'
```
</details>

To enable access to the DavAdmin panel:

```bash
davcli admin on
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin on
Enabling the DavAdmin...
● DavAdmin is running and is available on: https://server.example.com:2087/
```
</details>

### List Admin users

To view all admin accounts:

```bash
davcli admin list
```

Each line shows the username, role (`admin`, `user` or `reseller`) and whether the account is active (`1`) or suspended (`0`).

<details>
  <summary>Example output</summary>

```bash
# davcli admin list
stefan|admin|1
support|user|1
reseller1|reseller|1
olduser|user|0
```
</details>

### Create new Admin

To create new admin accounts:

```bash
davcli admin new <username> <password>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin new support SuperStrong1
Admin User 'support' created.
```
</details>

The username must be 5-30 letters, numbers or underscores, and the same rule applies to the new name in `admin rename`. The password must be 6-30 characters without spaces, the same rule DavAdmin uses, and can't start with `$$`, also for `admin password`.

<details>
  <summary>Example output</summary>

```bash
# davcli admin new support abc
ERROR: Password is invalid. It must be between 6 and 30 characters and can't contain spaces.
       docs: https://davpanel.com/docs/articles/davcli/admin/#create-new-admin
```
</details>


### Create new Reseller

To create new reseller accounts:

```bash
davcli admin new <username> <password> --reseller
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin new reseller1 SuperStrong1 --reseller
Reseller user 'reseller1' created.
```
</details>

To create the reseller on a [Reseller Package](/docs/admin/plans/reseller_packages) add `--plan=<package>`:

```bash
davcli admin new <username> <password> --reseller --plan=<package>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin new reseller1 SuperStrong1 --reseller --plan=reseller_basic
Reseller user 'reseller1' created.
Reseller reseller1 updated successfully.
```
</details>

### Create Super Admin

To create the super admin account (the `admin` role). Only one super admin can exist:

```bash
davcli admin new <username> <password> --super
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin new stefan SuperStrong1 --super
Super Administrator 'stefan' created.
```
</details>

### Update Reseller

To set allowed plans, limits and logo for a reseller account. Only the flags that are passed are changed:

```bash
davcli admin update <username> --allowed_plans=<id1,id2> --max_accounts=<NUMBER> --max_disk_blocks=<NUMBER> --logo_url=<URL>
```

To move the reseller to a [Reseller Package](/docs/admin/plans/reseller_packages) pass `--plan=<package>`. It sets Max Accounts, Max Disk Usage and allowed plans from the package, other flags passed together with it take precedence over the package's values. Moving to a package with fewer accounts or less disk than the reseller already uses is refused:

```bash
davcli admin update <username> --plan=<package>
```


<details>
  <summary>Example output</summary>

```bash
# davcli admin update reseller1 --allowed_plans=1,2 --max_accounts=10
Reseller reseller1 updated successfully.

# davcli admin update reseller1 --plan=reseller_small
Error: Reseller 'reseller1' has 12 accounts, plan 'reseller_small' allows only 10. Remove accounts first.
```
</details>

### Reset Admin Password

To reset the password for an admin user:

```bash
davcli admin password <username> <new_password>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin password stefan SuperStrong2
Password for user 'stefan' changed.

===============================================================
● DavAdmin is running and is available on: https://server.example.com:2087/

- username: stefan
- password: SuperStrong2

===============================================================
```
</details>

### Rename Admin User

To rename an existing admin user:

```bash
davcli admin rename <old_username> <new_username>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin rename support helpdesk
User 'support' renamed to 'helpdesk'.
```
</details>

### Suspend Admin User

To suspend an existing admin user:

```bash
davcli admin suspend <username>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin suspend helpdesk
User 'helpdesk' suspended successfully.
```
</details>

### Unsuspend Admin User

To unsuspend an existing admin user:

```bash
davcli admin unsuspend <username>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin unsuspend helpdesk
User 'helpdesk' unsuspended successfully.
```
</details>

### Delete Admin User

To delete an existing admin user:

```bash
davcli admin delete <username>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin delete helpdesk
User 'helpdesk' deleted successfully.
```
</details>

:::info
Note: User with 'admin' role can not be deleted.
:::



## Notifications

`davcli admin notifications` allows you to change the notification preferences.

Settings are stored in `/etc/davpanel/davadmin/config/notifications.ini` file. However, it is recommended not to modify this file directly. Instead, it's best to utilize the davcli commands.

#### Get

The `get` parameter allows you to view current notification settings.

```bash
davcli admin notifications get <OPTION>
```


<details>
  <summary>Example output</summary>

```bash
# davcli admin notifications get reboot
yes
```
</details>

#### Update

The `update` parameter allows you to change the notification settings.


```bash
davcli admin notifications update <OPTION> <NEW-VALUE>
```


<details>
  <summary>Example output</summary>

```bash
# davcli admin notifications update load 10
Updated load to 10
```
</details>

#### Check

Run all checks now and write notifications (same as running `davcli sentinel`):

```bash
davcli admin notifications check
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin notifications check
--------------------------------------------------------------------------------
  Sentinel - DavPanel server health monitor
--------------------------------------------------------------------------------
Checking services:
[✔] davpanel is active and responding.
[✔] admin is active.
[✔] caddy is active and responding.
[✔] podman.socket is active.
[✔] MariaDB container active and responding.
[✔] csf is active.
[✔] phpmyadmin container is active.
[✔] No OOM errors detected.
--------------------------------------------------------------------------------
Checking traffic:
[✔] No unusual traffic detected on web ports (80|443).
--------------------------------------------------------------------------------
Checking logins, resources, and DNS...
[✔] No new logins to DavAdmin.
[✔] No active SSH sessions.
[✔] Disk 41% < threshold 85%
[✔] Load 0.42 < threshold 20.
[✔] RAM 38% < threshold 85%
[✔] CPU 7% < threshold 90%
[✔] No SWAP configured.
[✔] All nameservers resolve to local IPs.
[✔] No dead user containers found (checked in 2s).
--------------------------------------------------------------------------------
All Tests Passed!
--------------------------------------------------------------------------------
18 PASS  0 WARN  0 FAIL
--------------------------------------------------------------------------------
```
</details>

#### Options

Any option from `notifications.ini` can be read or updated, `update` only changes options that are already in the file, so add a missing one to the file first. The main options are:

| Option        | Description                                                        | Default |
|---------------|--------------------------------------------------------------------|---------|
| `reboot`      | Notify when the server is rebooted.                                | `yes`   |
| `attack`      | Notify on unusual traffic or SYN flood (DDoS) attacks.             | `yes`   |
| `limit`       | Notify on Out of Memory (OOM) errors in the last 24 hours.         | `yes`   |
| `update`      | Notify when a new DavPanel update is available.                   | `yes`   |
| `dns`         | Notify when the panel domain or nameservers don't resolve to this server. | `no` |
| `login`       | Notify on DavAdmin logins from a new IP address.                  | `yes`   |
| `ssh`         | Notify on root SSH logins from a new IP address.                   | `yes`   |
| `services`    | Comma-separated list of services to monitor.                       | `panel,admin,caddy,podman,mysql,csf,phpmyadmin` |
| `load`        | Notify when server load is above this value.                       | `20`    |
| `cpu`         | Notify when CPU usage (%) is above this value.                     | `90`    |
| `ram`         | Notify when RAM usage (%) is above this value.                     | `85`    |
| `du`          | Notify when disk usage (%) is above this value.                    | `85`    |
| `swap`        | Notify when SWAP usage (%) is above this value.                    | `85`    |
| `webhook_url` | Also send notifications to these webhooks (e.g. Discord), multiple URLs are separated by spaces. | empty   |
| `ratelimit`   | Notify when visitors were blocked by the request rate limits, checked every 6 hours. | `no` |
| `max_total_conn` | Notify when total connections to ports 80/443 are above this value. | `5000` |
| `max_conn_per_ip` | Notify when one IP has more connections to port 80 or 443 than this value. | `200` |

The `[ACTIONS]` section of the file has a `yes`/`no` option for each DavCLI action that sends a notification, for example `user_create`, `domains_add`, `admin_api` or `docker_backup` (sent when `davcli docker-backup` fails).


### Port

View the current DavAdmin port:

```bash
davcli admin port
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin port
2087
```
</details>

Change the DavAdmin port (must be greater than 443). The port is opened in the firewall and DavAdmin is restarted:

```bash
davcli admin port <NUMBER>
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin port 8443
Changing port to: 8443
Opening port on firewall..
Restarting DavAdmin..
Done
```
</details>

Add `--no-restart` to skip opening the port in the firewall and restarting DavAdmin:
```bash
davcli admin port <NUMBER> --no-restart
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin port 8443 --no-restart
Changing port to: 8443
Make sure to open the new port on Firewall and restart DavAdmin service to apply new port.
Done
```
</details>


### View DavAdmin logs

To view [all DavAdmin logs](/docs/admin/services/logs/) live in split panes with `multitail` (press `q` to exit):

```bash
davcli admin logs
```


To tail DavAdmin error log:

```bash
davcli admin log
```

<details>
  <summary>Example output</summary>

```bash
# davcli admin log
Restarting DavAdmin service:
tail -f 25 /var/log/davpanel/admin/error.log

(last 25 lines of /var/log/davpanel/admin/error.log)
```
</details>




