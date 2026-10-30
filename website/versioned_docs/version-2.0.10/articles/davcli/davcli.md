# DavCLI
DavPanel uses DavCLI, a command line interface designed for administrators to manage server from the terminal.

DavCLI keeps history of used commands and allows you to view last and top 5 used commands:
```bash
# davcli

Usage: davcli <COMMAND> [additional_arguments]

Suggested commands:
  davcli faq                       Display frequently asked questions and answers.
  davcli --help                    List all available DavCLI commands and their usage.

Recently used commands:
  davcli docker-collect_stats
  davcli faq
  davcli update
  davcli update_check
  davcli user-add

Most commonly used commands:
  davcli admin
  davcli docker-collect_stats
  davcli faq
  davcli update
  davcli update_check
```

DavCLI ships with real bash tab-completion (`lib/completion.bash`, installed to `/etc/bash_completion.d/davcli`). Typing `davcli` and pressing `TAB` suggests all available commands, and pressing `TAB` again after a command suggests its actual arguments — usernames, domain names, plan names, PHP versions, admin logins, FTP accounts, config/notification setting names, and more, all pulled live from the panel database and filesystem so suggestions always match what's actually on the server. It's installed and kept up to date automatically by `davcli update`, which also installs the `bash-completion` package if it's missing. Open a new shell session after updating for it to take effect.

## Help

`davcli help` command generates a list of available DavCLI commands on the current server:

```
davcli --help
```

As new commands are added gradually, they might not yet be available in your DavPanel version. To check if a command is available on a server, run `davcli <command> --help`.

<details>
  <summary>Example output</summary>

