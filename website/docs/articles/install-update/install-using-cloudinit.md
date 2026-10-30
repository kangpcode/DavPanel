---
sidebar_label: "Installing DavPanel via Cloud-Init"
---

# How to Install DavPanel with Cloud-Init (User Data)

Use the following **cloud-init YAML** configuration to automatically install DavPanel on your server during first boot:

```yaml
#cloud-config
packages:
  - curl
  - lsb-release
  - gnupg

runcmd:
  - curl -fsSL https://davpanel.org/ | bash
```
