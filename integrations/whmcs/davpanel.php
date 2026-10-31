<?php
################################################################################
# Name: DavPanel WHMCS Module
# Usage: https://davpanel.com/docs/articles/extensions/davpanel-and-whmcs/
# Source: https://github.com/kangpcode/davpanel-whmcs-module
# Author: Stefan Pejcic
# Created: 01.05.2024
# Last Modified: 10.09.2026
# Company: openpanel.com
# Copyright (c) Stefan Pejcic
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

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}


# ======================================================================
# Logging
define('DAVPANEL_DEBUG', true);

function davpanelLog($action, $params = [], $request = null, $response = null, $error = null) {
    logModuleCall('davpanel', $action, $request ?? $params, $response, $error);
}


# ======================================================================
# START Helpers

function davpanelBaseUrl($params) {
    $protocol = filter_var($params['serverhostname'], FILTER_VALIDATE_IP) ? 'http://' : 'https://';
    $port = !empty($params['serverport']) ? $params['serverport'] : 2087;
    return $protocol . $params['serverhostname'] . ':' . $port;
}

/*
    send username and password to receive JWT token as `access_token`
*/
function davpanelGetAuthToken($params) {
    $endpoint = davpanelBaseUrl($params) . '/api/';
    $password = $params['serverpassword'] ?? '';
    $decrypted = @decrypt($password);
    $passwordToUse = $decrypted ?: $password;

    $postData = [
        'username' => $params['serverusername'] ?? '',
        'password' => $passwordToUse
    ];

    $response = davpanel_exec_curl_with_options([
        CURLOPT_URL => $endpoint,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($postData),
    ]);

    $data = json_decode($response, true);
    if (!isset($data['access_token'])) {
        davpanelLog('Auth response is missing token', $params, $postData, $response);
        return false;
    }

    return $data['access_token'];
}

// cURL executor
function davpanel_exec_curl_with_options(array $options) {
    $curl = curl_init();
    curl_setopt_array($curl, $options + [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ]);

    $response = curl_exec($curl);

    if ($response === false) {
        $error = curl_error($curl);
        if (defined('DAVPANEL_DEBUG') && DAVPANEL_DEBUG) {
            logModuleCall('davpanel', 'cURL Error', $options, null, $error);
        }
        curl_close($curl);
        throw new Exception($error);
    }

    if (defined('DAVPANEL_DEBUG') && DAVPANEL_DEBUG) {
        logModuleCall('davpanel', 'cURL Response', $options, $response, null);
    }

    curl_close($curl);
    return $response;
}

function davpanelApiRequest($params, $uri, $token, $method = 'POST', $data = null) {
    try {
        $response = json_decode(
            davpanel_exec_curl_with_options([
                CURLOPT_URL => davpanelBaseUrl($params) . $uri,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => [
                    "Authorization: Bearer $token",
                    "Content-Type: application/json"
                ],
                CURLOPT_POSTFIELDS => $data ? json_encode($data) : null,
            ]),
            true
        );

        davpanelLog('API ' . $uri, $params, $data, $response);

        return $response;
    } catch (Exception $e) {
        davpanelLog('API Exception ' . $uri, $params, $data, null, $e->getMessage());
        throw $e; // rethrow
    }
}

/*
    run user actions
*/
function davpanelValidateServerType($params) {
    $server = mysql_fetch_array(
        select_query('tblservers', 'type', [
            'hostname' => $params['serverhostname'],
            'disabled' => 0,
        ])
    );
    return $server && $server['type'] === 'davpanel';
}


