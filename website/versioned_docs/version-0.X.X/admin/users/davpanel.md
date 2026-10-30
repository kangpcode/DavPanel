---
sidebar_position: 1
---

# DavPanel Users

DavPanel has a single user role named **User** that can only manage their docker container and inherits settings specified by the Admin user.


## List Users


<Tabs>
  <TabItem value="davadmin-users" label="DavAdmin" default>

To access all DavPanel users, navigate to DavAdmin > Users.

The Users page displays a table showcasing each user's Gravatar linked to their email address, username, assigned IP Address, hosting plan name, creation date of the account, a login link enabling user impersonation, and *manage* button to get detailed user overview.

![davadmin users page](/img/admin/davadmin_users_page.png)

Suspended users are highlighted in red, and no actions can be performed on a suspended user.

  </TabItem>
  <TabItem value="CLI-users" label="DavCLI">

To list all users, use the following command:

```bash
davcli user-list
```

Example output:
```bash
davcli user-list
+----+----------+-----------------+-----------------+---------------------+
| id | username | email           | plan_name       | registered_date     |
+----+----------+-----------------+-----------------+---------------------+
| 52 | stefan   | stefan          | cloud_4_nginx_3 | 2023-11-16 19:11:20 |
| 53 | petar    | petarc@petar.rs | cloud_8_nginx   | 2023-11-17 12:25:44 |
| 54 | rasa     | rasa@rasa.rs    | cloud_12_nginx  | 2023-11-17 15:09:28 |
+----+----------+-----------------+-----------------+---------------------+
```

You can also format the data as JSON:

```bash
davcli user-list --json
```
  </TabItem>
  <TabItem value="API-users" label="API">

To list all users, use the following api endpoint:

```bash
curl -X GET http://PANEL:2087/api/users -H "Authorization: Bearer JWT_TOKEN_HERE"
```

  </TabItem>
</Tabs>


## Create Users


<Tabs>
  <TabItem value="davadmin-users-new" label="DavAdmin" default>

To create a new user, click on the 'New User' button on the Users page. A new section will be displayed with a form where you can set the email address, username, generate a strong password, and assign a hosting plan for the user.

![davadmin users add new](/img/admin/davadmin_add_new_user.gif)

  </TabItem>
  <TabItem value="CLI-users-new" label="DavCLI">

To create a new user run the following command:

```bash
davcli user-add <USERNAME> <PASSWORD> <EMAIL> <PLAN_NAME>
```
Example: 
```bash
davcli user-add filip masdhjkb213g filip@davadmin.co default_plan_apache
```

:::tip
Provide `generate` as password to generate a strong random password.
:::
  </TabItem>
  <TabItem value="API-users-new" label="API">

To create a new user use the following api call:

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer JWT_TOKEN_HERE" -d '{"email": "EMAIL_HERE", "username": "USERNAME_HERE", "password": "PASSWORD_HERE", "plan_name": "PLAN_NAME_HERE"}' http://PANEL:2087/api/users
```

Example:
```bash
curl -X POST "http://PANEL:2087/api/users" -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGcBns" -H "Content-Type: application/json" -d '{"username":"stefan","password":"s32dsasaq","email":"kangpcode@users.noreply.github.com","plan_name":"default_plan_nginx"}'
```

Example response:

```json
{
  "response": {
    "message": "Successfully added user stefan password: s32dsasaq"
  },
  "success": true
}
```
  
  </TabItem>
</Tabs>

- The DavPanel username must be 3 to 16 characters long and can only contain letters and numbers.
- The DavPanel password must be 6 to 30 characters long and can include any characters except for single quotes (`'`) and double quotes (`"`).


## Reset User Password

<Tabs>
  <TabItem value="davadmin-users-reset" label="DavAdmin" default>

To reset password for a user click on the Edit dropdown in table for that user in DavAdmin > Users or from the individual User page click on "Edit information" and set the new password in the Password field then save.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users reset password step 1](/img/admin/davadmin_users_edit_information.png)  |  ![davadmin users reset password step 2](/img/admin/davadmin_users_edit_information_change_password.png)


  </TabItem>
  <TabItem value="CLI-users-reset" label="DavCLI">

To reset the password for a DavPanel user, you can use the `user-password` command:

```bash
davcli user-password <USERNAME> <NEW_PASSWORD>
```

Use the `--ssh` flag to also change the password for the SSH user in the container.

Example:

```bash
davcli user-password filip Ty7_K8_M2 --ssh
```

  </TabItem>
  <TabItem value="API-users-reset" label="API">

To reset password for an DavPanel user, use the following api call:

