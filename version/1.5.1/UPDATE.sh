#!/bin/bash

wget -O /etc/davpanel/ftp/Dockerfile https://raw.githubusercontent.com/kangpcode/DavPanel-FTP/refs/heads/master/Dockerfile


wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py


wget -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json
