---
sidebar_label: "Upgrade to Enterprise"
---

# How to Upgrade to Enterprise and Activate a License Key

DavPanel is available in two editions:

- **Community** - a free hosting control panel for Debian and Ubuntu OS, suitable for VPS and private use.
- **Enterprise** - offers advanced features for user isolation and management, suitable for web hosting providers.

More information: [DavPanel Community VS Enterprise edition](/enterprise)

## Purchase License

To purchase a license for the DavPanel Enterprise edition [click here](https://my.davpanel.com/cart.php?a=add&pid=1).

After payment, license key is automatically issued and you will see it under the Services page:

![license key](/img/guides/add_license.png)

## Add License Key

### To existing installation:

- From DavAdmin:
  If you already have DavPanel Community edition installed, navigate to **DavAdmin > Try Enterprise** and add the key into the form:
  
  ![add license key](/img/guides/add_key.png)

- From terminal:
  ```bash
  davcli license enterprise-XXX
  ```
  Replace `enterprise-XXX` with your license key.
  
  ![davcli license](/img/guides/key_command.png)

### To new installation:

If you will be installing DavPanel Enterprise on another server, copy the install command from your service page and paste it into new server:

![install command](/img/guides/key_code.png)
