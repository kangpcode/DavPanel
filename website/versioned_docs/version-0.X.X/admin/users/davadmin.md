---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# DavAdmin Users

The admin panel has two user roles:


| Role              | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| **Super Admin**    | Has unrestricted privileges, created on DavPanel installation.                                                 |
| **Admin**              | Can not edit the SuperAdmin user, created from DavAdmin or DavCLI.                                                   |


## Manage Admin users


<Tabs>
  <TabItem value="davadmin-admin-users" label="With DavAdmin" default>

Use *Settings > DavAdmin* page to manage admin users that can access DavAdmin interface:

![davadmin admin users](/img/admin/davadmin_admin_page.png)

  </TabItem>
  <TabItem value="CLI" label="With DavCLI">

To list admin users use command:

```bash
davcli admin list
```

  </TabItem>
</Tabs>

## Reset Admin Password


<Tabs>
  <TabItem value="davadmin-admin-reset" label="With DavAdmin" default>

To reset admin password click on the Edit button for that user from *Settings > DavAdmin* page, then set the new password.

![davadmin admin password](/img/admin/davadmin_admin_password.png)

  </TabItem>
  <TabItem value="cli-reset" label="With DavCLI">

To reset the password for an admin user:

```bash
davcli admin password <username> <new_password>
```

Example, reset password for Super Admin user:
```bash
davcli admin password admin Pyl7_L2M1
```

Example, reset password for regular Admin user:
```bash
davcli admin password filip Pyl7_L2M1
```

  </TabItem>
</Tabs>


## Create new Admin

<Tabs>
  <TabItem value="davadmin-admin-new" label="With DavAdmin" default>

To create new admin user click on the 'New' button in *Settings > DavAdmin* page, set the username and password and click on *Save*.

![davadmin admin new](/img/admin/davadmin_admin_new.png)


  </TabItem>
  <TabItem value="cli-new" label="With DavCLI">

To create new admin accounts:

```bash
davcli admin new <username> <password>
```

Example:
```bash
davcli admin new filip Pyl7_L2M1
```

  </TabItem>
</Tabs>





## Rename Admin user

<Tabs>
  <TabItem value="davadmin-admin-rename" label="With DavAdmin" default>

To rename an Admin user, select the user on **Settings > DavAdmin** page and click on the Edit button and set new username.

![davadmin admin rename](/img/admin/davadmin_admin_rename.png)


  </TabItem>
  <TabItem value="cli-rename" label="With DavCLI">

To rename admin user:

```bash
davcli admin rename <username> <new_username>
```

Example:
```bash
davcli admin rename filip filip2
```
  </TabItem>
</Tabs>


## Suspend Admin user

<Tabs>
  <TabItem value="davadmin-admin-suspend" label="With DavAdmin" default>

To suspend an Admin user, select the user on **Settings > DavAdmin** page and click on the Edit button, then uncheck the **Active** status.

![davadmin admin suspend](/img/admin/davadmin_admin_suspend.png)


To unsuspend an Admin user, select the user on **Settings > DavAdmin** page and click on the Edit button, then **Unsuspend**.
  </TabItem>
  <TabItem value="cli-suspend" label="With DavCLI">

```bash
davcli admin suspend <username>
```

Example:
```bash
davcli admin suspend filip
```
---

To unsuspend admin user:
```bash
davcli admin unsuspend <username>
```

Example:
```bash
davcli admin unsuspend filip
```

  </TabItem>
</Tabs>


## Delete Admin user

<Tabs>
  <TabItem value="davadmin-admin-delete" label="With DavAdmin" default>

Select the user on *Settings > DavAdmin* page and click on the delete button then confirm.

![davadmin admin delete](/img/admin/davadmin_admin_delete.png)


  </TabItem>
  <TabItem value="cli-delete" label="With DavCLI">

From the terminal:

To delete admin user:
```bash
davcli admin delete <username>
```

Example:
```bash
davcli admin delete filip
```

  </TabItem>
</Tabs>


:::info
The Super Admin user can not be deleted.
:::


