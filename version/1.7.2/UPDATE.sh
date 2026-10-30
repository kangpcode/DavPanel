#!/bin/bash

echo 
echo "Updating service logs for DavAdmin Log Viewer.."
wget -O /etc/davpanel/davadmin/config/log_paths.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/log_paths.json


mv /etc/davpanel/davadmin/config/terms_temporary_off /etc/davpanel/davadmin/config/terms.md