```bash
curl -X PATCH http://PANEL:2087/api/users/USERNAME_HERE -H "Content-Type: application/json" -H "Authorization: Bearer JWT_TOKEN_HERE" -d '{"password": "NEW_PASSWORD_HERE"}'
```
  </TabItem>
</Tabs>


## Detailed User Information

To view detailed information about a user, click on their Gravatar, username or the *Manage* button in the users table.

![davadmin manage user button](/img/admin/davadmin_manage_button.png)

This page shows detailed information about the account and provides tools to manage it.

![davadmin users single user view](/img/admin/davadmin_users_single_user_view.png)

The username is displayed at the top, along with the status of the Docker container for the user. Colors indicate whether the user is suspended or if the Docker container has encountered an error. Next to the username, there are buttons that allow you to suspend/unsuspend the user, delete the user, a configure button to edit user settings inside their Docker container, and a 'Login as user' button that automatically logs you into their DavPanel interface.

![davadmin users single user buttons](/img/admin/manage_single_user_btns.png)

There are 4 widgets on top of the page:

![davadmin users single user view 2](/img/admin/user_2.png)

- **CPU Usage:** Shows the current CPU usage of all processes by the user, represented in percentage with color indicators.
- **Memory Usage:** Displays the current memory usage of the Docker container, represented in percentage with color indicators.
- **Disk Usage:** Shows the current disk usage of the user's Docker container, represented in percentage with color indicators.
- **IP Address:** Displays the public IPv4 address for the user, indicating whether the user has a Dedicated IP address assigned.

----

The next section is divided into two parts: tabs and widgets.

There are 6 tabs that allow you to view relevant information about the user's Docker container:

### Docker

![davadmin users single user view docker_tab](/img/admin/docker_tab.png)

The Docker tab displays information about the Docker container for the user, including:

- **Server:** Server on which the container is running.
- **Private IP:** Private IP address within the plan network that the container is using.
- **ID:** Unique container ID for that user container.
- **Memory Allocated:** RAM allocated to the user container (can be manually extended even beyond the plan limit).
- **CPU:** Number of CPU cores allocated to the container (can also be increased outside the plan limits).
- **Docker Image:** The name of the image (Nginx or Apache) that the container is using and the OS in the image (Debian or Ubuntu).
- **Hostname:** Hostname that the user sees via SSH in their Docker container (same as your server name).
- **Exposed Ports:** Ports inside the Docker container that accept incoming connections (e.g., ports for SSH, MySQL, REDIS, Apache).
- **Container Created:** Timestamp when the container was started (may be different from the account creation date).




### Disk Usage

<Tabs>
  <TabItem value="davadmin-user-du" label="With DavAdmin" default>

*Disk Usage* section displays real-time disk usage for a user: 

- `/home/username` is used for all website files that user uploads to their home directory.
- `/var/lib/docker/devicemapper/mnt/..` is the total file system that the user's Docker container is limited to; this includes the OS itself, system services, databases, logs, etc.

![davadmin users single user view du](/img/admin/du_tab.png)

  </TabItem>
  <TabItem value="CLI-user-du" label="With DavCLI">

To view disk usage summary for a user, run the following command:

```bash
davcli user-disk <USERNAME> summary
```
Example:

```bash
# davcli user-disk stefan summary

-------------- disk usage --------------
- 564M  /home/stefan
- 864M  /var/lib/docker/devicemapper/mnt/ac28d2b066f5ffcacf4510b042623f6a3c196bd4f5fb9e842063c5325e4d0184
```


To view detailed report of current disk usage for a user, run the following command:

```bash
davcli user-disk <USERNAME> detail
```
Example:

```bash
# davcli user-disk stefan detail
------------- home directory -------------
- home directory:        /home/stefan
- mountpoint:            /home/stefan
- bytes used:            61440
- bytes total:           10375548928
- bytes limit:           true
- inodes used:           20
- inodes total:          1000960
---------------- container ---------------
- container directory:   /var/lib/docker/devicemapper/mnt/ac28d2b066f5ffcacf4510b042623f6a3c196bd4f5fb9e842063c5325e4d0184
- bytes used:            1025388544
- bytes total:           10726932480
- inodes used:           20905
- inodes total:          5242880
- storage driver:        devicemapper
```


To view home directory and docker container paths for a user, run the following command:


```bash
davcli user-disk <USERNAME> path
```
Example:

```bash
# davcli user-disk stefan path

-------------- paths --------------
- home_directory=/home/stefan
- docker_container_path=/var/lib/docker/devicemapper/mnt/ac28d2b066f5ffcacf4510b042623f6a3c196bd4f5fb9e842063c5325e4d0184
```



  </TabItem>
