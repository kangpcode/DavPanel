# Update 

`davcli update` command is used to check if new update is available and to update.

Check if update is available:
```bash
davcli update --check
```

Start update immediately if `autoupdate` or `autopatch` is enabled:
```bash
davcli update
```

Start update immediately, regardless of `autoupdate` or `autopatch` setting:
```bash
davcli update --force
```

Update only DavAdmin UI *(`/usr/local/admin/` from [kangpcode/davadmin](https://github.com/stefanpejcic/openadmin))*:
```bash
davcli update --admin
```

Update only DavPanel UI *(docker image from [davpanel/davpanel-ui](https://hub.docker.com/r/davpanel/davpanel-ui))*:
```bash
davcli update --panel
```

Update only DavCLI *(`/usr/local/davcli/` from [kangpcode/davcli](https://github.com/stefanpejcic/opencli))*:
```bash
davcli update --cli
```
