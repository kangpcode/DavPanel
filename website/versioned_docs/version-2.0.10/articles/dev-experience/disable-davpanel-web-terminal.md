# Disable Terminal within DavPanel

If for some reason, you want to disable command-line access through **Davpanel > Containers > Terminal** page, you can do that on your server.

There is no setting in DavAdmin to do so, but you can manually create a file that will disable this feature:

1. Log in to the server as root via SSH.
2. Execute the following command:
   ```bash
   touch /etc/davpanel/disable_davpanel_terminal_ui
   ```



  