</Tabs>



----

### Websites

The Websites tab will display all domains and websites that the user has inside their Docker container.

- **Domains table** showcases information such as domain name, root directory, and links to view the access log for the domain, edit DNS records, and edit the VirtualHost file for Nginx associated with the domain.
- **Websites table** displays the website URL, type (WordPress, Node.js, or Python), CMS version, and the time when the user installed or added it to the Site Manager interface.

![davadmin users single user view websites tab](/img/admin/websites_tab.png)

To view access log for a domain click on the 'View Access Log' link:

![davadmin users single user view domain access log](/img/admin/admin_single_user_access.png)

To view and edit DNS zone for a domain, click on the 'DNS Zone' link:

![davadmin users single user view domain dns zone](/img/admin/admin_single_user_dns.png)


To view and edit Nginx configuration for a domain, click on the 'VirtualHosts' link:

![davadmin users single user view domain vhosts file](/img/admin/admin_single_user_vhosts.png)

----

### Services

The Services tab displays a list of all services installed inside the user's Docker container, along with their current status. You have options to start, stop, or restart a service.

![davadmin users single user view services tab](/img/admin/services_tab.png)


Services can be [pre-installed in a Docker image](https://dev.davpanel.co/images/), which is recommended for production to reduce the disk usage required for idle user accounts. Alternatively, they can be [installed later by an administrator](#) or by a user with [granted sudo access](#sudo-access).


----

### Backups

The Backups tab displays a list of all available backups for the user account, showcasing backup content and sizes.

![davadmin users single user view backups tab](/img/admin/backups_tab.png)

----

### Usage

The Usage tab will display Docker container stats for the user, including CPU usage, memory percentage used at that moment, network I/O, and total block I/O. This information is the same to what users can view from [DavPanel > Resource Usage](/docs/panel/analytics/resource_usage/).

![davadmin users single user view usage tab](/img/admin/usage_tab.png)

----

### Activity

The Activity tab shows the user's account activity log, providing the same information users can view from DavPanel > Account Activity page.

![davadmin users single user view activity tab](/img/admin/activity_tab.png)

----

### General information

General information widget displays the general information about the user and their container:

![davadmin users single user view general info](/img/admin/general_info_tab.png)

- **User ID:** Unique ID for the user account.
- **Email Address:** Current email address for the user.
- **Two Factor:** Indicates whether 2FA is enabled by the user.
- **Hosting Plan:** Name of the hosting plan assigned to the user.
- **IP Address:** Public IPv4 address for the user.
- **Server Location:** Flag and country name indicating the geolocation of the IP address.
- **Private IP:** Private IP address for the Docker container used in internal networking.
- **Setup Date:** Date when the user account was created.
- **Domains:** Number of domains that the user has added.
- **Websites:** Number of websites that the user has added.

To edit any information for the user, click on the 'Edit Information' link, and a new modal will be displayed where you can change the username, email, plan, IP, or password.

![davadmin users single user edit_info_tab](/img/admin/edit_info_tab.png)

----

### Ports

The Ports widget displays all ports published in the user's Docker container and corresponding randomly generated ports for the user on the host server machine.

![davadmin users single user ports_tab](/img/admin/ports_tab.png)


## Suspend User

<Tabs>
  <TabItem value="davadmin-user-suspend" label="With DavAdmin" default>

Suspending an account will immediately disable the user's access to the DavPanel. This action involves pausing the user's Docker container and revoking access to their email, website, and other associated services. Please be aware of the immediate impact before proceeding.

To suspend a user click on the Suspend button on that user page and click on 'Suspend' on the confirmation modal.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users suspend step 1](/img/admin/davadmin_users_suspend_1.png)  |  ![davadmin users suspend step 2](/img/admin/davadmin_users_suspend_2.png)

  </TabItem>
  <TabItem value="CLI-user-suspend" label="With DavCLI">

To suspend (temporary disable access) to user, run the following command:

```bash
davcli user-suspend <USERNAME>
```
Example:

```bash
davcli user-suspend filip
```


  </TabItem>
</Tabs>

## Unsuspend User

<Tabs>
  <TabItem value="davadmin-user-unsuspend" label="With DavAdmin" default>

To unsuspend a user click on the Unsuspend button for that user.

![davadmin users add new](/img/admin/davadmin_users_unsuspend.png)

  </TabItem>
  <TabItem value="CLI-user-unsuspend" label="With DavCLI">
    
To unsuspend (enable access) to user, run the following command:

```bash
davcli user-unsuspend <USERNAME>
```

