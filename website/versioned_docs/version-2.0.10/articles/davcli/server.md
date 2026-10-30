# Server

Scripts for managing the server.

## Logrotate

Reads configuration: [`logrotate_enable`](/docs/articles/davcli/config/#logrotate_enable) [`logrotate_size_limit`](/docs/articles/davcli/config/#logrotate_size_limit) [`logrotate_retention`](/docs/articles/davcli/config/#logrotate_retention) [`logrotate_keep_days`](/docs/articles/davcli/config/#logrotate_keep_days) and configures logrotate for caddy, davpanel, syslog.

```bash
davcli server-logrotate
```

## Migrate

Migrates all data from this server to another.

Usage: 
```bash
davcli server-migrate -h <DESTINATION_IP> --user root --password <DESTINATION_PASSWORD>
```

All available flags:
```bash
davcli server-migrate -h <remote_host> -u <remote_user> [--password <password>] [--exclude-home] [--exclude-logs] [--exclude-mail] [--exclude-bind] [--exclude-davpanel] [--exclude-mysql] [--exclude-stack] [--exclude-postupdate] [--exclude-users]
```
