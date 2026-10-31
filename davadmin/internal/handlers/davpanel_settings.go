// This file implements the large DavPanel (end-user panel) configuration
// form -- branding, MySQL limits, file manager limits, session/login
// limits, and various yes/no toggles.
package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/gorilla/csrf"

	"github.com/kangpcode/davadmin/internal/auth"
	"github.com/kangpcode/davadmin/internal/config"
	"github.com/kangpcode/davadmin/internal/license"
	"github.com/kangpcode/davadmin/internal/webtemplates"
)

// DavpanelSettings bundles the /settings/open-panel handler.
type DavpanelSettings struct {
	Sessions       *auth.Manager
	LicenseChecker *license.Checker // nil on Community
	// panel DB, only used to count sites for the PageSpeed hint
	MySQL *sql.DB
}

// davpanelFileFields lists the custom-code-backed fields (raw files, not
// davpanel.config ini keys) that also render on this page: How-to
// Articles, Forbidden Usernames, Restricted Domains, and the PageSpeed API
// key. They share their file paths and Enterprise gating (howto_guides
// only) with the /settings/custom-code page -- see customCodeFilePaths in
// custom_code.go.
var davpanelFileFields = []string{"howto_guides", "forbidden_usernames", "restricted_domains", "pagespeed_api_key"}

var (
	DavpanelSettingsConfigPath      = "/etc/davpanel/davpanel/conf/davpanel.config"
	DavpanelSettingsRestartFlagPath = "/root/davpanel_restart_needed"
)

// davpanelIntFields lists the ~20 keys that must parse as a non-negative
// integer before being stored. A missing or non-numeric value for any of
// these is reported as a graceful validation error rather than being
// silently accepted. Only reachable via a malformed direct POST (the
// real HTML form always submits every field with a default), but
// handled deliberately rather than left to fail unpredictably.
var davpanelIntFields = []string{
	"autopurge_trash",
	"mysql_startup_time", "mysql_import_max_size_gb",
	"filemanager_files_per_page",
	"filemanager_edit_size", "filemanager_view_size", "filemanager_download_size",
	"filemanager_upload_size", "filemanager_compress_max_time", "filemanager_download_max_time",
	"filemanager_extract_max_time",
	"max_login_records", "login_ratelimit", "login_blocklimit",
	"session_duration", "session_lifetime", "activity_items_per_page",
	"domains_per_page", "terminal_timeout", "resource_usage_retention",
	"resource_usage_items_per_page",
}

// davpanelStringFields lists the plain-string fields (those not in
// davpanelIntFields above, and not the "weakpass" checkbox).
var davpanelStringFields = []string{
	"brand_name", "logo", "favicon", "ns1", "ns2", "ns3", "ns4",
	"menu_style", "avatar_type", "resource_usage_charts_mode", "password_reset", "password_strength",
	"permit_username_change_by_user", "permit_subdomain_sharing",
	"twofa_nag", "twofa_enforce", "how_to_guides", "onboarding", "found_a_bug_link", "ip_county_flag",
	"validate_ip_address_cookie",
	"mysql_restricted_usernames", "mysql_restricted_databases", "mysql_enforce_username_prefix",
	"filemanager_buttons_style", "filemanager_edit_extensions",
	"filemanager_image_extensions", "filemanager_archives_extensions",
	"logout_url",
	"captcha_provider", "recaptcha_site_key", "recaptcha_secret_key",
	"turnstile_site_key", "turnstile_secret_key", "custom_captcha_site_key",
	"applications_dashboard_items",
	"ai_provider", "ai_api_key", "ai_model", "ai_base_url", "ai_name", "ai_instructions",
	"ai_monthly_limit", "ai_max_tokens", "ai_actions",
}

type davpanelValidationKind int

const (
	davpanelEnum davpanelValidationKind = iota
	davpanelNonNegativeInt
	davpanelOneToHundred
	davpanelSpaceSeparatedList
	davpanelSpaceSeparatedExtensions
	davpanelOneToMax // options[0] is the max
	davpanelSingleLine
)

