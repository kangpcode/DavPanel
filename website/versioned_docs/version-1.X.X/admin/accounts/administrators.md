---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Administrators

The admin panel has three user roles:


| Role              | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| **Super Admin**    | Has unrestricted privileges, created on DavPanel installation. |
| **Admin**          | Has restricted privileges, can not access all DavAdmin UI pages and can not edit the SuperAdmin user. |
| **Reseller**       | Has restricted privileges. |


## Manage Admin users


<Tabs>
  <TabItem value="davadmin-admin-users" label="With DavAdmin" default>
  
  Manage administrative users with access to the DavAdmin interface via the **Administrators** page.
  
  For each admin user, you can view and manage the following details: Username, Status Role, Last Login IP, Last Login Time, Actions.

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

To reset admin password click on the Edit for that user from *Settings > Accounts > Administrators* page, then set the new password.

  </TabItem>
  <TabItem value="cli-reset" label="With DavCLI">

To reset the password for an admin user:

```bash
davcli admin password <username> <new_password>
```

Example, reset password for and Admin user:
```bash
davcli admin password admin Pyl7_L2M1
```

  </TabItem>
</Tabs>


## Create new Admin

<Tabs>
  <TabItem value="davadmin-admin-new" label="With DavAdmin" default>

To create new admin user click on the 'Create New' button in *Settings > Accounts > Administrators* page, set the username and password and click on *Save*.


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

To rename an Admin user, select it on **Settings > Accounts > Administrators** page and click on the Edit button and set new username.

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

To unsuspend an Admin user, select the user on **Settings > Accounts > Administrators** page and click on the Edit button, then **Unsuspend**.

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

Select the user on **Settings > Accounts > Administrators** page and click on the delete button then confirm.

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


