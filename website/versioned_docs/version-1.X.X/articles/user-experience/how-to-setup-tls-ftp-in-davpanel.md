# Setup TLS for FTP

This guide explains how to enable Explicit FTP over TLS (FTPS) in DavPanel using VSFTPD.

---

> [DavPanel Enterprise](https://davpanel.com/enterprise/) supports FTP access. Once enabled, a shared FTP server becomes available for all users.
> First follow this guide on how to enable FTP in DavPanel: [How to configure FTP server](/docs/articles/user-experience/how-to-setup-ftp-in-davpanel.md)

---

## Step 1: Add a Domain

To use TLS, you must have an SSL certificate available on the server. Start by adding a domain in one of the following ways:

* **As an DavAdmin user** (for DavPanel/DavAdmin access):
  [https://davpanel.com/docs/admin/settings/general/#domain](https://davpanel.com/docs/admin/settings/general/#domain)

* **As an DavPanel user**:
  [https://davpanel.com/docs/panel/domains/new/](https://davpanel.com/docs/panel/domains/new/)

Once added, DavPanel will automatically generate an SSL certificate for the domain (if supported).

---

## Step 2: Verify SSL Certificate Files

Make sure the SSL certificate and private key files exist on the server.
If the certificate was auto-generated, the paths should look like this:

```bash
/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/DOMAIN_NAME/DOMAIN_NAME.crt
/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/DOMAIN_NAME/DOMAIN_NAME.key
```

Replace `DOMAIN_NAME` with your actual domain name.

---

## Step 3: Enable TLS in VSFTPD

1. Go to **DavAdmin → Services → FTP → Configuration**
   ![image](/img/docs-content/DZyrjCXF-1.png)
3. Paste the following configuration options to enable TLS:
  
   ⚠️ **Important:** Replace `DOMAIN_NAME` with your domain name in both file paths.
  
   ```bash
   # Enable SSL
   ssl_enable=YES
   rsa_cert_file=/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/DOMAIN_NAME/DOMAIN_NAME.crt
   rsa_private_key_file=/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/DOMAIN_NAME/DOMAIN_NAME.key
   
   allow_anon_ssl=NO
   force_local_data_ssl=YES
   force_local_logins_ssl=YES
  
   ssl_tlsv1=NO
   ssl_sslv2=NO
   ssl_sslv3=NO
   ssl_ciphers=HIGH
   ```

3. Click **Save** to apply the changes.
   ![image2](/img/docs-content/52KQ9xYt-2.png)

---

## Step 4: Restart the FTP Service

1. Navigate to **DavAdmin → Services → Services Status**.
2. Locate the **FTP** service.
3. Click **Stop**, then **Start** to restart the service.

![image2](/img/docs-content/0vTJnjCB-3.png)
