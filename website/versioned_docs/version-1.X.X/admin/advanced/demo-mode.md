---
sidebar_position: 10
---

# Demo Mode

Enable Demo Mode to lock both the DavPanel and DavAdmin interfaces in read-only mode.

This mode is ideal for hosting providers who want to showcase DavPanel in a secure, public demo environment. Users will be able to explore the UI, but no changes can be made—all actions are disabled across both the admin and user panels.

Once enabled, Demo Mode cannot be turned off via the admin panel.
To disable it, run the following command in your terminal:
```
davcli config update demo_mode off
```

Make sure to configure your demo content and secure the server before enabling this mode. 📘 [Learn more](https://dev.davpanel.com/cli/config.html#Demo-mode)

