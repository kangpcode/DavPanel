---
sidebar_label: "Transfer License to a New Server"
---

# How to Transfer a License to a New Server or IP

Follow these steps to transfer your **DavPanel Enterprise Edition** license to another server:

1. Disable the license on your current server.
2. Reissue the license from your [my.davpanel.com](https://my.davpanel.com) account.
3. Add the license to your new server.

---

## 1. Remove License from the Old Server

On the server where your license is currently activated, remove the license using one of the following methods:

* **From DavAdmin:**
  Go to **DavAdmin > License & Support** and click the **Downgrade** button.
  ![Downgrade license](/img/docs-content/RSsLWmLQ-downgrade.png)

* **From the Terminal:**

  ```bash
  davcli license delete
  ```

Once the license has been removed from the old server, continue to the next step.

---

## 2. Reissue the License

Each license is automatically bound to the IP address of the server where it’s first activated.
To transfer it to a new server, you need to **reissue** the license:

1. Log in to your [my.davpanel.com account](https://my.davpanel.com/index.php?rp=/login).
2. Go to the [Licenses](https://my.davpanel.com/clientarea.php?action=services) section.
   ![Licenses list](/img/docs-content/KjG6p24j-lienses.png)
3. Find the license you want to move and click on it.
   ![License list](/img/docs-content/xC0pnPQZ-rows.png)
4. Click the **Reissue** button.
   ![Reissue license](/img/docs-content/xC0pnPQZ-rows.png)

After reissuing, the license is no longer tied to any IP address.
It will automatically bind to the next server where you activate it.

---

## 3. Add License to the New Server

Now, activate the license on your new server. You can do this in one of two ways:

* **From DavAdmin:**
  Go to **DavAdmin > License & Support**, enter your license key, and click **Save key**.
  ![Add license key](/img/guides/add_key.png)

* **From the Terminal:**

  ```bash
  davcli license add YOUR-KEY-HERE
  ```

---

**That’s it!** Your DavPanel Enterprise license is now successfully transferred to the new server.
