# Proxy 

`davcli proxy` command is used to change `/davpanel` suffix to something else. 

View current setting:
```bash
davcli proxy
```

Set `/something` on every domain to redirect to DavPanel interface:
```bash
davcli domain set something
```

Switch back to the default `/davpanel`:
```bash
davcli domain set default
```


You can also pass `--no-restart` flag to avoid interrupting the Caddy or DavPanel services.
