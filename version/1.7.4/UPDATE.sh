#!/bin/bash

# https://github.com/stefanpejcic/OpenPanel/issues/806
sed -i 's/^reseller=no$/reseller=yes/' /etc/davpanel/davadmin/config/admin.ini


sudo curl -sSL -o /etc/davpanel/caddy/check.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/caddy/check.conf
