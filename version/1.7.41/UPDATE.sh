#!/bin/bash

# https://github.com/stefanpejcic/OpenPanel/issues/834
echo 
wget -O /etc/davpanel/davadmin/config/shortcuts.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/shortcuts.json

# https://community.davpanel.com/d/241-caddy-failing-after-adding-a-domain-waf-update-issue
echo
mv /etc/davpanel/caddy/coreruleset/rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf.disabled /etc/davpanel/caddy/coreruleset/rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf && docker restart caddy


echo 
wget -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json
