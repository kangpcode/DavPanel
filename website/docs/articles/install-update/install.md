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
bash <(curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh)
```

The installation script supports [optional flags](/install) that can be used to configure davpanel, skip certain installation steps or simply display debugging information.

The installer downloads and verifies the matching amd64/arm64 release and installs
the required dependencies. If no complete release is published yet, it downloads
the complete source, verifies its components, prepares Go automatically and builds
the installer. Allow at least 4 GB RAM and 20 GB free disk space for source builds.
You can force a source build with `--from-source`. Add `--domain=panel.example.com`
for public TLS; the default is a self-signed certificate for IP access.

If the bootstrap URL itself returns 404, check that the repository is public and
`bootstrap.sh` exists on its `main` branch. This is different from a missing release,
which the installer handles automatically. The installation log is
`/var/log/davpanel/install.log` and the final output includes the panel URLs and
generated administrator credentials.

If you encountered any errors while running the installation script, share the relevant log excerpt after removing credentials in [GitHub Discussions](https://github.com/kangpcode/DavPanel/discussions).

![DavPanel installer output in a terminal: the DavPanel banner with version, OS, IP and Podman engine, each installation step marked OK, and the DavAdmin URL with the generated username and password at the end](/img/davpanel-screenshots/install/installer-output-generic.png#screenshot)

