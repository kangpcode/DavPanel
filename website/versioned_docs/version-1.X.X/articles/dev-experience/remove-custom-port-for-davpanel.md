#  Removing the Port for DavPanel

By default, the DavPanel interface runs on a Gunicorn web server, while all other websites run on Caddy. This setup ensures that the admin panel remains accessible even if the main web server is down.

If you want to remove the port number for DavPanel and access it directly via your domain (e.g., `https://yourdomain.com/`), follow these steps:

1. Set port to `443`:
   ```bash
   davcli port set 443
   ```
3. Restart services to apply the change:
   ```bash
   docker restart davpanel caddy
   ```
