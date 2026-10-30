# Setting Custom SSL Certificates for DavPanel, DavAdmin, and Webmail

⚠️ Currently, adding custom SSL certificates for DavPanel and Webmail is only possible from the terminal.

- Let's Encrypt certificates are stored in `/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/`
- Custom certificates must be placed in `/etc/davpanel/caddy/ssl/custom/`

---

## Custom SSL for DavAdmin and DavPanel

Follow these steps to configure a custom SSL certificate for DavAdmin and DavPanel interfaces:

### 1. Add the certificate

Create a directory `custom` in `/etc/davpanel/caddy/ssl/`:

```bash
mkdir -p /etc/davpanel/caddy/ssl/custom/
```

Then create directory name same as your domain
```bash
mkdir -p /etc/davpanel/caddy/ssl/custom/YOUR_DOMAIN_HERE/
```

Upload your SSL files to this directory and name them:

* `$DOMAIN.crt`
* `$DOMAIN.key`

**Example:**

```
/etc/davpanel/caddy/ssl/custom/srv.davpanel.com/srv.davpanel.com.crt
/etc/davpanel/caddy/ssl/custom/srv.davpanel.com/srv.davpanel.com.key
```

### 2. Set the domain

```bash
davcli domain set <DOMAIN_NAME>
```

**Example:**
```bash
davcli domain set srv.davpanel.com
```

### 3. Configure Caddy

Open the **Caddyfile**:
```bash
nano /etc/davpanel/caddy/Caddyfile
```

Find the section for your domain:

```
# START HOSTNAME DOMAIN #
example.net {
    reverse_proxy localhost:2087
}
```

Add the `tls` line after `reverse_proxy`:

```
tls /etc/davpanel/caddy/ssl/custom/srv.davpanel.com/srv.davpanel.com.crt /etc/davpanel/caddy/ssl/custom/srv.davpanel.com/srv.davpanel.com.key
```

👉 Replace `srv.davpanel.com` with your actual domain.

Restart Caddy to apply the certificate:

```bash
docker restart caddy
```

---

## Custom SSL for Webmail

### 1. Add the certificate

Create a directory for your domain:

```bash
mkdir -p /etc/davpanel/caddy/ssl/custom/YOUR_DOMAIN_HERE/
```

Upload your SSL files and name them:

* `$DOMAIN.crt`
* `$DOMAIN.key`

**Example:**

```
/etc/davpanel/caddy/ssl/custom/webmail.davpanel.com/webmail.davpanel.com.crt
/etc/davpanel/caddy/ssl/custom/webmail.davpanel.com/webmail.davpanel.com.key
```

### 2. Assign the domain

```bash
davcli email-webmail domain <DOMAIN_NAME>
```

**Example:**

```bash
davcli email-webmail domain webmail.davpanel.com
```

### 3. Configure Caddy

Open the **Caddyfile**:

```bash
nano /etc/davpanel/caddy/Caddyfile
```

Locate the Webmail section:

```
# START WEBMAIL DOMAIN #
webmail.example.net {
    reverse_proxy localhost:8080
}
# END WEBMAIL DOMAIN #
```

Add the `tls` line after `reverse_proxy`:

```
tls /etc/davpanel/caddy/ssl/custom/webmail.davpanel.com/webmail.davpanel.com.crt /etc/davpanel/caddy/ssl/custom/webmail.davpanel.com/webmail.davpanel.com.key
```

👉 Replace `webmail.davpanel.com` with your domain.

Restart Caddy to apply the changes:

```bash
docker restart caddy
```

---

## Custom SSL for Domains (End-Users)

End-users can add their own SSL certificates directly from the **DavPanel interface** if the `ssl` module and features are enabled.

📖 Documentation: [Custom SSL for Domains](https://davpanel.com/docs/panel/domains/ssl/#custom-ssl)
