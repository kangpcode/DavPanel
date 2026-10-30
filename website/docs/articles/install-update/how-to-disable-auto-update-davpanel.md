---
sidebar_label: "Disable Updates"
---

# How to Disable Automatic Updates

<Tabs>
  <TabItem value="davadmin-admin-updates" label="With DavAdmin" default>

To disable automatic updates, navigate to **DavAdmin > Settings > Updates** and change 'Update automatically' option to 'Never':

![davadmin update preferences](/img/admin/davadmin_set_update_preferences.png)

  </TabItem>
  <TabItem value="CLI" label="With DavCLI">

To disable automatic updates from the terminal use commands:

```bash
davcli config update autoupdate no
```

```bash
davcli config update autopatch no
```
  </TabItem>
</Tabs>
