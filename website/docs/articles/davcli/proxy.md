# Proxy 

`davcli proxy` command is used to change `/davpanel` suffix to something else. 

View current setting:
```bash
davcli proxy
```

<details>
  <summary>Example output</summary>

```bash
# davcli proxy
davpanel
```
</details>

Set `/something` on every domain to redirect to DavPanel interface:
```bash
davcli proxy set /something
```

<details>
  <summary>Example output</summary>

```bash
# davcli proxy set /something
/something is now set for accessing the DavPanel interface.
```
</details>

Switch back to the default `/davpanel`:
```bash
davcli proxy default
```

<details>
  <summary>Example output</summary>

```bash
# davcli proxy default
/davpanel is now set for accessing the DavPanel interface.
```
</details>

The DavPanel service is restarted in the background to apply the change. Add `--no-restart` to skip the restart.
