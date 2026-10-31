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
davcli admin
Description: Manage DavAdmin service and Administrators.
Usage: davcli admin <command> [options]
------------------------
davcli api
Description: Check status, enable or disable DavAdmin API access, and list available API endpoints.
Usage: davcli api <status|on|off|list>
------------------------
davcli backup
Description: Backs up (and restores) DavPanel/DavAdmin SYSTEM AND USER
Usage: davcli backup [--restore <ARCHIVE>] [--quiet]
------------------------
davcli config
Description: Get or update a value in the DavPanel configuration file.
Usage: davcli config <get|update> <setting_name> [new_value]
------------------------
davcli docker
Description: Open an interactive shell inside a system or user container, picking the user and container via fzf if not given.
Usage: davcli docker [<user> [<container>]]
------------------------
davcli docker-autostart
Description: Prefetch (pull) container images for services listed as autostart, skipping if free disk space is low.
Usage: davcli docker-autostart [-f|--force]
------------------------
davcli docker-backup
Description: Backs up every account whose backups the hosting provider manages, or one with --account.
Usage: davcli docker-backup [--parallel=N | --account=USERNAME]   (skip a user: touch /home/<context>/backup.off)
------------------------
davcli docker-collect_stats
Description: Collect resource usage information for user(s).
Usage: davcli docker-collect_stats <username|--all>
------------------------
davcli docker-logs
Description: Display log sizes for user and system containers
Usage: davcli docker-logs [--all|--system|--users|<USERNAME>]
------------------------
davcli docker-update
Description: Check for image updates across root's stack and every
Usage: davcli docker-update [IMAGE] [-y|--yes] [--dry-run]
------------------------
davcli domain
Description: View and set domain/ip for accessing panels.
Usage: davcli domain [set <domain_name> | ip] [--debug] [--no-restart]
------------------------
davcli domains-add
Description: Add a domain name for user.
Usage: davcli domains-add <DOMAIN_NAME> <USERNAME> [--docroot DOCUMENT_ROOT] [--php_version N.N] [--skip_caddy] [--skip_vhost] [--skip_containers] [--skip_dns] [--skip-sentinel] [--debug] [--hs_ed25519_public_key KEY --hs_ed25519_secret_key KEY]
------------------------
davcli domains-all
Description: Lists all domain names currently hosted on the server.
Usage: davcli domains-all [--docroot] [--php_version] [--json]
------------------------
davcli domains-cloudflare
Description: Enable/disable/check Cloudflare-only access to domains.
Usage: davcli domains-cloudflare <enable|disable|status> <DOMAIN_NAME [DOMAIN_NAME...]|--all> [-y]
------------------------
davcli domains-delete
Description: Delete a domain name.
Usage: davcli domains-delete <DOMAIN_NAME> [--debug]
------------------------
davcli domains-dns
Description: Manage DNS zones and the DNS server via subcommands (create, delete, reload, list, check, start/stop/restart, etc).
Usage: davcli domains-dns <reconfig|check|reload|show|list|create|delete|default|count|config|start|restart|hard-restart|stop> [DOMAIN] [-y]
------------------------
davcli domains-dnssec
Description: Enable DNSSEC for a domain, re-sign the zone after changes, or check its DNSSEC status.
Usage: davcli domains-dnssec <DOMAIN> [--update | --check]
------------------------
davcli domains-docroot
Description: View and change docroot for a domain.
Usage: davcli domains-docroot <DOMAIN_NAME> [update <DOCROOT>] [--debug]
------------------------
davcli domains-edit
Description: Open a domain's docroot directory, or its webserver vhost config file in nano with --ws.
Usage: davcli domains-edit <DOMAIN_NAME> [--ws]
------------------------
davcli domains-hsts
Description: Manage HSTS for a domain
Usage: davcli domains-hsts <domain> [enable|disable]
------------------------
davcli domains-ratelimit
Description: Set the per-ip and per-domain request rate limits in Caddy, server default or per domain.
Usage: davcli domains-ratelimit [status] [--json]
------------------------
davcli domains-ssl
Description: Check SSL for domain, add custom certificate, view files.
Usage: davcli domains-ssl <DOMAIN_NAME> [status|info|logs|auto|selfsigned|custom] [path/to/fullchain.pem path/to/key.pem] | davcli domains-ssl --notify
------------------------
davcli domains-stats
Description: Parse caddy access logs for users domains and generate static html
Usage: davcli domains-stats [USERNAME] [--debug]
------------------------
davcli domains-suspend
Description: Suspend a domain name
Usage: davcli domains-suspend <DOMAIN-NAME> [--comment="<COMMENT>"] [--by=admin|user] [--template=<NAME>]
------------------------
davcli domains-test
Description: Test a website speed through every layer (DNS, Caddy/WAF, Varnish, webserver, PHP, database), check limits and settings, and show the biggest issue with a fix.
Usage: davcli domains-test <DOMAIN_NAME>[/SUBFOLDER] [RUNS] [--load <N|auto>]
------------------------
davcli domains-unsuspend
Description: Unsuspend a domain name
Usage: davcli domains-unsuspend <DOMAIN-NAME> [--by=admin|user]
------------------------
davcli domains-update_ns
Description: Change nameservers for a single or all dns zones.
Usage: davcli domains-update_ns <DOMAIN_NAME | --all> [-y]
------------------------
davcli domains-user
Description: Lists all domain names currently owned by a specific user.
Usage: davcli domains-user <USERNAME> [--docroot|--php_version]
------------------------
davcli domains-varnish
Description: Check Varnish status for domain, enable/disable Varnish caching.
Usage: davcli domains-varnish <DOMAIN-NAME> [on|off] [--short]
------------------------
davcli domains-whoowns
Description: Check which username owns a certain domain name.
Usage: davcli domains-whoowns <DOMAIN-NAME> [--context] [--docroot]
------------------------
davcli email-manage
Description: Pass commands through to docker-mailserver's setup CLI inside the mailserver container.
Usage: davcli email-manage <COMMAND> [<ARGS>...]
------------------------
davcli email-quotas
Description: Fixes email permission issues for all domains.
Usage: davcli email-quotas
------------------------
davcli email-ratelimit
Description: Configure rate-limiting using postfwd for domains and users.
Usage: davcli email-ratelimit [--username=<user>] [--domain=<domain>] [--all-users] [--delete-user=<user>] [--delete-domain=<domain>] [--skip-reload] [--notify]
------------------------
davcli email-server
Description: Manage mailserver
Usage: davcli email-server <status|config|install|uninstall|start|stop|restart|queue|flush|view|unhold|delete|fail2ban|ports|postconf|logs|login|supervisor|postfwd|pflogsumm|update-check|update-packages|versions> [args] [--debug]
------------------------
davcli email-setup
Description: Setup email addresses, forwarders, filters..
Usage: davcli email-setup <COMMAND> <ATTRIBUTES>
------------------------
davcli email-usage
Description: Refresh the cached email accounts and quota usage file for users.
Usage: davcli email-usage <USERNAME|--all>
------------------------
davcli email-webmail
Description: Display or update the domain used for accessing webmail.
Usage: davcli email-webmail [--debug] [domain <domain>]
------------------------
davcli faq
Description: Display answers to most frequently asked questions.
Usage: davcli faq
------------------------
davcli files-calculate_resellers_storage
Description: Calculates total disk usage for all resellers.
Usage: davcli files-calculate_resellers_storage
------------------------
davcli files-fix_permissions
Description: Fix permissions for users /home directory files inside the container.
Usage: davcli files-fix_permissions <USERNAME|--all> [PATH] [--debug]
------------------------
davcli files-malware_scan
Description: Scan a user's (or every user's) html_data files for malware
Usage: davcli files-malware_scan <USERNAME> OR davcli files-malware_scan --all
------------------------
davcli files-purge_trash
Description: Auto-purge .Trash folders for users.
Usage: davcli files-purge_trash [--user USERNAME] [--force] [--dry-run]
------------------------
davcli ftp-add
Description: Create FTP sub-user for davpanel user.
Usage: davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME> [--quota=<MB>] [--debug]
------------------------
davcli ftp-connections
Description: Display all active FTP connections, or only those for domains owned by an DavPanel user.
Usage: davcli ftp-connections [DAVPANEL_USERNAME]
------------------------
davcli ftp-delete
Description: Delete FTP sub-user for davpanel user.
Usage: davcli ftp-delete <username> <davpanel_username> [--debug]
------------------------
davcli ftp-list
Description: List FTP sub-users for davpanel user.
Usage: davcli ftp-list [DAVPANEL_USERNAME] [--json]
------------------------
davcli ftp-logs
Description: View the FTP server log
Usage: davcli ftp-logs
------------------------
davcli ftp-password
Description: Change password for FTP sub-user of davpanel user.
Usage: davcli ftp-password <username> <new_password> <davpanel_username> [--debug]
------------------------
davcli ftp-path
Description: Change FTP path for a user.
Usage: davcli ftp-path <username> <path> <davpanel_username> [--debug]
------------------------
davcli ftp-quota
Description: Show or set the disk quota for an FTP sub-user.
Usage: davcli ftp-quota <username> [<quota>] <davpanel_username> [--debug]
------------------------
davcli imunify
Description: Install and manage ImunifyAV service.
Usage: davcli imunify [status|start|stop|install|update|uninstall]
------------------------
davcli license
Description: Manage DavPanel Enterprise license.
Usage: davcli license [key|verify|info|delete|<LICENSE_KEY>] [--json] [--no-restart]
------------------------
davcli php-default
Description: View or change the default PHP version used for new domains added by user.
Usage: davcli php-default <USERNAME> [--update <PHP_VERSION>]
------------------------
davcli php-domain
Description: View or change the PHP version used for a single domain name.
Usage: davcli php-domain <DOMAIN_NAME> [--update <PHP_VERSION>]
------------------------
davcli phpmyadmin
Description: View and set domain/ip for phpmyadmin access.
Usage: davcli phpmyadmin [set <domain_name> | ip]
------------------------
davcli plan-apply
Description: Change plan for a user and apply new plan limits.
Usage: davcli plan-apply <PLAN_ID> <USERNAME>... [--all] [--cpu] [--ram] [--dsk] [--net] [--email] [--debug]
------------------------
davcli plan-create
Description: Create a new hosting plan (Package) and set its limits.
Usage: davcli plan-create name="<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<NAME> max_email_quota=<COUNT> max_hourly_email=<COUNT> [reseller=<USERNAME>]
------------------------
davcli plan-delete
Description: Delete hosting plan
Usage: davcli plan-delete <PLAN_NAME> [--json]
------------------------
davcli plan-edit
Description: Edit an existing hosting plan (Package) and modify its parameters.
Usage: davcli plan-edit id=<ID> name="<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<NAME> max_email_quota=<COUNT> max_hourly_email=<COUNT> [--debug]
------------------------
davcli plan-list
Description: Display all plans: id, name, description, limits..
Usage: davcli plan-list [--json]
------------------------
davcli plan-usage
Description: Display all users that are currently using the plan.
Usage: davcli plan-usage <PLAN_NAME> [--json]
------------------------
davcli port
Description: View and change port for accessing davpanel.
Usage: davcli port [set <port> | default] [--no-restart]
------------------------
davcli proxy
Description: View and change proxy path '/davpanel' for accessing davpanel.
Usage: davcli proxy [set <path>|default] [--no-restart]
------------------------
davcli report
Description: Generate a system report and send it to DavPanel support team.
Usage: davcli report [--public|--link|--upload] [--non-interactive] [--user <USERNAME>]
------------------------
davcli sentinel
Description: Check system services, traffic and resource usage, and log/send custom notifications on request.
Usage: davcli sentinel [--startup] [--report] [--action=<name> --title=<title> --message=<msg> [--severity=<level>] [--details=<json> [--merge-key=<key>]] [--no-send]]
------------------------
davcli server-logrotate
Description: Configures logrotate for caddy, davpanel, syslog.
Usage: davcli server-logrotate
------------------------
davcli server-migrate
Description: Migrates all data from this server to another.
Usage: davcli server-migrate -h <DESTINATION_IP> --user root --password <DESTINATION_PASSWORD> [--force] [--exclude-* options]
------------------------
davcli update
Description: Check if update is available, install updates.
Usage: davcli update [--check | --force [--no-restart] | --admin | --panel | --cli | --translations | --system | --modules | --compose | --env | --php | --wp | --ols | --apache | --clamav | --phpmyadmin | --postgres | --skeleton | --ssh | --varnish | --cron]
------------------------
davcli user-2fa
Description: Check or disable 2FA for a user.
Usage: davcli user-2fa <username> [disable]
------------------------
davcli user-add
Description: Create a new user with the provided plan_name.
Usage: davcli user-add <USERNAME> <PASSWORD|generate> <EMAIL> "<PLAN_NAME>" [--send-email] [--debug] [--webserver="<nginx|apache|openresty|openlitespeed|litespeed|varnish+nginx|varnish+apache|varnish+openresty|varnish+openlitespeed>"] [--sql=<mysql|mariadb>] [--reseller=<RESELLER_USERNAME>] [--private-note="this user.."] [--no-sentinel]
------------------------
davcli user-backup
Description: Creates a full account .tar.gz backup of a single DavPanel user account.
Usage: davcli user-backup --account <USER> [--output <DIR>] [--quiet] [--no-throttle]
------------------------
davcli user-block_ip
Description: View, add, or remove blocked IP addresses for a user's domains.
Usage: davcli user-block_ip <username> [--list='ip_here another_ip' | --delete-all]
------------------------
davcli user-change_plan
Description: Change plan for a user and apply new plan limits.
Usage: davcli user-change_plan <USERNAME> <NEW_PLAN_NAME> [--debug]
------------------------
davcli user-check
Description: Performs comprehensive security checks on user files, rootless Podman instance and containers.
Usage: davcli user-check <USERNAME>
------------------------
davcli user-daily_summary
Description: Save yesterday's summary for users with the Summary module and email it to those who turned it on.
Usage: davcli user-daily_summary <USERNAME> [--date YYYY-MM-DD] [--dry-run] OR davcli user-daily_summary --all [--date YYYY-MM-DD] [--dry-run]
------------------------
davcli user-delete
Description: Delete user account and permanently remove all their data.
Usage: davcli user-delete <username> [-y]
------------------------
davcli user-email
Description: Change email for user
Usage: davcli user-email <USERNAME> <NEW_EMAIL>
------------------------
davcli user-error_report
Description: Email users the errors found in their websites' logs in the last 24 hours.
Usage: davcli user-error_report <USERNAME> [--dry-run] OR davcli user-error_report --all [--dry-run]
------------------------
davcli user-ip
Description: Assign or remove dedicated IP to a user.
Usage: davcli user-ip <USERNAME> <IP | DELETE> [-y] [--debug]
------------------------
davcli user-list
Description: Display all users: id, username, email, plan, registered date,
Usage: davcli user-list [--json] [--total] [--quota]
------------------------
davcli user-login
Description: Generate an auto-login link for DavPanel user.
Usage: davcli user-login <username> [--open|--delete]
------------------------
davcli user-loginlog
Description: View user's .lastlogin file with last 20 successfull logins.
Usage: davcli user-loginlog <USERNAME> [--table|--text|--json]
------------------------
davcli user-password
Description: Reset password for a user.
Usage: davcli user-password <USERNAME> <NEW_PASSWORD | random>
------------------------
davcli user-quota
Description: Report or set disk and inodes for users.
Usage: davcli user-quota [--update <username|--all>]
------------------------
davcli user-rename
Description: Rename username.
Usage: davcli user-rename <old_username> <new_username>
------------------------
davcli user-report
Description: Prints a health report for a user: what is working and what needs attention.
Usage: davcli user-report <USERNAME|--all> [--section <name,...>] [--json]
------------------------
davcli user-restore
Description: Restores a single DavPanel user account from a full account .tar.gz backup.
Usage: davcli user-restore --file <ARCHIVE> [--force] [--new-username=NAME] [--reseller=NAME] [--quiet] [--temp-dir=<PATH> ]
------------------------
davcli user-suspend
Description: Suspend user: stop all containers and suspend domains.
Usage: davcli user-suspend <USERNAME> [-y] [--debug]
------------------------
davcli user-transfer
Description: Transfers a single user account from this server to another.
Usage: davcli user-transfer --account <DAVPANEL_USER> --host <DESTINATION_IP> --username <DESTINATION_SSH_USERNAME> --password <DESTINATION_SSH_PASSWORD> [--port <SSH_PORT>] [--force] [--live-transfer]
------------------------
davcli user-unsuspend
Description: Unsuspend user: start all containers and unsuspend domains
Usage: davcli user-unsuspend <USERNAME> [--debug]
------------------------
davcli user-varnish
Description: Enable/disable Varnish Caching for user and display current status.
Usage: davcli user-varnish <USERNAME> [enable|disable|status]
------------------------
davcli version
Description: Displays the current (installed) version of DavPanel container image.
Usage: davcli version 
------------------------
davcli waf
Description: Manage CorazaWAF
Usage: davcli waf <status|enable|disable|domain|user|plugins|tags|ids|update|stats|count> [options]
------------------------
davcli websites-all
Description: Lists all websites currently hosted on the server.
Usage: davcli websites-all [TYPE]
------------------------
davcli websites-pagespeed
Description: Check Google PageSpeed data for website(s)
Usage: davcli websites-pagespeed <DOMAIN | -all>
------------------------
davcli websites-scan
Description: Scan user files for WP sites and add them to SiteManager interface.
Usage: davcli websites-scan <USERNAME|-all>
------------------------
davcli websites-secure
Description: WP Manager security rules for domain.
Usage: davcli websites-secure <DOMAIN> [--rules='RULE1 RULE2' | --disable-all | --list-active-rules]
------------------------
davcli websites-user
Description: Lists all websites and domains owned by a specific user.
Usage: davcli websites-user <USERNAME> [--type=] [--domains=] [--json]
------------------------
davcli websites-vulnerability
Description: Scan WP site for vulnerabilities.
Usage: davcli websites-vulnerability <DOMAIN | --all>
------------------------
davcli error
Description: Displays information for specific error ID received in DavPanel UI.
Usage: davcli error <ID_HERE>
------------------------
davcli locale
Description: Install locales (Languages) for DavPanel UI.
Usage: davcli locale <CODE>
------------------------
```
</details>

DavPanel's CLI wrapper and commands are bundled with the local source release.
The fork developer is Dhafa Nazula Permadi (kangpcode). Locale installers and
mail deployment inputs come from the installed release rather than remote shell
scripts. See `INSTALL.md` in the repository for release build and preflight checks.