Example:
```bash
davcli user-unsuspend filip
```

  </TabItem>
</Tabs>



## Rename Username

<Tabs>
  <TabItem value="davadmin-user-username" label="With DavAdmin" default>

To Rename a user, click on the 'Edit Information' link for the user, then change the address in 'Username' field and click on 'Save changes'.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users change username step 1](/img/admin/davadmin_users_edit_information.png)  |  ![davadmin users change username step 2](/img/admin/davadmin_user_change_username.png)

  </TabItem>
  <TabItem value="CLI-user-email" label="With DavCLI">

To change username for a user run the following command:

```bash
davcli user-rename <old_username> <new_username>
```

Example:

```bash
#davcli user-rename stefan pejcic
User 'stefan' successfully renamed to 'pejcic'.
```
  </TabItem>
</Tabs>



## Change Email address

<Tabs>
  <TabItem value="davadmin-user-email" label="With DavAdmin" default>

To change email address for a user, click on the 'Edit Information' link for the user, then change the address in 'Email address' field and click on 'Save changes'.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users change email step 1](/img/admin/davadmin_users_edit_information.png)  |  ![davadmin users change email step 2](/img/admin/davadmin_user_change_email.png)

  </TabItem>
  <TabItem value="CLI-user-email" label="With DavCLI">

To change email address for a user run the following command:

```bash
davcli user-email <USERNAME> <NEW_EMAIL>
```

Example:

```bash
#davcli user-email stefan kangpcode@users.noreply.github.com
Email for user stefan updated to kangpcode@users.noreply.github.com.
```
  </TabItem>
</Tabs>





## Change IP address for User

<Tabs>
  <TabItem value="davadmin-user-ip" label="With DavAdmin" default>

To change IP address for a user, click on the 'Edit Information' link for the user, then select the new IP address and click on 'Save changes'.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users change ip address step 1](/img/admin/davadmin_users_edit_information.png)  |  ![davadmin users change ip address step 2](/img/admin/davadmin_users_edit_information_change_ip_address.png)

  </TabItem>
  <TabItem value="CLI-user-ip" label="With DavCLI">

To assign unused IP address to a user run the following command:

```bash
davcli user-ip <USERNAME> <IP_ADDRESS>
```

To assign IP address **that is currently used by another user** to this user, use the `--y` flag.

Example:

```bash
davcli user-ip filip 11.128.23.89 --y
```

To remove dedicated IP address from a user run:

```bash
davcli user-ip <USERNAME> delete
```
Example:

```bash
davcli user-ip filip delete
```

  </TabItem>
</Tabs>





## Grant Sudo Access

<Tabs>
  <TabItem value="davadmin-user-ip" label="With DavAdmin" default>

To allow users to install new services and have unrestricted access inside their container, click on the 'Configuration' button for the user, then check the 'Sudo Access' option.

This will allow user to use the `su -` command and switch to root user inside their container.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users grant sudo step 1](/img/admin/davadmin_users_sudo1.png)  |  ![davadmin users grant sudo step 2](/img/admin/davadmin_users_sudo2.png)

  </TabItem>
  <TabItem value="CLI-user-ip" label="With DavCLI">

To allow users to install new services and have unrestricted access inside their container, run the following command:

```bash
davcli user-sudo <USERNAME> <ENABLE/DISABLE/STATUS>
```

Example:

```bash
# davcli user-sudo stefan enable
'su -' access enabled for user stefan.
```

To remove sudo access from user:

```bash
davcli user-ip <USERNAME> disable
```
Example:

```bash
# davcli user-sudo stefan disable
'su -' access disabled for user stefan.
```

To check current sudo status for user:

```bash
davcli user-ip <USERNAME> status
```
Example:

```bash
# davcli user-sudo stefan status
'su -' is enabled for user stefan.
```


  </TabItem>
</Tabs>




## Delete User


<Tabs>
  <TabItem value="davadmin-user-delete" label="With DavAdmin" default>

To delete a user click on the delete button for that user, then type 'delete' in the confirmation modal and finally click on the 'Terminate' button.

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin users delete step 1](/img/admin/davadmin_users_delete_1.png)  |  ![davadmin users deletes step 2](/img/admin/davadmin_users_delete_2.png)

  </TabItem>
  <TabItem value="CLI-user-delete" label="With DavCLI">
    
To delete a user and all his data run the following command:

```bash
davcli user-delete <USERNAME>
```

add `-y` flag to disable prompt.

Example:
```bash
davcli user-delete filip -y
```

  </TabItem>
</Tabs>


:::danger
This action is irreversible and will permanently delete all user data.
:::
