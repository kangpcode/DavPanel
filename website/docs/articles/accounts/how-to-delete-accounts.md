---
sidebar_label: "Delete Multiple Accounts"
---

# How to Delete Multiple Hosting Accounts at Once

The `davcli user-delete` command lets you delete DavPanel user accounts in bulk. **Use caution**-it's easy to accidentally delete the wrong users.

### Delete a Single User

```bash
davcli user-delete USERNAME
```

You’ll be prompted for confirmation. To skip confirmation, use the `-y` flag:

```bash
davcli user-delete USERNAME -y
```

### Delete All Users

To delete **all** users on the server:

```bash
davcli user-delete -all
```

By default, you'll be prompted to confirm each deletion. To skip all confirmations, use the `-y` flag:

```bash
davcli user-delete -all -y
```
