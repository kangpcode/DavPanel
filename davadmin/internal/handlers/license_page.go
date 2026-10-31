// This file implements the /license admin page and its key/info/verify/
// delete davcli wrappers, plus /support/report.
package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/csrf"

	"github.com/kangpcode/davadmin/internal/auth"
	"github.com/kangpcode/davadmin/internal/webtemplates"
)

// LicensePage bundles the /license*, /support/report handlers. Named
// LicensePage (not License) to avoid colliding with internal/license's
// Checker-based feature-gating type used elsewhere in this package.
type LicensePage struct {
	Sessions *auth.Manager
}

// licenseRunDavCLI is injectable so tests never shell out to a real
// davcli binary, matching runDavCLICaptured's usage elsewhere.
var licenseRunDavCLI = func(args ...string) (stdout, stderr string, err error) {
	return runDavCLICaptured(args...)
}

// licenseKeyFromOutput reads `davcli license key --json`, which prints
// {"key": "..."} or {"key": null}. Older davcli printed the bare key or
// "No License Key", so those are still accepted.
func licenseKeyFromOutput(stdout string) string {
	out := strings.TrimSpace(stdout)
	var parsed struct {
		Key *string `json:"key"`
	}
	if json.Unmarshal([]byte(out), &parsed) == nil {
		if parsed.Key == nil {
			return ""
		}
		return *parsed.Key
	}
	if out == "No License Key" {
		return ""
	}
	return out
}

// ServeLicense handles GET /license.
func (l *LicensePage) ServeLicense(w http.ResponseWriter, r *http.Request) {
	stdout, _, err := licenseRunDavCLI("davcli", "license", "key", "--json")
	var key interface{}
	if err == nil {
		key = licenseKeyFromOutput(stdout)
	}

	if r.URL.Query().Get("output") == "json" {
		writeJSON(w, map[string]interface{}{"key": key})
		return
	}

	webtemplates.Render(w, "settings_license.html", mergeChrome(map[string]interface{}{
		"Key":       key,
		"CSRFToken": csrf.Token(r),
		"Flashes":   auth.PopFlashes(w, r, l.Sessions),
	}, r, "License"))
}

// ServeLicenseKey handles GET/POST /license/key.
func (l *LicensePage) ServeLicenseKey(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		stdout, _, err := licenseRunDavCLI("davcli", "license", "key", "--json")
		if err != nil {
			writeJSONError(w, http.StatusInternalServerError, "Failed to read license key")
			return
		}
		writeJSON(w, map[string]string{"key": licenseKeyFromOutput(stdout)})

	case http.MethodPost:
		var body map[string]string
		json.NewDecoder(r.Body).Decode(&body)
		key := body["key"]
		if key == "" {
			writeJSONError(w, http.StatusBadRequest, "Missing key in request")
			return
		}
		stdout, _, err := licenseRunDavCLI("davcli", "license", key, "--json", "--no-restart")
		if err != nil {
			writeJSONError(w, http.StatusInternalServerError, "License key validation failed")
			return
		}
		writeJSON(w, map[string]string{"response": strings.TrimSpace(stdout)})
	}
}

// ServeLicenseInfo handles GET /license/info.
func (l *LicensePage) ServeLicenseInfo(w http.ResponseWriter, r *http.Request) {
	stdout, _, err := licenseRunDavCLI("davcli", "license", "info", "--json")
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to retrieve license info")
		return
	}
	writeJSON(w, map[string]string{"info": strings.TrimSpace(stdout)})
}

// ServeLicenseVerify handles POST /license/verify.
func (l *LicensePage) ServeLicenseVerify(w http.ResponseWriter, r *http.Request) {
	stdout, _, err := licenseRunDavCLI("davcli", "license", "verify", "--json")
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to verify license")
		return
	}
	writeJSON(w, map[string]string{"verify": strings.TrimSpace(stdout)})
}

// ServeLicenseDelete handles DELETE /license/delete.
func (l *LicensePage) ServeLicenseDelete(w http.ResponseWriter, r *http.Request) {
	stdout, _, err := licenseRunDavCLI("davcli", "license", "delete", "--json")
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Failed to delete license")
		return
	}
	writeJSON(w, map[string]string{"delete": strings.TrimSpace(stdout)})
}

// ServeSupportReport handles GET /support/report.
func (l *LicensePage) ServeSupportReport(w http.ResponseWriter, r *http.Request) {
	stdout, _, err := licenseRunDavCLI("davcli", "report", "--public", "--non-interactive")
	if err != nil {
		auth.AddFlash(w, r, l.Sessions, "Generating report failed. Please try running from the terminal: 'davcli report --public --non-interactive'.", "error")
		http.Redirect(w, r, "/license", http.StatusSeeOther)
		return
	}

	result := strings.TrimSpace(stdout)
	if r.URL.Query().Get("output") == "json" {
		writeJSON(w, map[string]interface{}{"success": true, "message": result})
		return
	}

	auth.AddFlash(w, r, l.Sessions, result, "info")
	http.Redirect(w, r, "/license", http.StatusSeeOther)
}
