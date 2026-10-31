#!/bin/bash
################################################################################
# Script Name: ftp/delete.sh
# Description: Delete FTP sub-user for davpanel user.
# Usage: davcli ftp-delete <username> <davpanel_username> [--debug]
# Docs: https://docs.davpanel.com
# Author: Stefan Pejcic
# Created: 22.05.2024
# Last Modified: 14.10.2026
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

# ======================================================================
# Usage
if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
    echo "Usage: davcli ftp-delete <username> <davpanel_username> [--debug]"
    exit 1
fi


# ======================================================================
# Variables
username="${1,,}"
davpanel_username="$2"

# reject anything outside the charset the panel enforces at account-creation time - username gets interpolated into a SQL string and a podman exec command below
at_count="${username//[^@]/}"
if [[ -z "$username" ]] || [[ "${#at_count}" -ne 1 ]] || [[ "$username" == @* || "$username" == *@ ]] || ! [[ "$username" =~ ^[A-Za-z0-9._@-]+$ ]]; then
    echo "ERROR: Invalid FTP username '$username'."
    exit 1
fi

get_docker_context_for_user(){
    context=$(mariadb -e "SELECT server FROM users WHERE username='$davpanel_username';" -N)   
	context=$(mariadb -N -e "
	SELECT u.server
	FROM users u
	WHERE u.username='$davpanel_username'
	AND EXISTS (
	    SELECT 1
	    FROM domains d
	    WHERE d.domain_url = SUBSTRING_INDEX('$username','@',-1)
	      AND d.user_id = u.id
	);
	")

    if [ -z "$context" ]; then
        echo "ERROR: No context found for user '$davpanel_username' - or does not own the domain name. Aborting!"
        exit 1
    fi    
}

# validate our op user owns the domain and get context
get_docker_context_for_user

mkdir -p /etc/davpanel/ftp/users/"${context}"
touch /etc/davpanel/ftp/users/"${context}"/users.list

if podman exec davadmin_ftp sh -c "deluser $username"; then
    sed -i "/^$username|/d" /etc/davpanel/ftp/users/"${context}"/users.list
    # clears a leftover upload block in case the same username is added again
    podman exec davadmin_ftp /bin/start_vsftpd.sh --check-quotas >/dev/null 2>&1
    davcli ftp-users >/dev/null 2>&1
    nohup davcli sentinel --action=ftp_delete --title="FTP account deleted" --message="FTP account '$username' has been deleted." >/dev/null 2>&1 &
    disown
    echo "Success: FTP user '$username' deleted successfully."
else
    echo "ERROR: Failed to delete FTP user. To debug run this command on terminal: davcli -x ftp-delete $username $davpanel_username"
    exit 1
fi