type davpanelRule struct {
	kind    davpanelValidationKind
	options []string
}

var davpanelValidValues = map[string]davpanelRule{
	"menu_style":                      {kind: davpanelEnum, options: []string{"classic", "modern"}},
	"avatar_type":                     {kind: davpanelEnum, options: []string{"gravatar", "icon", "letter"}},
	"resource_usage_charts_mode":      {kind: davpanelEnum, options: []string{"one", "two", "none"}},
	"activity_items_per_page":         {kind: davpanelNonNegativeInt},
	"login_ratelimit":                 {kind: davpanelNonNegativeInt},
	"login_blocklimit":                {kind: davpanelNonNegativeInt},
	"session_duration":                {kind: davpanelNonNegativeInt},
	"session_lifetime":                {kind: davpanelNonNegativeInt},
	"resource_usage_items_per_page":   {kind: davpanelNonNegativeInt},
	"resource_usage_retention":        {kind: davpanelNonNegativeInt},
	"max_login_records":               {kind: davpanelNonNegativeInt},
	"domains_per_page":                {kind: davpanelNonNegativeInt},
	"terminal_timeout":                {kind: davpanelNonNegativeInt},
	"autopurge_trash":                 {kind: davpanelNonNegativeInt},
	"mysql_startup_time":              {kind: davpanelNonNegativeInt},
	"mysql_import_max_size_gb":        {kind: davpanelNonNegativeInt},
	"mysql_restricted_usernames":      {kind: davpanelSpaceSeparatedList},
	"mysql_restricted_databases":      {kind: davpanelSpaceSeparatedList},
	"mysql_enforce_username_prefix":   {kind: davpanelEnum, options: []string{"yes", "no"}},
	"applications_dashboard_items":    {kind: davpanelSpaceSeparatedList},
	"filemanager_buttons_style":       {kind: davpanelEnum, options: []string{"classic", "modern"}},
	"filemanager_files_per_page":      {kind: davpanelNonNegativeInt},
	"filemanager_edit_size":           {kind: davpanelNonNegativeInt},
	"filemanager_view_size":           {kind: davpanelNonNegativeInt},
	"filemanager_download_size":       {kind: davpanelNonNegativeInt},
	"filemanager_upload_size":         {kind: davpanelNonNegativeInt},
	"filemanager_compress_max_time":   {kind: davpanelNonNegativeInt},
	"filemanager_extract_max_time":    {kind: davpanelNonNegativeInt},
	"filemanager_download_max_time":   {kind: davpanelNonNegativeInt},
	"filemanager_edit_extensions":     {kind: davpanelSpaceSeparatedExtensions},
	"filemanager_image_extensions":    {kind: davpanelSpaceSeparatedExtensions},
	"filemanager_archives_extensions": {kind: davpanelSpaceSeparatedExtensions},
	"how_to_guides":                   {kind: davpanelEnum, options: []string{"yes", "no"}},
	"onboarding":                      {kind: davpanelEnum, options: []string{"yes", "no"}},
	"twofa_nag":                       {kind: davpanelEnum, options: []string{"yes", "no"}},
	"twofa_enforce":                   {kind: davpanelEnum, options: []string{"yes", "no"}},
	"found_a_bug_link":                {kind: davpanelEnum, options: []string{"yes", "no"}},
	"ip_county_flag":                  {kind: davpanelEnum, options: []string{"yes", "no"}},
	"validate_ip_address_cookie":      {kind: davpanelEnum, options: []string{"yes", "no"}},
	"password_reset":                  {kind: davpanelEnum, options: []string{"yes", "no"}},
	"password_strength":               {kind: davpanelOneToHundred},
	"permit_subdomain_sharing":        {kind: davpanelEnum, options: []string{"yes", "no"}},
	"permit_username_change_by_user":  {kind: davpanelEnum, options: []string{"yes", "no"}},
	"captcha_provider":                {kind: davpanelEnum, options: []string{"google", "turnstile", "custom", "none"}},
	"ai_provider":                     {kind: davpanelEnum, options: []string{"openrouter", "openai", "anthropic", "custom"}},
	"ai_monthly_limit":                {kind: davpanelNonNegativeInt},
	"ai_actions":                      {kind: davpanelEnum, options: []string{"off", "read", "all"}},
	"ai_max_tokens":                   {kind: davpanelOneToMax, options: []string{"64000"}},
	"ai_name":                         {kind: davpanelSingleLine},
	"ai_instructions":                 {kind: davpanelSingleLine},
	"ai_model":                        {kind: davpanelSingleLine},
	"ai_base_url":                     {kind: davpanelSingleLine},
	"ai_api_key":                      {kind: davpanelSingleLine},
}

