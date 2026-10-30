# Server

Scripts for managing the server.

## Logrotate

Reads configuration: [`logrotate_enable`](/cli/config.html#logrotate-enable) [`logrotate_size_limit`](/cli/config.html#logrotate-size-limit) [`logrotate_retention`](/cli/config.html#logrotate-retention) [`logrotate_keep_days`](/cli/config.html#logrotate-keep-days) and configures logrotate for caddy, davpanel, syslog.

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
