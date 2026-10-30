---
sidebar_label: "Disable Terminal within DavAdmin"
---

# How to Disable the Web Terminal in the Admin Panel

If for some reason, you want to disable command-line *root* access through DavAdmin's Terminal feature, you can do that on your server.

There is no setting in DavAdmin to do so, but you can manually create a file that will disable this feature:

1. Log in to the server as root via SSH.
2. Execute the following command:
   ```bash
   touch /root/disable_davadmin_terminal_ui
   ```