var davpanelSpaceSeparatedListRe = regexp.MustCompile(`^[a-zA-Z0-9._-]+$`)

// validateDavpanelValue validates value against the rule registered for
// key. Returns the (possibly normalized) value to store and whether it
// passed; on failure the caller should append errMsg to the error list
// and leave the existing config value untouched.
func validateDavpanelValue(key, value string) (normalized string, ok bool, errMsg string) {
	rule, hasRule := davpanelValidValues[key]
	if !hasRule {
		return value, true, ""
	}

	switch rule.kind {
	case davpanelNonNegativeInt:
		n, err := strconv.Atoi(value)
		if err != nil || n < 0 {
			return "", false, fmt.Sprintf("Error: '%s' must be a non-negative integer for %s.", value, key)
		}
		return strconv.Itoa(n), true, ""

	case davpanelOneToHundred:
		n, err := strconv.Atoi(value)
		if err != nil || n < 1 || n > 100 {
			return "", false, fmt.Sprintf("Error: '%s' must be an integer between 1 and 100 for %s.", value, key)
		}
		return strconv.Itoa(n), true, ""

	case davpanelOneToMax:
		max, _ := strconv.Atoi(rule.options[0])
		n, err := strconv.Atoi(value)
		if err != nil || n < 1 || n > max {
			return "", false, fmt.Sprintf("Error: '%s' must be an integer between 1 and %d for %s.", value, max, key)
		}
		return strconv.Itoa(n), true, ""

	case davpanelSingleLine:
		// the config is key=value per line, a newline would break the file
		return strings.Join(strings.Fields(value), " "), true, ""

	case davpanelSpaceSeparatedList:
		items := strings.Fields(value)
		for _, item := range items {
			if !davpanelSpaceSeparatedListRe.MatchString(item) {
				return "", false, fmt.Sprintf("Error: '%s' must be a space-separated list of valid names for %s.", value, key)
			}
		}
		return strings.Join(items, " "), true, ""

	case davpanelSpaceSeparatedExtensions:
		extensions := strings.Fields(value)
		for _, ext := range extensions {
			if !davpanelSpaceSeparatedListRe.MatchString(ext) {
				return "", false, fmt.Sprintf("Error: '%s' must be space-separated valid file extensions for %s.", value, key)
			}
		}
		return strings.Join(extensions, " "), true, ""

	default: // enum
		for _, opt := range rule.options {
			if value == opt {
				return value, true, ""
			}
		}
		return "", false, fmt.Sprintf("Error: '%s' is not a valid value for %s.", value, key)
	}
}

