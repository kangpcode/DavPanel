#!/bin/bash

# fixes bug with autologin to webmail on some installations
SHOULD_START_AGAIN=false
if [ -d "/usr/local/mail/openmail" ]; then
  cd /usr/local/mail/openmail || exit 1

  if docker --context=default ps --format '{{.Names}}' | grep -qx "roundcube"; then
    SHOULD_START_AGAIN=true
    timeout 5 docker --context=default compose down roundcube
  fi

  rm -f /usr/local/mail/openmail/roundcube-plugins/autologin.php
  mkdir -p /usr/local/mail/openmail/roundcube-plugins/dovecot_impersonate/
  wget -O "/usr/local/mail/openmail/roundcube-plugins/autologin.php" https://raw.githubusercontent.com/kangpcode/DavMail/refs/heads/main/roundcube-plugins/autologin.php
  wget -O "/usr/local/mail/openmail/roundcube-plugins/dovecot_impersonate/dovecot_impersonate.php" https://raw.githubusercontent.com/kangpcode/DavMail/refs/heads/main/roundcube-plugins/dovecot_impersonate/dovecot_impersonate.php

  if [ "$SHOULD_START_AGAIN" = true ]; then
    timeout 5 docker --context=default compose up -d roundcube
  fi
fi

# fixes bug with ftp connections
VSFTPD_FILE="/etc/davpanel/ftp/vsftpd.conf"
LINE="setproctitle_enable=yes|"
if [ -f "$VSFTPD_FILE" ]; then
  if ! grep -q "^setproctitle_enable=" "$VSFTPD_FILE"; then
    echo "$LINE" >> "$VSFTPD_FILE"
    if docker --context=default ps --format '{{.Names}}' | grep -qx "davadmin_ftp"; then
      timeout 5 docker --context=default restart davadmin_ftp >/dev/null 2>&1
    fi
  fi
fi
