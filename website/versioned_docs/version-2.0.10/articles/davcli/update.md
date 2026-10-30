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

## Admin

Update only DavAdmin UI *(`/usr/local/admin/` from [kangpcode/davadmin](https://github.com/stefanpejcic/openadmin))*:
```bash
davcli update --admin
```

## Panel

Update only DavPanel UI *(docker image from [davpanel/davpanel-ui](https://hub.docker.com/r/davpanel/davpanel))*:
```bash
davcli update --panel
```

## Terminal

Update only DavCLI *(`/usr/local/davcli/` from [kangpcode/davcli](https://github.com/stefanpejcic/opencli))*:
```bash
davcli update --cli
```

## Locales

Update only translation files *(locale files from [kangpcode/davpanel-translations](https://github.com/stefanpejcic/openpanel-translations))*:
```bash
davcli update --translations
```