// davpanelSectionForKey determines which ini section a given key
// belongs to.
func davpanelSectionForKey(key string) string {
	switch key {
	case "brand_name", "logo", "favicon", "ns1", "ns2", "ns3", "ns4", "logout_url":
		return "DEFAULT"
	}
	if strings.HasPrefix(key, "mysql_") {
		return "DATABASES"
	}
	if strings.HasPrefix(key, "filemanager_") || key == "autopurge_trash" {
		return "FILES"
	}
	if key == "terminal_timeout" || key == "menu_style" || key == "applications_dashboard_items" {
		return "PANEL"
	}
	switch key {
	case "captcha_provider", "recaptcha_site_key", "recaptcha_secret_key",
		"turnstile_site_key", "turnstile_secret_key", "custom_captcha_site_key":
		return "CAPTCHA"
	case "validate_ip_address_cookie":
		return "SECURITY"
	}
	if strings.HasPrefix(key, "ai_") {
		return "AI"
	}
	return "USERS"
}

// loadDavpanelConfigStripped is a separate ini parser used only for the
// final render, distinct from config.Load() (used for the POST-merge
// base above) -- config.Load() does NOT strip quotes from values, while
// this one does; the two parsing paths are intentionally different.
func loadDavpanelConfigStripped(path string) config.Data {
	data := config.Data{}
	raw, err := os.ReadFile(path)
	if err != nil {
		return data
	}
	section := ""
	for _, line := range strings.Split(string(raw), "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "[") {
			section = strings.Trim(line, "[]")
			continue
		}
		if line == "" || !strings.Contains(line, "=") || section == "" {
			continue
		}
		key, value, _ := strings.Cut(line, "=")
		if data[section] == nil {
			data[section] = map[string]string{}
		}
		data[section][key] = strings.Trim(strings.TrimSpace(value), `"`)
	}
	return data
}

