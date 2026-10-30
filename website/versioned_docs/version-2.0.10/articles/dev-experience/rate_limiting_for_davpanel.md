# Limit DavPanel

Both DavPanel and DavAdmin interfaces have a built-in rate limiting and IP address blocking to protect against brute-force attacks.

This feature is enabled by default on all installations, and can be additionally customized via *DavAdmin > Settings > DavPanel* or from the terminal.

You can configure the maximum number of failed login attempts allowed per IP (default is `5` per minute) and the total number of failed attempts (default is `20`), after which the offending IP will be temporarily blocked by the firewall for one hour.

For DavPanel limits are configurable in: /etc/davpanel/davpanel/conf/davpanel.config file:
```bash
[USERS]
login_ratelimit=5
login_blocklimit=20
```

![user ratelimit](/img/panel/v1/user_block.png)

For DavAdmin limits are configurable in: /etc/davpanel/davadmin/config/admin.ini file:
```bash
[PANEL]
login_ratelimit=5
login_blocklimit=20
```

![admin ratelimit](/img/admin/admin_block.png)

If a user successfully logs in, the counter for `login_blocklimit` will reset.

Failed login attempts and blocked IP addresses are logged in the `/var/log/davpanel/admin/failed_login.log` file for DavAdmin and in the `/var/log/davpanel/user/failed_login.log` file for DavPanel.
