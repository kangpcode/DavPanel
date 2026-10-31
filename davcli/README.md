# DavCLI  

DavCLI is the command-line interface for managing [DavPanel](https://davpanel.com/).  

On installation, the `davcli.sh` script is added to the system path, and `davcli --help` generates the list of all commands (`aliases.txt`).  

All scripts from `/usr/local/davcli/` can be accessed using the `davcli` command by replacing `/` with `-`.  

For example: to run user/add.sh script you would type: `davcli user-add`.

## Tab completion

`lib/completion.bash` provides bash tab-completion for `davcli` commands and their arguments (usernames, domains, plan names, PHP versions, and more, pulled live from the panel database and filesystem). It's symlinked into `/etc/bash_completion.d/davcli` automatically whenever `davcli update` runs, which also installs the `bash-completion` package if it isn't already present.

## Updates

DavPanel is proud of the modularity, so you can independently update just the DavCLI when needed.

To update DavCLI:

```sh
davcli update --cli
```
