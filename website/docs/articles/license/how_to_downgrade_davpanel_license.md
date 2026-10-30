---
sidebar_label: "Downgrade License"
---

# How to Downgrade from Enterprise to Community Edition

DavPanel is available in two editions:

- **Community** - a free hosting control panel for Debian and Ubuntu OS, suitable for VPS and private use.
- **Enterprise** - offers advanced features for user isolation and management, suitable for web hosting providers.

More information: [DavPanel Community VS Enterprise edition](/enterprise)

## Downgrade

:::info
Downgrading from the Enterprise to the Community edition will immediately remove all Enterprise features and modules from the DavPanel UI. Existing enterprise services - such as FTP and email - will continue running, but you will no longer have the ability to manage them from the DavPanel interface.
:::

To downgrade from Enterprise edition to Community:

- From DavAdmin:
  Navigate to **DavAdmin > License & Support** and click on the 'Downgrade' button:
  
  ![remove license key](/img/guides/downgrade_license.png)

- From terminal:
  ```bash
  davcli license delete
  ```
