#!/bin/bash


echo ""
echo "📥 Editing SSH welcome message for administrators.."
wget -O /etc/davpanel/ssh/admin_welcome.sh https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/ssh/admin_welcome.sh
chmod +x /etc/davpanel/ssh/admin_welcome.sh



mkdir -p /etc/davpanel/davpanel/features

echo ""
echo "📥 Downloading default feature set for new users.."
wget -O /etc/davpanel/davpanel/features/default.txt https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/features/default.txt

echo ""
echo "Setting default feature set for all existing users.."

for dir in /home/*; do
  if [ -d "$dir" ]; then
    if [ -f "$dir/.env" ]; then
      rm -rf "$dir/features.txt"
      echo "- Default feature set applied for user $dir"
    fi
  fi
done
