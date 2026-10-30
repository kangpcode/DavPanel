#!/bin/bash

#wget -O /etc/davpanel/ftp/start_vsftpd.sh https://raw.githubusercontent.com/kangpcode/DavPanel-FTP/refs/heads/master/start_vsftpd.sh

wget -O /etc/davpanel/ftp/vsftpd.conf https://raw.githubusercontent.com/kangpcode/DavPanel-FTP/refs/heads/master/vsftpd.conf


touch /root/davpanel_restart_needed

wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

wget -O /etc/davpanel/mysql/phpmyadmin/config.inc.php https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/mysql/phpmyadmin/config.inc.php



