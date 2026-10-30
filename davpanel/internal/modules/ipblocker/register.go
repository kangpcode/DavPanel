package ipblocker

import (
	"net/http"

	appctx "github.com/kangpcode/davpanel/internal/app"
	"github.com/kangpcode/davpanel/internal/auth"
)

// Register wires the ip-blocker route onto mux.
func Register(mux *http.ServeMux, a *appctx.App) {
	requireLogin := func(h http.HandlerFunc) http.Handler {
		return auth.RequireLogin(a, "ip_blocker")(h)
	}
	mux.Handle("/security/ip-blocker", requireLogin(func(w http.ResponseWriter, r *http.Request) { handleIPBlocker(a, w, r) }))
}
