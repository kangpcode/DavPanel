// This file implements the domain/port/proxy/dev-mode general settings
// page.
package handlers

import (
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"

	"github.com/kangpcode/davadmin/internal/auth"
	"github.com/kangpcode/davadmin/internal/webtemplates"
)

// General bundles the /settings/general handler.
type General struct {
	Sessions *auth.Manager
	// DevMode is read from davpanel.config once at process startup (see
	// bootstrap.IsDevMode() in main.go) and never re-read afterwards. This
	// preserves a real (and, per the template's own on-page note,
	// *intentional*) quirk: after this page's dev-mode toggle writes the
	// new value via `davcli config update dev_mode ...`, both the page
	// and the POST-comparison logic keep using the OLD value until
	// DavAdmin actually restarts (which the restart-flag mechanism
	// requests but doesn't perform inline).
	DevMode bool
}

var generalPortRe = regexp.MustCompile(`^[0-9]{1,5}$`)

// generalDavpanelPortRun/generalDavadminPortRun/generalAdminDomainRun/
// generalDavpanelProxyRun are always queried fresh (no caching).
// Injectable so tests never shell out to a real davcli binary.
var (
	generalDavpanelPortRun = func() (string, error) {
		out, err := exec.Command("davcli", "port").Output()
		return strings.TrimSpace(string(out)), err
	}
	generalDavadminPortRun = func() (string, error) {
		out, err := exec.Command("davcli", "admin", "port").Output()
		return strings.TrimSpace(string(out)), err
	}
	generalAdminDomainRun = func() (string, error) {
		out, err := exec.Command("davcli", "domain").Output()
		return strings.TrimSpace(string(out)), err
	}
	generalDavpanelProxyRun = func() (string, error) {
		out, err := exec.Command("davcli", "proxy").Output()
		return strings.TrimSpace(string(out)), err
	}
	generalHostnameRun = func() (string, error) {
		out, err := exec.Command("hostname").Output()
		return strings.TrimSpace(string(out)), err
	}

	generalSetDavpanelPortRun = func(port string) { _ = exec.Command("davcli", "port", "set", port, "--no-restart").Run() }
	generalSetDomainRun        = func(domain string) { _ = exec.Command("davcli", "domain", "set", domain, "--no-restart").Run() }
	generalSetDevModeRun       = func(value string) { _ = exec.Command("davcli", "config", "update", "dev_mode", value).Run() }
	generalSetAdminPortRun     = func(port string) { _ = exec.Command("davcli", "admin", "port", port, "--no-restart").Run() }
	generalSetProxyRun         = func(proxy string) { _ = exec.Command("davcli", "proxy", "set", proxy, "--no-restart").Run() }
)

// GeneralDavpanelRestartFlagPath / GeneralDavadminRestartFlagPath are
// test seams for the two hardcoded restart-flag paths.
var (
	GeneralDavpanelRestartFlagPath = "/root/davpanel_restart_needed"
	GeneralDavadminRestartFlagPath = "/root/davadmin_restart_needed"
)

func generalValidatedPort(raw string, err error, fallback string) string {
	if err != nil || !generalPortRe.MatchString(raw) {
		return fallback
	}
	n, convErr := strconv.Atoi(raw)
	if convErr != nil || n < 0 || n > 65535 {
		return fallback
	}
	return raw
}

func generalDavpanelPort() string {
	raw, err := generalDavpanelPortRun()
	return generalValidatedPort(raw, err, "2083")
}

func generalDavadminPort() string {
	raw, err := generalDavadminPortRun()
	return generalValidatedPort(raw, err, "2087")
}

func generalAdminDomain() string {
	raw, err := generalAdminDomainRun()
	if err != nil {
		return ""
	}
	return raw
}

func generalDavpanelProxy() string {
	raw, err := generalDavpanelProxyRun()
	if err != nil {
		return "davpanel"
	}
	return raw
}

func generalHostname() string {
	if h, err := os.Hostname(); err == nil && h != "" {
		return h
	}
	h, _ := generalHostnameRun()
	return h
}

// generalSSLStatus reports the current SSL setting ("autossl"/"custom
// ssl"/"") for the panel's own domain, for the new SSL section on this
// page. Mirrors ServeSSL's own status resolution (domains_ssl.go/
// domains_ssl_caddyfile.go): davcli for a domain it manages, the main
// Caddyfile's own `tls` directive for one it doesn't (e.g. this domain,
// which is configured directly in the Caddyfile rather than as a
// per-user domain).
func generalSSLStatus(domain string) string {
	if domain == "" || !isDomain(domain) {
		return ""
	}
	if domainConfMissingOrEmpty(domain) {
		setting, _, found := caddyfileDomainSSLInfo(domain)
		if !found {
			return ""
		}
		return setting
	}
	stdout, _, exitCode, err := davcliSSLRun(domain, "status")
	if err != nil || exitCode != 0 {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(stdout))
}

