#!/bin/bash

echo "Adding support for detailed debug messages when dev_mode=on for DavPanel GUI.."
wget -4 -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/fc1b6503cc62e3d61abab6473e42175e63fb7436/davpanel/service/service.config.py && docker restart davpanel

echo "Adding support for detailed debug messages when dev_mode=on for DavAdmin GUI.."
wget -4 -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py
