#!/bin/bash
# env added to pip and services files edited to remove lock files on startup

cd /usr/local/admin/

source /usr/local/admin/venv/bin/activate
pip install --default-timeout=3600 --force-reinstall --ignore-installed -r requirements.txt  > /dev/null 2>&1 || pip install --default-timeout=3600 --force-reinstall --ignore-installed -r requirements.txt --break-system-packages  > /dev/null 2>&1

deactivate

wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py
wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

systemctl daemon-reload

systemctl restart admin