// ServeDavpanelSettings handles GET/POST /settings/open-panel.
func (o *DavpanelSettings) ServeDavpanelSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		r.ParseForm()

		configData := config.Load(DavpanelSettingsConfigPath)
		var successMessages, errorMessages []string
		restartNeeded := false

		// The ~20 numeric fields. A missing or non-numeric value is
		// reported as a graceful validation error (existing config value
		// left untouched) rather than aborting the request; a
		// numeric-but-negative value is rejected the same way.
		for _, key := range davpanelIntFields {
			raw := r.PostFormValue(key)
			n, err := strconv.Atoi(raw)
			if err != nil {
				errorMessages = append(errorMessages, fmt.Sprintf("Error: '%s' must be a non-negative integer for %s.", raw, key))
				continue
			}
			if n < 0 {
				errorMessages = append(errorMessages, fmt.Sprintf("Error: '%d' must be a non-negative integer for %s.", n, key))
				continue
			}
			configData.Set(davpanelSectionForKey(key), key, strconv.Itoa(n))
		}

		// toggle always posts yes/no via a hidden input, so check the value not just presence
		weakpassValue := "no"
		if formHasKey(r, "weakpass") && r.PostFormValue("weakpass") != "no" {
			weakpassValue = "yes"
		}
		configData.Set(davpanelSectionForKey("weakpass"), "weakpass", weakpassValue)

		for _, key := range davpanelStringFields {
			if !formHasKey(r, key) {
				continue
			}
			raw := r.PostFormValue(key)
			value, ok, errMsg := validateDavpanelValue(key, raw)
			if !ok {
				errorMessages = append(errorMessages, errMsg)
				continue
			}
			// "none" is a UI-only choice for captcha_provider -- selecting it
			// stores an empty value rather than the literal string "none", so
			// downstream code that only checks "is this set" behaves as if no
			// provider were configured.
			if key == "captcha_provider" && value == "none" {
				value = ""
			}
			configData.Set(davpanelSectionForKey(key), key, value)
		}

		// Custom-code-backed fields shown on this page (see
		// davpanelFileFields): written to their own files rather than
		// davpanel.config. howto_guides additionally requires Enterprise
		// access, matching /settings/custom-code's gating.
		enterpriseOK := hasEnterpriseAccess(r, o.LicenseChecker)
		for _, key := range davpanelFileFields {
			if !formHasKey(r, key) {
				continue
			}
			if key == "howto_guides" && !enterpriseOK {
				continue
			}
			if err := os.WriteFile(customCodeFilePaths[key], []byte(r.PostFormValue(key)), 0644); err != nil {
				errorMessages = append(errorMessages, "Error saving configuration file.")
				continue
			}
			restartNeeded = true
		}

		// config.Save() fully regenerates the file from the parsed config
		// data (unquoted `key=value` lines, comments lost) rather than
		// patching individual lines in place. It adds a blank line between
		// sections; this is cosmetic and doesn't affect re-parsing, since
		// blank lines are skipped by every reader of this file.
		if err := config.Save(DavpanelSettingsConfigPath, configData); err != nil {
			errorMessages = append(errorMessages, "Error saving configuration file.")
		} else {
			restartNeeded = true
			successMessages = append(successMessages, "Configuration saved successfully.")
			// menu_style also switches DavAdmin's own menu, apply it right away
			SetMenuStyleFromConfig(DavpanelSettingsConfigPath)
		}

		if restartNeeded {
			os.WriteFile(DavpanelSettingsRestartFlagPath, []byte("Restart needed for DavPanel service."), 0644)
		}

		for _, m := range successMessages {
			auth.AddFlash(w, r, o.Sessions, m, "success")
		}
		for _, m := range errorMessages {
			auth.AddFlash(w, r, o.Sessions, m, "error")
		}
	}

	// Always a fresh disk re-read for the final render, ignoring whatever
	// was just computed above during POST.
	configData := loadDavpanelConfigStripped(DavpanelSettingsConfigPath)

	fileContents := make(map[string]string, len(davpanelFileFields))
	for _, key := range davpanelFileFields {
		content, err := readFileOrEmpty(customCodeFilePaths[key])
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		fileContents[key] = content
	}

	// the file manager works inside the davpanel container, so its size limits are compared to that container's RAM
	davpanelRAMGB := parseRAMLimitGB(readEnvGroups()["DAVPANEL"]["RAM"])

	webtemplates.Render(w, "settings_davpanel.html", mergeChrome(map[string]interface{}{
		"DNSModuleEnabled":   hasModule(modulesEnabledList(ModulesConfigFilePath), "dns"),
		"AIModuleEnabled":    hasModule(modulesEnabledList(ModulesConfigFilePath), "ai_assistant"),
		"AIUsage":            loadAIUsage(),
		"SMTPConfigured":     strings.TrimSpace(config.Load(config.DavpanelConfigPath).Get("SMTP", "mail_server", "")) != "",
		"DavpanelRAMMB":     int(davpanelRAMGB * 1024),
		"DavpanelRAM":       formatLimit(davpanelRAMGB) + " GB",
		"MySQLCustomVersion": mysqlCustomVersion(),
		"SiteCount":          totalSites(defaultsSiteTypesRun(o.MySQL)),
		"ConfigData":         configData,
		"CSRFToken":          csrf.Token(r),
		"Flashes":            auth.PopFlashes(w, r, o.Sessions),
		"HasEnterprise":      hasEnterpriseAccess(r, o.LicenseChecker),
		"HowtoGuides":        fileContents["howto_guides"],
		"ForbiddenUsers":     fileContents["forbidden_usernames"],
		"RestrictedDomains":  fileContents["restricted_domains"],
		"PagespeedAPIKey":    fileContents["pagespeed_api_key"],
	}, r, "DavPanel Settings"))
}

// mysqlCustomVersion is the MYSQL_VERSION tag new users get when it isn't latest, the first start has to pull that image
func mysqlCustomVersion() string {
	raw, err := os.ReadFile(DefaultsEnvPath)
	if err != nil {
		return ""
	}
	for _, line := range strings.Split(string(raw), "\n") {
		k, v, ok := strings.Cut(strings.TrimSpace(line), "=")
		if !ok || strings.TrimSpace(k) != "MYSQL_VERSION" {
			continue
		}
		v = strings.Trim(strings.TrimSpace(v), `"'`)
		if v == "" || v == "latest" {
			return ""
		}
		return v
	}
	return ""
}
