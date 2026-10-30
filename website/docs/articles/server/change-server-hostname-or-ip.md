---
sidebar_label: "Change Server Hostname or IP"
description: "How to change the hostname (panel domain) or the IP address of an DavPanel server: update the panel domain and SSL, mail hostname and PTR, DNS zones, nameserver glue records, dedicated IPs and the license."
---

# How to Change the Server Hostname or IP Address

This guide covers two common server changes:

- **Changing the hostname** - the domain used to access DavAdmin and DavPanel (and by the mail server), e.g. `server.example.com`.
- **Changing the IP address** - for example after your provider assigns a new IP, or you move the disk to another server.

---

## Change the Hostname (Panel Domain)

### 1. Create the DNS record

Point the new hostname to the server's IP with an `A` record, for example:

```
server.example.com.   A   203.0.113.10
```

Wait until it resolves (`dig +short server.example.com`).

### 2. Set it in DavAdmin

Go to **DavAdmin → Settings → General** and set the **Domain** - see [General settings](/docs/admin/settings/general/#domain).

![Domain section of General Settings with the hostname field](/img/davadmin-screenshots/settings/general-domain.png#gh-light-mode-only)
![Domain section of General Settings with the hostname field](/img/davadmin-screenshots/settings/general-domain_dark.png#gh-dark-mode-only)

Or from the terminal:

```bash
davcli domain set server.example.com
```

DavPanel then:

- serves DavAdmin on `https://server.example.com:2087` and DavPanel on `https://server.example.com:2083`, with a free SSL certificate,
- updates the `/davpanel` and `/davadmin` shortcut redirects on user domains,
- configures the **mail server** to use this hostname and certificate (Enterprise).

To go back to accessing the panels by IP address:

```bash
davcli domain ip
```

To use a separate domain for the user panel only, see [Set a separate domain for DavPanel](/docs/articles/dev-experience/separate-domain-for-davpanel-access/).

### 3. Set the system hostname (optional)

The Linux hostname is separate from the panel domain. To keep them the same:

```bash
hostnamectl set-hostname server.example.com
```

### 4. Update reverse DNS

If the server sends email, set the IP's **PTR record** to the new hostname at your provider - see [Set up reverse DNS (PTR)](/docs/articles/email/reverse-dns-ptr-record/).

---

## Change the IP Address

When the server's public IP changes, everything that points to the old IP must be updated.

### 1. Check the new IP

```bash
curl -4 https://ip.davpanel.com
```

This is the IP DavPanel uses as the server's main IP - see [Main IP in DavPanel](/docs/articles/install-update/davpanel-main-ip-address/).

### 2. Update the DNS zones hosted on the server

Replace the old IP in all zone files (`A` records, and `ip4:` in SPF records), then reload the DNS service:

```bash
OLD_IP=198.51.100.20
NEW_IP=203.0.113.10

cp -a /etc/bind/zones /root/zones-backup-$(date +%F)
sed -i "s/\b${OLD_IP//./\\.}\b/${NEW_IP}/g" /etc/bind/zones/*.zone
podman exec davpanel_dns rndc reload
```

Check a domain:

```bash
dig +short @127.0.0.1 example.com
```

:::info DNS cluster
If you use [DNS clustering](/docs/articles/domains/how-to-setup-dns-cluster-in-davpanel/), also increase the **serial number** in each changed zone, so the slave servers pick up the change.
:::

### 3. Update nameserver glue records

If your custom nameservers (`ns1.example.com`, `ns2.example.com`) point to this server, update their IP at the **domain registrar** where they are registered (often called *glue records*, *child nameservers* or *host records*). See [Configure nameservers](/docs/articles/domains/how-to-configure-nameservers-in-davpanel/).

### 4. Update external DNS

Domains whose DNS is hosted **elsewhere** (Cloudflare, registrar DNS) need their `A` and SPF records updated there. Ask your users to do this for their own domains.

### 5. Refresh the panel address

If the panels are accessed by IP (no domain set), run:

```bash
davcli domain ip
```

so DavAdmin and DavPanel are served on the new IP. If you use a panel domain, just update its `A` record (step 2 or 4).

### 6. Dedicated IPs, license and PTR

- **Users with a dedicated IP**: reassign with `davcli user-ip USERNAME NEW_IP` - see [Dedicated IP for a user](/docs/articles/accounts/set-dedicated-ip-address-for-user/).
- **DavPanel Enterprise license**: licenses are tied to the server IP. Move the license to the new IP - see [Transfer a license to a new server or IP](/docs/articles/license/transfer-davpanel-license-to-new-server/).
- **Reverse DNS**: set the PTR record for the **new** IP.
- **Firewall**: if you allow-listed the old IP anywhere (external firewalls, remote MySQL, monitoring), update it.

---

## Moving to a New Server Instead?

To move all accounts to a different server, use the migration tool - it also updates the DNS zones: [Migrate all accounts to a new server](/docs/articles/transfers/migrate-davadmin-to-new-server/).

---

## Related

- [Add extra IP addresses](/docs/articles/server/add-ip-addresses/)
- [Access DavAdmin](/docs/articles/dev-experience/how-to-access-davadmin/)