// ServeGeneral handles GET/POST /settings/general.
func (g *General) ServeGeneral(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		r.ParseForm()

		var changes []string
		davpanelRestartNeeded := false
		davadminRestartNeeded := false

		forceDomain := r.PostFormValue("force_domain")
		adminPortValue := r.PostFormValue("2087_port")
		davpanelPortValue := r.PostFormValue("2083_port")
		davpanelProxy := r.PostFormValue("davpanel_proxy")

		adminPort := 2087
		if adminPortValue != "" {
			if n, err := strconv.Atoi(adminPortValue); err == nil {
				adminPort = n
			}
		}
		davpanelPort := 2083
		if davpanelPortValue != "" {
			if n, err := strconv.Atoi(davpanelPortValue); err == nil {
				davpanelPort = n
			}
		}

		forceDomainCurrentValue := generalAdminDomain()
		davpanelPortCurrentValue, _ := strconv.Atoi(generalDavpanelPort())

		if davpanelPort != davpanelPortCurrentValue {
			generalSetDavpanelPortRun(strconv.Itoa(davpanelPort))
			changes = append(changes, "user-panel port")
			davpanelRestartNeeded = true
		}

		if forceDomain != "" && forceDomainCurrentValue != forceDomain {
			generalSetDomainRun(forceDomain)
			changes = append(changes, "domain")
			davpanelRestartNeeded = true
			davadminRestartNeeded = true
		}

		devModeNewValue := r.PostFormValue("dev_mode")
		devModeCurrent := "off"
		if g.DevMode {
			devModeCurrent = "on"
		}
		if (devModeCurrent == "on" && devModeNewValue == "off") || (devModeCurrent == "off" && devModeNewValue == "on") {
			generalSetDevModeRun(devModeNewValue)
			changes = append(changes, "dev_mode")
			davpanelRestartNeeded = true
			davadminRestartNeeded = true
		}

		davadminPortCurrentValue, _ := strconv.Atoi(generalDavadminPort())
		if adminPort != davadminPortCurrentValue {
			generalSetAdminPortRun(strconv.Itoa(adminPort))
			changes = append(changes, "admin-panel port")
			davadminRestartNeeded = true
		}

		// Only acts (and only reports/restarts) when the value actually
		// changed, rather than unconditionally re-running "davcli proxy
		// set" and forcing a restart on every POST even when nothing
		// changed.
		newProxy := davpanelProxy
		if newProxy == "" {
			newProxy = "davpanel"
		}
		if newProxy != generalDavpanelProxy() {
			generalSetProxyRun(newProxy)
			changes = append(changes, "proxy")
			davadminRestartNeeded = true
		}

		if davpanelRestartNeeded {
			os.WriteFile(GeneralDavpanelRestartFlagPath, []byte("Restart needed"), 0644)
		}
		if davadminRestartNeeded {
			os.WriteFile(GeneralDavadminRestartFlagPath, []byte("Restart needed"), 0644)
		}

		if len(changes) > 0 {
			auth.AddFlash(w, r, g.Sessions, "Settings updated: "+strings.Join(changes, ", "), "success")
		} else {
			auth.AddFlash(w, r, g.Sessions, "No changes made.", "info")
		}
	}

	// The template gets the raw "on"/"off" string (not a JSON/template
	// boolean) -- it does its own conversion to a 'true'/'false' string
	// for the Alpine.js toggle.
	devModeStr := "off"
	if g.DevMode {
		devModeStr = "on"
	}

	forceDomain := generalAdminDomain()
	data := map[string]interface{}{
		"ServerHostname":      generalHostname(),
		"Port":                generalDavpanelPort(),
		"AdminPort":           generalDavadminPort(),
		"Proxy":               generalDavpanelProxy(),
		"ForceDomain":         forceDomain,
		"ForceDomainIsDomain": isDomain(forceDomain),
		"SSLCurrentSetting":   generalSSLStatus(forceDomain),
		"DevMode":             devModeStr,
	}

	if r.URL.Query().Get("output") == "json" {
		writeJSON(w, data)
		return
	}

	data["Flashes"] = auth.PopFlashes(w, r, g.Sessions)
	merged := mergeChrome(data, r, "General Settings")
	// mergeChrome's own DevMode (the site-wide dev-mode bool) would
	// otherwise clobber this page's "on"/"off" setting value above.
	merged["DevMode"] = devModeStr
	webtemplates.Render(w, "settings_general.html", merged)
}
