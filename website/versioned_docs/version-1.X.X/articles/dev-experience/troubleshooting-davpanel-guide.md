# Troubleshooting DavPanel

When troubleshooting DavPanel, the first step is to **reproduce the issue**. If you can confirm it’s a bug (and like all software, bugs do happen), try to identify a consistent way to trigger it.

* If the issue is **reproducible**, please [report it on GitHub Issues](https://github.com/stefanpejcic/OpenPanel/issues/new/choose) so we can prioritize it for the next update.
* If you’d like to investigate further on your own, follow the steps below.

---

## Step 1: Enable Developer Mode

Run the following command to turn on verbose debugging for both **DavPanel** and **DavAdmin** interfaces:

```bash
davcli config update dev_mode on
```

---

## Step 2: Check Logs

Reproduce the issue in the UI, then review the logs at the same time to spot errors.

* **DavPanel logs:**

  ```bash
  docker logs -f davpanel
  ```
* **DavAdmin logs:**

  ```bash
  tail -f /var/log/davpanel/admin/error.log
  ```

---

## Step 3: Disable Developer Mode

After finishing, disable developer mode to prevent unnecessary log growth:

```bash
davcli config update dev_mode off
```

