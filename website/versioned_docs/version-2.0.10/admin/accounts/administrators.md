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
| **Reseller**       | Has restricted privileges, manages only the users assigned to them. Reseller users are managed from the separate [Resellers](/docs/admin/accounts/resellers) page and are not listed on the Administrators page. |


## Manage Admin users


<Tabs>
  <TabItem value="davadmin-admin-users" label="With DavAdmin" default>
  
  Manage administrative users with access to the DavAdmin interface via **Accounts > Administrators**.
  
  For each admin user, the table shows: Username, Status, Role, 2FA (whether two-factor authentication is enabled), Passkeys (whether a passkey is registered), Last Login IP, Last Login Time, and an Edit menu with the available actions for that user.

  Reseller users are not listed on this page - they are managed separately under **Accounts > Resellers**.

![Administrators page listing DavAdmin users with their status, role, 2FA, passkeys and last login](/img/davadmin-screenshots/accounts/administrators-list.png#gh-light-mode-only)
![Administrators page listing DavAdmin users with their status, role, 2FA, passkeys and last login](/img/davadmin-screenshots/accounts/administrators-list_dark.png#gh-dark-mode-only)

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

To reset an admin's password, open the Edit menu for that user on the **Accounts > Administrators** page, select **Change Password**, then set the new password and click **Change Password**.

![Edit menu of an administrator with the Rename and Change Password options](/img/davadmin-screenshots/accounts/administrators-menu.png#gh-light-mode-only)
![Edit menu of an administrator with the Rename and Change Password options](/img/davadmin-screenshots/accounts/administrators-menu_dark.png#gh-dark-mode-only)

![Change Password form for an administrator](/img/davadmin-screenshots/accounts/administrators-password.png#gh-light-mode-only)
![Change Password form for an administrator](/img/davadmin-screenshots/accounts/administrators-password_dark.png#gh-dark-mode-only)

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

To create a new admin user, click on the **Create New** button on the **Accounts > Administrators** page, set the username and password and click on **Create**.

![Create New administrator form with the username and password fields](/img/davadmin-screenshots/accounts/administrators-new.png#gh-light-mode-only)
![Create New administrator form with the username and password fields](/img/davadmin-screenshots/accounts/administrators-new_dark.png#gh-dark-mode-only)

:::info
Creating additional Administrator accounts requires an Enterprise license - Community edition supports only a single Administrator (the Super Admin) and does not display the **Create New** button. New admin users created this way are always assigned the **Admin** role; the **Super Admin** role can only be assigned during DavPanel installation.
:::

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

To rename an Admin user, open the Edit menu for that user on the **Accounts > Administrators** page, select **Rename**, set the new username and click **Change Username**.

![Rename administrator form with the new username field and the Change Username button](/img/davadmin-screenshots/accounts/administrators-rename.png#gh-light-mode-only)
![Rename administrator form with the new username field and the Change Username button](/img/davadmin-screenshots/accounts/administrators-rename_dark.png#gh-dark-mode-only)


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

To suspend an Admin user, open the Edit menu for that user on the **Accounts > Administrators** page and click **Suspend**. To unsuspend the user, open the Edit menu again and click **Unsuspend**.

:::info
Only users with the **Admin** role can be suspended from this page. The **Super Admin** user cannot be suspended, and an admin cannot suspend their own account.
:::

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

Open the Edit menu for the user on the **Accounts > Administrators** page and click **Delete**, then confirm.

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


## Disable Two-Factor Authentication or Passkeys

<Tabs>
  <TabItem value="davadmin-admin-2fa" label="With DavAdmin" default>

If an admin user has Two-Factor Authentication or a Passkey enabled (shown in the **2FA** and **Passkeys** columns on the **Accounts > Administrators** page), the Super Admin can open that user's Edit menu and select **Disable 2FA** or **Disable Passkeys** to remove it, for example if the user is locked out of their authenticator or security key. Only the Super Admin can perform this action, and it cannot be used on the Super Admin's own account.

  </TabItem>
</Tabs>


