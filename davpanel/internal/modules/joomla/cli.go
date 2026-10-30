package joomla

import (
	"net/http"
	"strconv"
	"strings"

	appctx "github.com/kangpcode/davpanel/internal/app"
	"github.com/kangpcode/davpanel/internal/auth"
	"github.com/kangpcode/davpanel/internal/core/appkit"
	"github.com/kangpcode/davpanel/internal/core/logger"
	"github.com/kangpcode/davpanel/internal/core/mysqlmanager"
	"github.com/kangpcode/davpanel/internal/core/podmanmanager"
	"github.com/kangpcode/davpanel/internal/core/reqip"
	"github.com/kangpcode/davpanel/internal/modules/cmsapp"
	"github.com/kangpcode/davpanel/internal/web"
)

// handleJoomlaCacheClean runs `cli/joomla.php cache:clean` - Joomla's own system cache flush command
func handleJoomlaCacheClean(a *appctx.App, w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID, currentUsername, userContext, err := auth.Injected(a, r)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	domain, docroot, phpContainer, ok := cmsapp.RequestParams(ctx, a, r, userID, userContext)
	if !ok {
		web.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "domain and docroot are required, or you do not own this domain"})
		return
	}

	argv := append(podmanmanager.PodmanArgv(userContext, "exec", phpContainer, "php"),
		docroot+"/cli/joomla.php", "cache:clean", "-n")
	out, runErr := podmanmanager.Command(ctx, userContext, argv).CombinedOutput()
	if runErr != nil {
		web.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "cli/joomla.php cache:clean failed", "details": strings.TrimSpace(string(out))})
		return
	}

	_ = logger.RecordUserAction(a.Config, currentUsername, "cleared Joomla cache for "+domain, reqip.ClientIP(r))
	web.WriteJSON(w, http.StatusOK, map[string]string{"message": "Cache cleared successfully."})
}

// handleJoomlaLogin generates a one-time admin login link - unlike Drupal's drush user:login, Joomla core ships no CLI command for this, so this mirrors WordPress's approach instead: a small token table (created here lazily, isolated from Joomla's own schema) plus a login helper PHP file deployed into the docroot at install time (see davpanel-login.php below) that verifies the token then binds an admin User to the Joomla session through the CMS's own Session/User APIs
func handleJoomlaLogin(a *appctx.App, w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID, currentUsername, userContext, err := auth.Injected(a, r)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	domain := r.URL.Query().Get("domain")
	docroot := r.URL.Query().Get("docroot")
	if domain == "" || docroot == "" {
		web.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "domain and docroot are required"})
		return
	}
	mainDomain := domain
	if idx := strings.Index(domain, "/"); idx != -1 {
		mainDomain = domain[:idx]
	}
	if !a.CheckDomainBelongsToUser(ctx, userID, mainDomain) {
		http.Error(w, "You do not own this domain.", http.StatusForbidden)
		return
	}

	dbInfo := extractJoomlaDatabaseInfoForLogin(userContext, docroot)
	if dbInfo["error"] != "" {
		web.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": dbInfo["error"]})
		return
	}
	dbName := dbInfo["database_name"]
	prefix := dbInfo["database_prefix"]

	_, _ = mysqlmanager.Exec(ctx, userContext,
		"CREATE TABLE IF NOT EXISTS `"+prefix+"davpanel_login_tokens` ("+
			"token_hash CHAR(64) PRIMARY KEY, user_id INT UNSIGNED NOT NULL, expires INT UNSIGNED NOT NULL)", dbName)

	rows, queryErr := mysqlmanager.Exec(ctx, userContext,
		"SELECT u.id FROM `"+prefix+"users` u "+
			"JOIN `"+prefix+"user_usergroup_map` m ON m.user_id = u.id "+
			"WHERE u.block = 0 AND m.group_id = 8 LIMIT 1", dbName)
	if queryErr != nil || len(rows) == 0 {
		web.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "No active Super User account found"})
		return
	}
	userIDStr := mysqlmanager.ToString(rows[0][0])

	token := appkit.RandomString(32)
	tokenHash := appkit.SHA256Hex(token)
	const ttlSeconds = 600
	_, insErr := mysqlmanager.Exec(ctx, userContext,
		"INSERT INTO `"+prefix+"davpanel_login_tokens` (token_hash, user_id, expires) VALUES ('"+
			tokenHash+"', "+userIDStr+", UNIX_TIMESTAMP() + "+strconv.Itoa(ttlSeconds)+")", dbName)
	if insErr != nil {
		web.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "Unable to create login link", "details": insErr.Error()})
		return
	}

	loginLink := "https://" + domain + "/" + davpanelLoginFileName + "?op_login=" + token
	maskedLink := loginLink
	if len(loginLink) > 10 {
		maskedLink = loginLink[:len(loginLink)-10] + "*****"
	}
	_ = logger.RecordUserAction(a.Config, currentUsername, "generated auto-login link for Joomla admin: "+maskedLink, reqip.ClientIP(r))
	web.WriteJSON(w, http.StatusOK, map[string]string{"login_link": loginLink})
}
