---
sidebar_label: "Installing DavPanel"
---

# How to Install DavPanel on a Linux Server (One Command)

Before starting, ensure your server meets [the minimum requirements](/docs/admin/intro/#requirements) and runs a supported distribution. To choose the right server size, see [System Requirements & Sizing](/docs/articles/install-update/system-requirements/).

To install DavPanel on your server:

1. Log in to your new server;
- as root via SSH or
- as a user with sudo privileges and type "sudo -i"
2. Copy and paste davpanel installation command into the terminal
```shell
curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh -o /tmp/davpanel-bootstrap.sh && bash /tmp/davpanel-bootstrap.sh
```

The installation script supports [optional flags](/install) that can be used to configure davpanel, skip certain installation steps or simply display debugging information.

If you encountered any errors while running the installation script, please copy & paste the installation log file to [GitHub Discussions](https://github.com/stefanpejcic/OpenPanel/discussions).

![DavPanel installer output in a terminal: the DavPanel banner with version, OS, IP and Podman engine, each installation step marked OK, and the DavAdmin URL with the generated username and password at the end](/img/davpanel-screenshots/install/installer-output-generic.png#screenshot)

