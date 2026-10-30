#!/bin/bash


echo ""
echo "📥 Downloading files to allow auto-login to phpMyAdmin for users.."
mkdir -p /etc/davpanel/mysql/phpmyadmin/
wget -q -O "/etc/davpanel/mysql/phpmyadmin/pma.php" "https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/mysql/phpmyadmin/pma.php" && \
    echo "✔ downloaded /etc/davpanel/mysql/phpmyadmin/pma.php"
wget -q -O "/etc/davpanel/mysql/phpmyadmin/config.inc.php" "https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/mysql/phpmyadmin/config.inc.php" && \
    echo "✔ downloaded /etc/davpanel/mysql/phpmyadmin/config.inc.php"


