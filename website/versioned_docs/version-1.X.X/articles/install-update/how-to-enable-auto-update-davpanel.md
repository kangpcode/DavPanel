# Enable Updates

- `autopatch` option allows Administrator to automatically update DavPanel to minor versions. MINOR versions include only security updates and bug fixes.
- `autoupdate` option allows Administrator to enable or disable automatic updates to major versions. MAJOR versions add new functionality in a backward compatible manner.

<Tabs>
  <TabItem value="davadmin-admin-updates" label="With DavAdmin" default>

To enable automatic updates, navigate to **DavAdmin > Settings > Update Preferences** and change 'Update automatically' option to 'Both':

![davadmin update preferences](/img/admin/davadmin_set_update_preferences.png)

  </TabItem>
  <TabItem value="CLI" label="With DavCLI">

To enable automatic updates from the terminal use commands:

```bash
davcli config update autoupdate yes
```

```bash
davcli config update autopatch yes
```
  </TabItem>
</Tabs>