function davpanelUserAction($params, $method, $payload = null) {
    if (empty($params['serverhostname']) || empty($params['serverusername']) || empty($params['serverpassword'])) {
        try {
            $serverParams = davpanelGetServerParams($params);
        } catch (Exception $e) {
            return 'Error fetching server credentials: ' . $e->getMessage();
        }

        $params['serverhostname'] = $serverParams['serverhostname'];
        $params['serverport']     = $serverParams['serverport'];
        $params['serverusername'] = $serverParams['serverusername'];
        $params['serverpassword'] = $serverParams['serverpassword'];
    }

    if (!davpanelValidateServerType($params)) {
        return 'Server is not configured as an DavPanel server';
    }

    if (!$token = davpanelGetAuthToken($params)) return 'Authentication failed';

    $response = davpanelApiRequest($params,'/api/users/' . $params['username'],$token,$method,$payload);

    return ($response['success'] ?? false)
        ? 'success'
        : ($response['error'] ?? 'Unknown error');
}

// GENERATE LOGIN LINK
// https://github.com/stefanpejcic/openpanel-whmcs-module/issues/8
function davpanelGenerateLoginLink($params) {
    if (!$token = davpanelGetAuthToken($params)) return 'Authentication failed';
    $response = davpanelApiRequest($params, '/api/users/' . $params['username'] . '/autologin', $token, 'POST');
    return isset($response['link'])
        ? [$response['link'], null]
        : [null, $response['message'] ?? $response['error'] ?? 'Unable to generate login link'];
}

// https://github.com/stefanpejcic/openpanel-whmcs-module/issues/7
function davpanelGenerateAdminLoginLink($params) {
    $endpoint = davpanelBaseUrl($params) . '/api/login';
    $password = $params['serverpassword'] ?? '';
    $decrypted = @decrypt($password);
    $passwordToUse = $decrypted ?: $password;

    $postData = [
        'username' => $params['serverusername'] ?? '',
        'password' => $passwordToUse,
    ];

    $response = json_decode(
        davpanel_exec_curl_with_options([
            CURLOPT_URL => $endpoint,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($postData),
        ]),
        true
    );

    davpanelLog('API /api/login', $params, $postData, $response);

    return isset($response['login_path'])
        ? [davpanelBaseUrl($params) . $response['login_path'], null]
        : [null, $response['message'] ?? $response['error'] ?? 'Unable to generate login link'];
}

function davpanelLoginButtonHtml($link, $label = 'Login to DavPanel') {
    return '
<script>
function loginDavPanelButton() {
    document.getElementById("loginLink").textContent = "Logging in...";
    document.getElementById("refreshMessage").style.display = "block";
    document.getElementById("loginLink").style.display = "none";
}
</script>
<a id="loginLink" class="btn btn-primary"  style="display:block;" href="' . htmlspecialchars($link) . '" target="_blank" onclick="loginDavPanelButton()">' . htmlspecialchars($label) . '</a>
<p id="refreshMessage" style="display:none;">One-time login link has already been used, please refresh the page to login again.</p>';
}

// helper function used on AdminServicesTabFields 
function davpanelGetServerParams($params) {
    $server = mysql_fetch_array(
        select_query(
            'tblservers',
            '*',
            ['id' => (int) $params['serverid']]
        )
    );

    if (!$server) {
        throw new Exception('Server not found');
    }

    return [
        'serverhostname' => $server['hostname'],
        'serverport'     => $server['port'],
        'serverusername' => $server['username'],
        'serverpassword' => $server['password'],
    ];
}


# END Helpers
# ======================================================================
# START Client Area Functions

/*
    CREATE ACCOUNT
*/
function davpanel_CreateAccount($params) {
    if (!$token = davpanelGetAuthToken($params)) return 'Authentication failed';

    $product = mysql_fetch_array(
        select_query('tblproducts', 'name', ['id' => $params['pid']])
    );

    // 1. create user
    $createUserResponse = davpanelUserAction($params, 'POST', [
        'username'  => $params['username'],
        'password'  => $params['password'],
        'email'     => $params['clientsdetails']['email'],
        'plan_name' => $product['name'],
    ]);

    if ($createUserResponse !== 'success') {
        return 'Failed to create user: ' . $createUserResponse;
    }

    // 2. add the domain
    if (!empty($params['domain'])) {
        $domainData = [
            'username' => $params['username'],
            'domain'   => $params['domain'],
            'docroot'  => $params['docroot'] ?? '/var/www/html/' . $params['domain']
        ];

        $domainResponse = davpanelApiRequest($params, '/api/domains/new', $token, 'POST', $domainData);
        if (($domainResponse['returncode'] ?? 1) !== 0) {
            return 'User created, but failed to add domain: ' . trim($domainResponse['stderr'] ?? 'Unknown error');
        }
    }

    return 'success';
}


