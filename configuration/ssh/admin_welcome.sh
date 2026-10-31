#!/bin/bash
#  nano /etc/profile.d/welcome.sh && chmod +x /etc/profile.d/welcome.sh
[ "$(id -u)" -ne 0 ] && return

# skip banner when launched from the DavAdmin > Advanced > Web Terminal
[ -n "$DAVPANEL_HIDE_WELCOME" ] && return 0 2>/dev/null || true

VERSION=$(/usr/local/bin/davcli version)
DAVADMIN_STATUS=$(/usr/local/bin/davcli admin)

echo -e  "================================================================"
echo -e  ""
echo -e "  🚀 DavPanel ${VERSION}"
echo -e  ""
echo -e  "$DAVADMIN_STATUS"
echo -e  ""
echo -e "  📖 Resources:"
echo -e "     • Docs:     https://davpanel.com/docs/admin/intro/"
echo -e "     • Forums:   https://community.davpanel.org/"
echo -e "     • Discord:  https://discord.davpanel.org/"
echo -e ""
echo -e "================================================================"
