# DavPanel ClientExec Plugin 😎
ClientExec server plugin for [DavPanel](https://davpanel.com)

---

## Usage

### Requirements

- Server with DavPanel Enterprise license
- ClientExec

### Installation

1. Login to SSH for the ClientExec server
2. Navigate to `path_to_clientexec/plugins/server`
3. Run this command to create a new folder and in it download the plugin:
   ```bash
   git clone https://github.com/kangpcode/davpanel-clientexec.git davpanel
   ```
4. In ClientExec admin, add a new server and select the **DavPanel** plugin
5. Fill in the DavAdmin admin username/password, hostname, and port (default `2087`)

### Supported Operations

From ClientExec admin area:
- Create a new user account + add domain
- Suspend account
- Unsuspend account
- Change package
- Change password
- Terminate account
- Test connection

### Configuration

The plugin authenticates to the DavAdmin API (`/api/`) with the admin username/password
configured on the server, and uses the resulting JWT bearer token for all subsequent
calls to `/api/users/<username>` and `/api/domains/new`.

### Troubleshooting

On ClientExec:
1. Enable debug logging for the server module and reproduce the action
2. Check the module log in the ClientExec admin area

On DavPanel server:
1. [Enable `DEV_MODE` on DavAdmin](https://dev.davpanel.com/cli/config.html#dev-mode)
2. Send requests from the ClientExec server
3. View the logs in: `/var/log/davpanel/admin/api.log`

### Update

1. Login to SSH for the ClientExec server
2. Navigate to `path_to_clientexec/plugins/server/davpanel`
3. Run this command to download newer files:
   ```bash
   git pull
   ```

## Bug Reports

Report [new issue on github](https://github.com/stefanpejcic/openpanel-clientexec/issues/new/choose)
