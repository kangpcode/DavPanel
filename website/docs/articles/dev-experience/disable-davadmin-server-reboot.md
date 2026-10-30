---
sidebar_label: "Disable Reboot within DavAdmin"
---

# How to Disable Server Reboot in the Admin Panel

If for some reason, you want to disable *Server Reboot* feature through DavAdmin, you can do that on your server.

There is no setting in DavAdmin to do so, but you can manually create a file that will disable this feature:

1. Log in to the server as root via SSH.
2. Execute the following command:
   ```bash
   touch /root/disable_davadmin_reboot_ui
   ```
