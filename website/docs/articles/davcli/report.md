# Check server info

To check current server info you can use the following command:

```bash
davcli report
```

<details>
  <summary>Example output</summary>

```bash
# davcli report
Information collected successfully. Please provide content of the following file to the support team:
/var/log/davpanel/admin/reports/system_info_20260924101542.txt
```
</details>

To upload the report to support.davpanel.org and get a key to share when asking for support:
```bash
davcli report --public
```

<details>
  <summary>Example output</summary>

```bash
# davcli report --public
Information collected successfully. Please provide the following key to the support team:
XXXXXXXXXX
```
</details>

`--link` and `--upload` are aliases for `--public`.

For plain output without progress messages, screen clearing or colors (useful in scripts):
```bash
davcli report --non-interactive
```

<details>
  <summary>Example output</summary>

```bash
# davcli report --non-interactive
Information collected successfully. Please provide content of the following file to the support team:
/var/log/davpanel/admin/reports/system_info_20260924101542.txt
```
</details>

To also include details for one user when they report a problem (account and plan, domains, container status and resource usage, `.env` and `docker-compose.yml`, and the last 50 log lines of each of their containers):
```bash
davcli report --user <USERNAME>
```

<details>
  <summary>Example output</summary>

```bash
# davcli report --user stefan
Information collected successfully. Please provide content of the following file to the support team:
/var/log/davpanel/admin/reports/system_info_20260924101542.txt
```
</details>

Flags can be combined, e.g. `davcli report --user stefan --public`.

The report is saved to `/var/log/davpanel/admin/reports/` (readable by root only) and contains:

- **Quick Checks**: a short list of detected problems at the top: disks or inodes 90%+ full, less than 10% RAM available, high load, failed systemd units, inactive `admin`, `podman.socket` or `csf` services, stopped containers, OOM kills in the last 7 days, and a missing `/root/docker-compose.yml` or `davpanel.config`.
- **Versions**: DavPanel, Podman, podman-compose, MariaDB client, CSF and host images.
- **System**: date and time zone, hostname, OS and kernel, virtualization, CPU, uptime and load, memory, disk and inode usage, top processes by CPU and memory, OOM kills and failed systemd units.
- **Services**: DavPanel stack, host containers and their resource usage, and status of the `admin`, `podman.socket` and `csf` services.
- **User**: only with `--user`, see above.
- **Users**: number of users and how many containers are running for each user.
- **Logs**: last 50 lines of the DavAdmin error log, notifications, the `davpanel`, `caddy`, `davpanel_mysql` and `davpanel_redis` containers and the latest update log.
- **Network**: IP addresses, listening ports, DNS resolvers, DNS lookup and outbound HTTPS test.
- **Configuration**: `davpanel.config`, `admin.ini`, `Caddyfile` and `/root/.env`.

Passwords, secrets, tokens and keys in configuration files are replaced with `***REDACTED***`, and MariaDB login files are not included.
