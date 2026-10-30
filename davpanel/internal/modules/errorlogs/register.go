package errorlogs

import (
	"net/http"

	appctx "github.com/kangpcode/davpanel/internal/app"
	"github.com/kangpcode/davpanel/internal/auth"
	"github.com/kangpcode/davpanel/internal/core/apiregistry"
)

// Register wires the error logs page onto mux.
func Register(mux *http.ServeMux, a *appctx.App) {
	mux.Handle("GET /error-logs", auth.RequireLogin(a, "error_logs")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { handlePage(a, w, r) })))
}

// RegisterAPI wires the error logs API route onto mux.
func RegisterAPI(mux *http.ServeMux, a *appctx.App) {
	apiregistry.Handle(mux, a, "error_logs", "GET /api/error-logs", func(w http.ResponseWriter, r *http.Request) { handleAPI(a, w, r) })
}