/*
    SUSPEND ACCOUNT
*/
function davpanel_SuspendAccount($params) {
    return davpanelUserAction($params, 'PATCH', ['action' => 'suspend']);
}

/*
    UNSUSPEND ACCOUNT
*/
function davpanel_UnsuspendAccount($params) {
    return davpanelUserAction($params, 'PATCH', ['action' => 'unsuspend']);
}


/*
    CHANGE PASSWORD
*/
function davpanel_ChangePassword($params) {
    return davpanelUserAction($params, 'PATCH', [
        'password' => $params['password']
    ]);
}

/*
    TERMINATE ACCOUNT
*/
function davpanel_TerminateAccount($params) {
    davpanelUserAction($params, 'PATCH', ['action' => 'unsuspend']);
    return davpanelUserAction($params, 'DELETE');
}

/*
    CHANGE PACKAGE
*/
function davpanel_ChangePackage($params) {
    $product = mysql_fetch_array(
        select_query('tblproducts', 'name', ['id' => $params['pid']])
    );

    return davpanelUserAction($params, 'PUT', [
        'plan_name' => $product['name']
    ]);
}

/* 
    CLIENT AREA - Currently just shows autologin link
*/
function davpanel_ClientArea($params) {
    list($link, $error) = davpanelGenerateLoginLink($params);

    return $link
        ? davpanelLoginButtonHtml($link)
        : '<p>Error generating autologin link: ' . htmlentities($error) . '</p>';
}



# END Client Area Functions
# ======================================================================
# START Admin Area Functions


// ADMIN LINK
function davpanel_AdminLink($params) {
    list($link, $error) = davpanelGenerateAdminLoginLink($params);

    return $link
        ? davpanelLoginButtonHtml($link, 'Login to DavAdmin')
        : '<p>Error generating admin login link: ' . htmlentities($error) . '</p>';
}


// LOGIN LINK DISPLAYED ON ADMIN AREA
function davpanel_LoginLink($params) {
    return davpanel_ClientArea($params);
}

// AVAILABLE PLANS
function getAvailablePlans($params) {
    if (!$token = davpanelGetAuthToken($params)) return 'Authentication failed';  
    $response = davpanelApiRequest($params, '/api/plans', $token, 'GET');
    return $response['plans'] ?? 'Invalid plans response';
}

// CONFIG OPTIONS
function davpanel_ConfigOptions() {
    $productId = (int)($_REQUEST['id'] ?? 0);
    if (!$productId) {
        return ['Note' => ['Description' => 'Please save the product first.']];
    }

    $product = mysql_fetch_array(
        select_query('tblproducts', 'servergroup', ['id' => $productId])
    );

    if (empty($product['servergroup'])) {
        return ['Note' => ['Description' => 'Assign a server group first.']];
    }

    $server = davpanelGetServerForGroup((int)$product['servergroup']);

    if (!$server) {
        return ['Note' => ['Description' => 'No active DavPanel server found in the assigned server group.']];
    }

    $plans = getAvailablePlans([
        'serverhostname' => $server['hostname'],
        'serverport'     => $server['port'],
        'serverusername' => $server['username'],
        'serverpassword' => $server['password'],
    ]);

    if (!is_array($plans)) {
        return ['Note' => ['Description' => $plans]];
    }

    $options = [];
    foreach ($plans as $plan) {
        $options[$plan['id']] = $plan['name'];
    }

    return [
        'Plan' => [
            'Type' => 'dropdown',
            'Options' => $options,
            'Description' => 'Select a plan from DavPanel',
        ],
    ];
}

