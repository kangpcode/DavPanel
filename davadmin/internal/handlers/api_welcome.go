// This file implements the two entry-point routes of the JSON REST API:
// GET/POST /api/ (a health check on GET, a JWT login on POST) and
// GET /api/whoami (returns the identity embedded in the caller's token).
package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/kangpcode/davadmin/internal/admindb"
	"github.com/kangpcode/davadmin/internal/auth"
)

// APIWelcome bundles the /api/ and /api/whoami handlers.
type APIWelcome struct {
	DB        *admindb.DB
	SecretKey string
	Limiter   *auth.PerIPLimiter
}

// ServeWelcome handles GET/POST /api/.
func (a *APIWelcome) ServeWelcome(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		writeJSON(w, map[string]string{"message": "API is working!"})
		return
	}

	if !a.Limiter.Allow(clientIP(r)) {
		writeJSONError(w, http.StatusTooManyRequests, "Too many login attempts. Please try again later.")
		return
	}

	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
		TOTPCode string `json:"totp_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	user, err := a.DB.UserByUsername(body.Username)
	if err != nil || !auth.CheckPasswordHash(user.PasswordHash, body.Password) {
		writeJSONError(w, http.StatusUnauthorized, "Invalid credentials")
		return
	}
	if !user.IsActive {
		writeJSONError(w, http.StatusForbidden, "User is not active")
		return
	}
	if !requireAPISecondFactor(w, user, body.TOTPCode) {
		return
	}

	token, err := createAPIToken(user.Username, a.SecretKey)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Could not issue token")
		return
	}
	writeJSON(w, map[string]string{"access_token": token})
}

// ServeWhoami reports the active account resolved by RequireAPIToken.
func (a *APIWelcome) ServeWhoami(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{"logged_in_as": APIUsernameFromContext(r)})
}
