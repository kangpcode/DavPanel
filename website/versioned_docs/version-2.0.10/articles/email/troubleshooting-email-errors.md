# Email Errors

Email communication is crucial for any organization, but issues can arise that disrupt this essential service. This guide provides practical steps to diagnose and resolve common email errors encountered in [DavPanel Enterprise edition](/enterprise/), ensuring your email systems run smoothly and efficiently.

## Not able to send emails

Cloud hosting providers such as Hetzner block sending emails using `25` and `465` ports. Make sure that your provider does not block these ports.


## ERROR list mail user: '/tmp/docker-mailserver/postfix-accounts.cf' does not exist

Dovecot is not started until the first email account is created, therefor listing email accounts with the command `davcli email-setup email list` before creating any email accounts, will produce error:
```bash
root@stefi:/usr/local/mail/openmail# davcli email-setup email list
2024-08-27 07:55:15+00:00 ERROR listmailuser: '/tmp/docker-mailserver/postfix-accounts.cf' does not exist
2024-08-27 07:55:15+00:00 ERROR listmailuser: Aborting
```

**Solution**: Create an email account first with [davcli email-setup email add](https://dev.davpanel.com/cli/email.html#Create-email).

----


## Error: auth-master: userdb lookup(user@example.net): connect(/run/dovecot/auth-userdb) failed: No such file or directory

Immediately after creating first email account, dovecot is still creating necessary files in the background, so running the `davcli email-setup email list`  immediately after creating first email account will produce an error:

```
root@stefi:/usr/local/mail/openmail# davcli email-setup email list
doveadm(stefan@stefi.davpanel.site)<577><>: Error: auth-master: userdb lookup(stefan@stefi.davpanel.site): connect(/run/dovecot/auth-userdb) failed: No such file or directory
doveadm(stefan@stefi.davpanel.site): Error: User lookup failed: Internal error occurred. Refer to server log for more information.
2024-08-27 07:55:46+00:00 ERROR listmailuser: Supplied non-number argument '' to '_bytes_to_human_readable_size()'
2024-08-27 07:55:46+00:00 ERROR listmailuser: Aborting
2024-08-27 07:55:46+00:00 ERROR listmailuser: Supplied non-number argument '' to '_bytes_to_human_readable_size()'
2024-08-27 07:55:46+00:00 ERROR listmailuser: Aborting
* stefan@stefi.davpanel.site (  /  ) [%]
```

**Solution**: Repeat the command `davcli email-setup email list`

----
