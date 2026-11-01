# Installing DavPanel

Before starting, ensure your server meets [the minimum requirements](/docs/admin/intro/#requirements) and runs a supported distribution.

To install DavPanel on your server:

1. Log in to your new server;
- as root via SSH or
- as a user with sudo privileges and type "sudo -i"
2. Copy and paste davpanel installation command into the terminal
```shell
curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh -o /tmp/davpanel-bootstrap.sh && bash /tmp/davpanel-bootstrap.sh
```

The installation script supports [optional flags](/install) that can be used to configure davpanel, skip certain installation steps or simply display debugging information.

If you encountered any errors while running the installation script, please copy & paste the installation log file to [the community forums](https://community.davpanel.org).
