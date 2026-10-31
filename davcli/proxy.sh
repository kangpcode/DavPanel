#!/bin/bash
################################################################################
# Script Name: proxy.sh
# Description: View and change proxy path '/davpanel' for accessing davpanel.
# Usage: davcli proxy [set <path>|default] [--no-restart]
# Author: Stefan Pejcic
# Created: 17.02.2025
# Last Modified: 26.10.2026
# Company: OpenPanel, LLC.
# Copyright (c) openpanel.com
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
################################################################################


COMPOSE_DIR="/root"
REDIRECTS_FILE="/etc/davpanel/caddy/redirects.conf"

get_current_path() {
  current_path=$(awk '/^@davpanel path/ {match($0, /\/([^*]*)\*/ , arr); print arr[1]}' "$REDIRECTS_FILE")
  echo "$current_path"
}


usage() {

echo "Usage:"
echo ""
echo "davcli proxy                        - displays current path"
echo "davcli proxy set /custompath        - set /custompath for access"
echo "davcli proxy default                - set /davpanel for access"
echo ""
echo "Add --no-restart to skip restarting services after the change."
}



success_msg() {
  echo "/$new_path is now set for accessing the DavPanel interface."             
}

# for podman compose
update_redirects() {
  sed -i 's|\(@davpanel path /\)[^*]*\*|\1'"$new_path"'*|' "$REDIRECTS_FILE"
}

# for redirects!
do_reload() {
  if [[ "$NO_RESTART" != true ]]; then
    cd $COMPOSE_DIR || exit
    nohup podman-compose restart davpanel > /dev/null 2>&1 &
   fi
}



update_path() {
  current_path=$(get_current_path)
      if [ "$current_path" != "$new_path" ]; then
        update_redirects
        do_reload
        success_msg
      else
        echo "Path /${new_path} is already set for accessing the user panel."
        exit 0
      fi

}




NO_RESTART=false
for arg in "$@"; do
  [[ "$arg" == "--no-restart" ]] && NO_RESTART=true
done

if [ -z "$1" ]; then
    get_current_path
elif [[ "$1" == 'set' && -n "$2" ]]; then
    if [[ "$2" =~ ^(/?[a-zA-Z0-9_-]+)$ ]]; then
        new_path="${2#/}"
        update_path "$new_path"
    else
        echo "Invalid path format. Please provide a path like '/davpanel' or '/hosting'."
        usage
        exit 1
    fi
elif [[ "$1" == 'default' ]]; then
        new_path="davpanel"
        update_path $new_path
else
    usage
    exit 1
fi