```bash
davcli server-ips
Description: Generates a file with a list of users with their dedicated IPs
Usage: davcli server-ips
------------------------
davcli server-logrotate
Description: Configures logrotate for caddy, davpanel, syslog.
Usage: davcli server-logrotate
------------------------
davcli server-migrate
Description: Migrates all data from this server to another.
Usage: davcli server-migrate -h <DESTINATION_IP> --user root --password <DESTINATION_PASSWORD> [--force] [--exclude-* options]
------------------------
davcli ftp-add
Description: Create FTP sub-user for davpanel user.
Usage: davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>
------------------------
davcli ftp-delete
Description: Delete FTP sub-user for davpanel user.
Usage: davcli ftp-delete <username> <davpanel_username> [--debug]
------------------------
davcli ftp-path
Description: Change FTP path for a user.
Usage: davcli ftp-path <username> <path> <davpanel_username> [--debug]
------------------------
davcli ftp-password
Description: Change password for FTP sub-user of davpanel user.
Usage: davcli ftp-password <username> <new_password> <davpanel_username> [--debug]
------------------------
davcli ftp-connections
Description: Display all active FTP connection or for particular DavPanel user.
Usage: davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>
------------------------
davcli ftp-logs
Description: View the FTP server log
Usage: davcli ftp-log
------------------------
davcli ftp-list
Description: List FTP sub-users for davpanel user.
Usage: davcli ftp-list [DAVPANEL_USERNAME] [--json]
------------------------
davcli patch
Description: Download and install a patch
Usage: davcli patch <NAME>
------------------------
davcli domain
Description: View and set domain/ip for accessing panels.
Usage: davcli domain [set <domain_name> | ip] [--debug]
------------------------
davcli phpmyadmin
Description: View and set domain/ip for phpMyAdmin access.
Usage: davcli phpmyadmin [set <domain_name> | ip]
------------------------
davcli api-list
Description: List available API endpoints with usage examples.
Usage: davcli api-list [--save]
------------------------
davcli api
Description: Check status, enable or disable DavAdmin API access, and list available API endpoints.
Usage: davcli api <status|on|off|list>
------------------------
davcli license
Description: Manage DavPanel Enterprise license.
Usage: davcli license verify 
------------------------
davcli faq
Description: Display answers to most frequently asked questions.
Usage: davcli faq
------------------------
davcli email-manage
Description: Manage mailserver configuration and overview.
Usage: davcli email-manage <COMMAND> <ATTRIBUTES>
------------------------
davcli email-server
Description: Manage mailserver
Usage: davcli email-server <status|config|install|start|stop|restart|queue|flush|view|unhold|delete|fail2ban|ports|logs|login|supervisor|postfwd|pflogsumm|update-check|update-packages|versions> [args] [--debug]
------------------------
davcli email-quotas
Description: Fixes email permission issues for all domains.
Usage: davcli email-quotas
------------------------
davcli email-ratelimit
Description: Configure rate-limiting using postfwd for domains and users.
Usage: davcli email-ratelimit
------------------------
davcli email-webmail
Description: Display or update the domain used for accessing webmail.
Usage: davcli email-webmail [--debug] [domain <domain>]
------------------------
davcli email-setup
Description: Setup email addresses, forwarders, filters..
Usage: davcli email-setup <COMMAND> <ATTRIBUTES>
------------------------
davcli update
Description: Check if update is available, install updates.
Usage: davcli update [--check | --force | --admin | --panel | --cli]
------------------------
davcli webserver-get_webserver_for_user
Description: View cached or check the installed webserver inside user container.
Usage: davcli webserver-get_webserver_for_user <USERNAME>
------------------------
davcli version
Description: Displays the current (installed) version of DavPanel container image.
Usage: davcli version 
------------------------
davcli dev
Description: Overwrite DavPanel container files and restart service to apply.
Usage: davcli dev [path]
------------------------
davcli sentinel
Description: Check system services, traffic and resource usage, and log/send custom notifications on request.
Usage: davcli sentinel [--startup] [--report] [--action=<name> --title=<title> --message=<msg>]
------------------------
davcli docker-collect_stats
Description: Collect resource usage information for user(s).
Usage: davcli docker-collect_stats <username|--all>
------------------------
davcli docker-usage_stats_cleanup
Description: Rotates resource usage logs for all users according to the resource_usage_retention setting.
------------------------
davcli docker-backup
Description: Generates a backup for all users.
Usage: davcli docker-backup
------------------------
davcli docker-autostart
Description: Prefetch (pull) container images for services listed as autostart, skipping if free disk space is low.
Usage: davcli docker-autostart [-f|--force]
------------------------
davcli docker-images
Description: Check images for updates.
Usage: davcli docker-images [--all|<USERNAME>]
------------------------
davcli docker-logs
Description: Display log sizes for user and system containers
Usage: davcli docker-logs [--all|--system|--users|<USERNAME>]
------------------------
davcli docker-limits
Description: Set global container limits for all containers combined.
Usage: davcli docker-limits [--apply | --apply SIZE | --read]
------------------------
davcli user-2fa
Description: Check or disable 2FA for a user.
Usage: davcli user-2fa <username> [disable]
------------------------
davcli user-redis
Description: Check and enable/disable REDIS for user.
Usage: davcli user-redis [check|enable|disable] <USERNAME>
------------------------
davcli user-loginlog
Description: View user's .lastlogin file with last 20 successfull logins.
Usage: davcli user-loginlog <USERNAME> [--table|--text|--json]
------------------------
davcli user-ssh
Description: Manage SSH settings for user.
Usage: davcli user-ssh <check|enable|disable> <username>
------------------------
davcli user-email
Description: Change email for user
Usage: davcli user-email <USERNAME> <NEW_EMAIL>
------------------------
davcli user-varnish
Description: Enable/disable Varnish Caching for user and display current status.
Usage: davcli user-varnish <USERNAME> [enable|disable|status]
------------------------
davcli user-add
Description: Create a new user with the provided plan_name.
Usage: davcli user-add <USERNAME> <PASSWORD|generate> <EMAIL> "<PLAN_NAME>" [--send-email] [--debug] [--webserver="<nginx|apache|openresty|openlitespeed|litespeed|varnish+nginx|varnish+apache|varnish+openresty|varnish+openlitespeed>"] [--sql=<mysql|mariadb>] [--reseller=<RESELLER_USERNAME>] [--private-note="this user.."] [--no-sentinel]
------------------------
davcli user-rename
Description: Rename username.
Usage: davcli user-rename <old_username> <new_username>
------------------------
davcli user-delete
Description: Delete user account and permanently remove all their data.
Usage: davcli user-delete <username> [-y] [--all]
------------------------
davcli user-resources
Description: View services limits for user.
Usage: davcli user-resources <CONTEXT> [--activate=<SERVICE_NAME>] [--deactivate=<SERVICE_NAME>] [--update_cpu=<FLOAT>] [--update_ram=<FLOAT>] [--service=<NAME>] [--json]
------------------------
davcli user-change_plan
Description: Change plan for a user and apply new plan limits.
Usage: davcli user-change_plan <USERNAME> <NEW_PLAN_NAME>
------------------------
davcli user-password
Description: Reset password for a user.
Usage: davcli user-password <USERNAME> <NEW_PASSWORD | RANDOM> [--ssh]
------------------------
davcli user-memcached
Description: Check and enable/disable Memcached for user.
Usage: davcli user-memcached [check|enable|disable] <USERNAME>
------------------------
davcli user-login
Description: Login as a user container.
Usage: davcli user-login <USERNAME>
------------------------
davcli user-unsuspend
Description: Unsuspend user: start all containers and unsuspend domains
Usage: davcli user-unsuspend <USERNAME>
------------------------
davcli user-ip
Description: Assing or remove dedicated IP to a user.
Usage: davcli user-ip <USERNAME> <IP | DELETE> [-y] [--debug]
------------------------
davcli user-block_ip
Description: View, add, or remove blocked IP addresses for a user's domains.
Usage: davcli user-block_ip <username> [--list='ip_here another_ip' | --delete-all]
------------------------
davcli user-suspend
Description: Suspend user: stop all containers and suspend domains.
Usage: davcli user-suspend <USERNAME>
------------------------
davcli user-list
Description: Display all users: id, username, email, plan, registered date.
Usage: davcli user-list [--json]
------------------------
davcli user-transfer
Description: Transfers a single user account from this server to another.
Usage: davcli user-transfer --account <DAVPANEL_USER> --host <DESTINATION_IP> --username <DESTINATION_SSH_USERNAME> --password <DESTINATION_SSH_PASSWORD> [--live-transfer]
------------------------
davcli user-backup
Description: Creates a full account .tar.gz backup of a single DavPanel user account.
Usage: davcli user-backup --account <USER> [--output <DIR>] [--quiet]
------------------------
davcli user-restore
Description: Restores a single DavPanel user account from a full account .tar.gz backup.
Usage: davcli user-restore --file <ARCHIVE> [--force] [--new-username=NAME] [--quiet] [--temp-dir=<PATH>]
------------------------
davcli user-check
Description: Performs comprehensive security checks on user files, rootless Podman instance and containers.
Usage: davcli user-check <USERNAME>
------------------------
davcli user-quota
Description: Enforce and recalculate disk and inodes for a user.
Usage: davcli user-quota <username|--all>
------------------------
davcli report
Description: Generate a system report and send it to DavPanel support team.
Usage: davcli report [--public|--link|--upload] [--non-interactive]
------------------------
davcli websites-scan
Description: Scan user files for WP sites and add them to SiteManager interface.
Usage: davcli websites-scan <USERNAME|-all>
------------------------
davcli websites-all
Description: Lists all websites currently hosted on the server.
Usage: davcli websites-all [TYPE]
------------------------
davcli websites-user
Description: Lists all websites and domains owned by a specific user.
Usage: davcli websites-user <USERNAME> [--type=] [--domains=] [--json]
------------------------
davcli websites-pagespeed
Description: Check Google PageSpeed data for website(s)
Usage: davcli websites-pagespeed <DOMAIN> [-all]
------------------------
davcli websites-secure
Description: WP Manager security rules for domain.
Usage: davcli websites-secure <DOMAIN> [--rules='RULE1 RULE2' | --disable-all | --list-active-rules]
------------------------
davcli websites-vulnerability
Description: Scan WP site for vulnerabilities.
Usage: davcli websites-vulnerability <DOMAIN> [--all]
------------------------
davcli imunify
Description: Install and manage ImunifyAV service.
Usage: davcli imunify [status|start|stop|install|update|uninstall]
------------------------
davcli config
Description: Get or update a value in the DavPanel configuration file.
Usage: davcli config [get|update] <parameter_name> [new_value]
------------------------
davcli docker
Description: Open an interactive shell inside a system or user container, picking the user and container via fzf if not given.
Usage: davcli docker [<user> [<container>]]
------------------------
davcli install
Description: Create cronjobs and configuration files needed for davpanel.
Usage: davcli install
------------------------
davcli imav-deploy
------------------------
davcli port
Description: View and change port for accessing davpanel.
Usage: davcli port [set <port>] 
------------------------
davcli plan-delete
Description: Delete hosting plan
Usage: davcli plan-delete <PLAN_NAME>
------------------------
davcli plan-list
Description: Display all plans: id, name, description, limits..
Usage: davcli plan-list [--json]
------------------------
davcli plan-edit
Description: Edit an existing hosting plan (Package) and modify its parameters.
Usage: davcli plan-edit --debug id=<ID> name"<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<DEFAULT>
------------------------
davcli plan-usage
Description: Display all users that are currently using the plan.
Usage: davcli plan-usage <PLAN_NAME> [--json]
------------------------
davcli plan-apply
Description: Change plan for a user and apply new plan limits.
Usage: davcli plan-apply <NEW_PLAN_ID> <USERNAME>
------------------------
davcli plan-create
Description: Create a new hosting plan (Package) and set its limits.
Usage: davcli plan-create name"<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<NAME>
------------------------
davcli php-domain
Description: View or change the PHP version used for a single domain name.
Usage: davcli php-domain <domain_name>
------------------------
davcli php-ini
Description: View or change php.ini values of any php version for a user.
Usage: davcli php-ini <username> <action> <setting> [value]
------------------------
davcli php-default
Description: View or change the default PHP version used for new domains added by user.
Usage: davcli php-default <username>
------------------------
davcli admin
Description: Manage DavAdmin service and Administrators.
Usage: davcli admin <command> [options]
------------------------
davcli waf
Description: Manage CorazaWAF
Usage: davcli waf <setting> 
------------------------
davcli files-calculate_resellers_storage
Description: Calculates total disk usage for all resellers.
Usage: davcli files-calculate_resellers_storage
------------------------
davcli files-fix_permissions
Description: Fix permissions for users /home directory files inside the container.
Usage: davcli files-fix_permissions <USERNAME|--all> [PATH] [--debug]
------------------------
davcli files-purge_trash
Description: Auto-purge .Trash folders for users.
Usage: davcli files-purge_trash [--user USERNAME] [--force] [--dry-run]
------------------------
davcli firewall-reset
Description: Deletes all container related ports from CSF and opens exposed ports.
------------------------
davcli domains-dnssec
Description: Enable DNSSEC for a domain and re-sign after changes in the zone.
Usage: davcli domains-dnssec <DOMAIN> [--update | --check]
------------------------
davcli domains-update_ns
Description: Change nameservers for a single or all dns zones.
Usage: davcli domains-update_ns <DOMAIN_NAME>
------------------------
davcli domains-all
Description: Lists all domain names currently hosted on the server.
Usage: davcli domains-all [--docroot] [--php_version] [--json]
------------------------
davcli domains-varnish
Description: Check Varnish status for domain, enable/disable Varnish caching.
Usage: davcli domains-varnish <DOMAIN-NAME> [on|off] [--short]
------------------------
davcli domains-hsts
Description: Manage HSTS for a domain
Usage: davcli domains-hsts <domain> [enable|disable]
------------------------
davcli domains-add
Description: Add a domain name for user.
Usage: davcli domains-add <DOMAIN_NAME> <USERNAME> [--docroot DOCUMENT_ROOT] [--php_version N.N] [--skip_caddy] [--skip_vhost] [--skip_containers] [--skip_dns] [--skip-sentinel] [--debug] [--hs_ed25519_public_key KEY --hs_ed25519_secret_key KEY]
------------------------
davcli domains-delete
Description: Delete a domain name.
Usage: davcli domains-delete <DOMAIN_NAME> --debug
------------------------
davcli domains-whoowns
Description: Check which username owns a certain domain name.
Usage: davcli domains-whoowns <DOMAIN-NAME> [--context] [--docroot]
------------------------
davcli domains-unsuspend
Description: Unsuspend a domain name
Usage: davcli domains-unsuspend <DOMAIN-NAME>
------------------------
davcli domains-dns
Description: Manage DNS zones and the DNS server via subcommands (create, delete, reload, list, check, start/stop/restart, etc).
Usage: davcli domains-dns <reconfig|check|reload|show|list|create|delete|default|count|config|start|restart|hard-restart|stop> [DOMAIN]
------------------------
davcli domains-user
Description: Lists all domain names currently owned by a specific user.
Usage: davcli domains-user <USERNAME> [--docroot|--php_version]
------------------------
davcli domains-suspend
Description: Suspend a domain name
Usage: davcli domains-suspend <DOMAIN-NAME>
------------------------
davcli domains-ssl
Description: Check SSL for domain, add custom certificate, view files.
Usage: davcli domains-ssl <DOMAIN_NAME> [status|info|logs|auto|custom] [path/to/fullchain.pem path/to/key.pem]
------------------------
davcli domains-edit
Description: Open a domain's docroot directory, or its webserver vhost config file in nano with --ws.
Usage: davcli domains-edit <DOMAIN_NAME> [--ws]
------------------------
davcli domains-docroot
Description: View and change docroot for a domain.
Usage: davcli domains-docroot <DOMAIN_NAME> [update </var/www/html/>] --debug
------------------------
davcli domains-stats
Description: Parse caddy access logs for users domains and generate static html
Usage: davcli domains-stats
------------------------
davcli proxy
Description: View and change proxy path '/davpanel' for accessing davpanel.
Usage: davcli proxy [set <path>|default]
------------------------
davcli error
Description: Displays information for specific error ID received in DavPanel UI.
Usage: davcli error <ID_HERE>
------------------------
davcli locale
Description: Install locales (Languages) for DavPanel UI.
Usage: davcli locale <CODE>
```
</details>
