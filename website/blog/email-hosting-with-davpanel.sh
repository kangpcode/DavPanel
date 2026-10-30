---
title: Effortless Email Hosting with DavPanel
description: How to setup Email-only Hosting plans with DavPanel Enterprise edition
slug: email-hosting-with-davpanel
authors: kangpcode
tags: [DavPanel, Email]
image: https://davpanel.com/img/blog/email-hosting-with-davpanel.png
hide_table_of_contents: true
---

Not every client needs a full web hosting package. Some businesses only want secure, professional email addresses under their domain—without the extra cost and complexity of website hosting. **DavPanel** makes this easy with dedicated **Email-only hosting plans** powered by its robust MailServer stack, complete with webmail, spam protection, relay support, and bulk account management.

<!--truncate-->

![email-manager]()

---

## Setting Up Email-Only Hosting Plans

DavPanel allows you to define features per plan, making it easy to create **Email-only packages** for clients who only need professional email services.


### Step 1. Configure Mailserver

Go to **DavAdmin > License** and isert your DavPanel Enterprise license code.

Navigate to INSTALL mailserver

Open Emial Settings and set X Y Z

![screenshot]()

### Step . Enable Modules

Go to **DavAdmin > Settings > Modules** and enable the modules required for email hosting:

- **Emails** – Manage accounts & quotas  
- **Webmail** – Enable browser-based access  
- **MailServer** – Enable core mail services  
- **SSL** – Secure mail connections with custom SSL  
- **SpamAssassin / Rspamd** – Optional spam filtering  
- **ClamAV** – Optional antivirus scanning  
- **fail2ban** – Optional brute-force protection  

![screenshot]()

---

### Step 2: Create a Feature Set

Create a new feature set for Email-only plans:

1. Go to **DavAdmin > Hosting Plans > Feature Manager**  
2. Under *Add a new feature list*, enter: `email_only` and click **Create**  
   ![screenshot](https://i.postimg.cc/wT4WZjLW/create-feature-set.png)
3. Select the new feature set under *Manage feature set*  
4. Enable relevant features: Emails, Webmail, MailServer, SSL, and any optional security features.  
   ![screenshot]()

---

### Step 3: Create Hosting Plans

With the feature set ready, create hosting plans:

1. Go to **DavAdmin > Hosting Plans > User Packages** and click **Create New**  
2. Fill in the plan limits (number of accounts, storage quota, etc.)  
3. Select `email_only` under *Feature Set*  
4. Click **Create Plan**  

Example plans:  

- **Business Email**  
- **Business Email PRO**  

![screenshot](https://i.postimg.cc/RVZsgH66/create-wp-plan.png)

---

### Step 4: Create User Accounts

After setting up plans, you can create email accounts manually via DavAdmin, through the terminal, or via third-party billing systems like WHMCS or FOSSBilling.  

- **Domain** – Select the domain name for the account  
- **Username** – Set the mailbox (e.g., `info` or `office`)  
- **Password** – Set or generate a strong password  
- **Quota** – Define mailbox storage limits  

![screenshot]()

---

## Key Features of Email Hosting Plans

These are the features that are now available to users on the Email-only hosting plans:

### Email Accounts & Quotas

Easily create and manage accounts with:

* Full email address (e.g., `user@domain.com`)  
* Adjustable quotas per mailbox  
* Overview of usage from the dashboard  

---

### Webmail Access

Each account includes **RoundCube webmail**, accessible via `/webmail` or a dedicated subdomain (e.g., `mail.yourdomain.com`).

* Modern, browser-based client  
* Customizable webmail domain  
* Users can log in from anywhere  

---

### Security & Filtering

Keep communication safe and spam-free:

* **Spam Protection** – SpamAssassin, Rspamd, DNS block lists  
* **Antivirus** – ClamAV scanning  
* **Authentication** – DKIM, DMARC, MTA-STS support  
* **Brute-force Protection** – fail2ban integration  

---

### Relay Host Support

Improve deliverability with trusted third-party SMTP relays:

* Configure relay host, port, and credentials  
* Route outbound email for higher inbox placement  
* Organization-wide relay settings in one place  

---

### Bulk Account Creation

Save time with the **Address Importer**:

* Import accounts from `.xls`, `.xlsx`, or `.csv`  
* Define username, password, and quota  
* Preview and confirm before creating  
* Skip duplicates and invalid domains  

---

### Email Filters with Sieve

Users can organize mail with advanced **Sieve filtering**:

* Define rules for sorting or redirecting messages  
* Apply filters per account  
* Easily manage scripts from DavPanel  

---

## Why Choose DavPanel for Email Hosting?

DavPanel gives email hosting a modern edge:

* **Affordable:** Offer low-cost, email-only plans  
* **Secure by Default:** Built-in spam, antivirus, and authentication  
* **Simple:** Clean interface for managing accounts and quotas  
* **Flexible:** Supports relay hosts and bulk imports  
* **Scalable:** Manage single accounts or entire organizations  

With DavPanel, you can deploy **enterprise-grade email hosting** in minutes, helping your clients stay connected with a professional and secure communication platform.  

---

👉 Ready to offer **Email-only hosting**? Start with **DavPanel Enterprise Edition** and deliver secure, professional email services to your clients today.