function davpanelGetServerForGroup(int $serverGroupId): ?array {
    $rel = mysql_fetch_array(
        select_query(
            'tblservergroupsrel',
            'serverid',
            ['groupid' => $serverGroupId]
        )
    );

    if (!$rel) {
        return null;
    }

    $server = mysql_fetch_array(
        select_query('tblservers', '*', [
            'id'       => (int)$rel['serverid'],
            'type'     => 'davpanel',
            'disabled' => 0,
        ])
    );

    return $server ?: null;
}

// USAGE UPDATE
function davpanel_UsageUpdate($params) {
    $token = davpanelGetAuthToken($params);
    if (!$token) {
        return json_encode(['success' => false, 'message' => 'Auth failed']);
    }

    $usage = davpanelApiRequest($params, '/api/usage/disk', $token, 'GET');
    foreach ($usage as $user => $values) {
        update_query('tblhosting', [
            'diskusage' => $values['diskusage'],
            'disklimit' => $values['disklimit'],
            'lastupdate' => 'now()',
        ], [
            'server' => $params['serverid'],
            'username' => $user,
        ]);
    }

    return json_encode(['success' => true]);
}

/*
    SERVICES IN ADMIN AREA
*/
function davpanel_AdminServicesTabFields($params) {
    $fields = [];

    try {
        $serverParams = davpanelGetServerParams($params);
        $apiParams = array_merge($params, $serverParams);

        $token = davpanelGetAuthToken($apiParams);
        if (!$token) {
            $fields['DavPanel Account Information'] = '<span class="badge bg-danger">Failed to authenticate with DavAdmin API to fetch user information.</span>';
            return $fields;
        }

        $response = davpanelApiRequest($apiParams, '/api/users/' . $params['username'], $token, 'GET');
        if (empty($response['user'])) {
            $fields['DavPanel Account Information'] = '<span class="badge bg-warning">User does not exist on this DavPanel server</span>';
            return $fields;
        }

        $responseUser = $response['user'];
        $user    = $responseUser['user'] ?? [];
        $plan    = $responseUser['plan'] ?? [];
        $domains = $responseUser['domains'] ?? [];
        $sites   = $responseUser['sites'] ?? [];
        $disk    = $responseUser['disk_usage'] ?? [];

        // Prepare disk items for template
        $diskItems = [];
        foreach (['disk_used'=>'Disk Used','inodes_used'=>'Inodes Used'] as $key => $label) {
            $value = $disk[$key] ?? 0;
            $max = $disk[str_replace('_used','_hard',$key)] ?? 1;
            $percent = ($max > 0) ? round(($value / $max) * 100, 2) : 0;
            $diskItems[] = ['label'=>$label, 'value'=>$value, 'max'=>$max, 'percent'=>$percent];
        }

        // Map domain sites
        $domainSites = [];
        foreach ($domains as $domain) {
            $domainSites[$domain['domain_id']] = array_filter($sites, fn($s) => ($s['domain_id'] ?? 0) == ($domain['domain_id'] ?? 0));
        }

        $planFields = [
            'name'=>'Name','description'=>'Description','domains_limit'=>'Domains Limit','websites_limit'=>'Websites Limit',
            'cpu'=>'CPU','ram'=>'RAM','bandwidth'=>'Bandwidth','db_limit'=>'Database Limit',
            'email_limit'=>'Email Limit','ftp_limit'=>'FTP Limit','feature_set'=>'Feature Set'
        ];

        $smarty = new \Smarty();
        $smarty->assign(compact('disk', 'diskItems', 'domains', 'domainSites', 'totalDomains', 'totalSites', 'plan', 'planFields', 'user'));
        $totalDomains = count($domains);
        $totalSites = count($sites);

        $fields['DavPanel Account Information'] = $smarty->fetch(__DIR__ . '/templates/admin_services_tab.tpl');

    } catch (Exception $e) {
        $fields['DavPanel Account Information'] = '<span class="badge bg-danger">Error: ' . htmlspecialchars($e->getMessage()) . '</span>';
    }

    return $fields;
}

# END Admin Area Functions
# ======================================================================

?>
