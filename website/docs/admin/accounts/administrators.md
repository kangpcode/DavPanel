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
  
  For each admin user, the table shows:

  - **Username** and **Status** (active or suspended).
  - **Role** - Super Admin or Admin.
  - **Security** - a green **2FA** badge when two-factor authentication is enabled and a green **Passkeys** badge when a passkey is registered, the one that isn't set up is grey. Empty when the admin has neither.
  - **Activity** - the last change the admin made, linking to their [Activity Log](/docs/admin/accounts/activity), with the IP address and time of their last login below it.
  - **Edit** - a menu with the available actions for that user.

  Click the arrows next to a column name to sort the table by that column.

  Reseller users are not listed on this page - they are managed separately under **Accounts > Resellers**.

![Administrators page listing DavAdmin users with their status, role, security and activity](/img/davadmin-screenshots/accounts/administrators-list.png#gh-light-mode-only)
![Administrators page listing DavAdmin users with their status, role, security and activity](/img/davadmin-screenshots/accounts/administrators-list_dark.png#gh-dark-mode-only)

  </TabItem>

  <TabItem value="CLI" label="With DavCLI">

To list admin users use command:

```bash
davcli admin list
```

  </TabItem>
</Tabs>

## Bulk Actions

Tick the checkbox of one or more administrators, or the checkbox in the table header to select all administrators shown by the current search. A bar appears at the bottom of the page with the number selected, a **Clear** link and these actions:

![Two administrators selected with the bulk actions bar offering Suspend, Unsuspend and Delete](/img/davadmin-screenshots/accounts/administrators-bulk.png#gh-light-mode-only)
![Two administrators selected with the bulk actions bar offering Suspend, Unsuspend and Delete](/img/davadmin-screenshots/accounts/administrators-bulk_dark.png#gh-dark-mode-only)

| Action | What it does |
|---|---|
| **Suspend** | Suspends the selected administrators, they can't log in until unsuspended. |
| **Unsuspend** | Unsuspends the selected administrators. |
| **Delete** | Permanently deletes the selected administrators. |

Super Admins and your own account have no checkbox, they can't be suspended or deleted from here.

Click an action, confirm it, and it runs on the selected administrators one after another. When it's done the page reloads with a notice listing the administrators it worked for, or which ones failed and why.

## Activity Log

Every change an administrator makes in DavAdmin is recorded in their own activity log. Open it from the **Activity** column or from **Activity Log** in the Edit menu, see [Activity Log](/docs/admin/accounts/activity) for what is recorded.

![Activity Log page of an administrator with the date, IP address and action of each change](/img/davadmin-screenshots/accounts/administrators-activity.png#gh-light-mode-only)
![Activity Log page of an administrator with the date, IP address and action of each change](/img/davadmin-screenshots/accounts/administrators-activity_dark.png#gh-dark-mode-only)

## Reset Admin Password


<Tabs>
  <TabItem value="davadmin-admin-reset" label="With DavAdmin" default>

To reset an admin's password, open the Edit menu for that user on the **Accounts > Administrators** page, select **Change Password**, then set the new password and click **Change Password**.

![Edit menu of an administrator with the Rename, Change Password, Activity Log, Suspend and Delete options](/img/davadmin-screenshots/accounts/administrators-menu.png#gh-light-mode-only)
![Edit menu of an administrator with the Rename, Change Password, Activity Log, Suspend and Delete options](/img/davadmin-screenshots/accounts/administrators-menu_dark.png#gh-dark-mode-only)

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


