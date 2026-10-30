package processmanager

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	appctx "github.com/kangpcode/davpanel/internal/app"
	"github.com/kangpcode/davpanel/internal/auth"
	"github.com/kangpcode/davpanel/internal/core/flash"
	"github.com/kangpcode/davpanel/internal/core/logger"
	"github.com/kangpcode/davpanel/internal/core/podmanmanager"
	"github.com/kangpcode/davpanel/internal/core/reqip"
	"github.com/kangpcode/davpanel/internal/core/session"
	"github.com/kangpcode/davpanel/internal/web"
)

type killRequest struct {
	PIDToKill string `json:"pid_to_kill"`
	Container string `json:"container"`
}

// handleProcessManager serves the process manager page - GET lists (or, with ?output=json, dumps) every process running across the user's containers; POST terminates one
func handleProcessManager(a *appctx.App, w http.ResponseWriter, r *http.Request) {
	_, username, userContext, err := auth.Injected(a, r)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	processes, procErr := getPodmanProcesses(r.Context(), userContext)
	valid := make(map[string]bool, len(processes))
	for _, p := range processes {
		valid[processKey(p.Container, p.PID)] = true
	}
	if procErr != nil {
		sess, _ := a.Sessions.Get(r, session.CookieName)
		flash.Add(sess, "error", procErr.Error())
		_ = a.Sessions.Save(r, w, sess)
		processes = nil
	}

	if r.Method == http.MethodPost {
		var payload killRequest
		_ = json.NewDecoder(r.Body).Decode(&payload)

		if payload.PIDToKill == "" || payload.Container == "" {
			web.WriteJSON(w, http.StatusOK, map[string]any{"success": false, "error_message": "No PID provided"})
			return
		}

		if !valid[processKey(payload.Container, payload.PIDToKill)] {
			web.WriteJSON(w, http.StatusOK, map[string]any{"success": false, "error_message": "PID not found or not allowed"})
			return
		}

		pidInt, atoiErr := strconv.Atoi(payload.PIDToKill)
		if atoiErr != nil || pidInt <= 0 {
			web.WriteJSON(w, http.StatusOK, map[string]any{"success": false, "error_message": "Invalid PID"})
			return
		}

		argv := podmanmanager.PodmanArgv(userContext, "exec", "--user", "root", payload.Container, "kill", "-9", strconv.Itoa(pidInt))
		cmd := podmanmanager.Command(r.Context(), userContext, argv)
		var stderr bytes.Buffer
		cmd.Stderr = &stderr
		if runErr := cmd.Run(); runErr != nil {
			web.WriteJSON(w, http.StatusOK, map[string]any{"success": false, "error_message": stderr.String()})
			return
		}

		_ = logger.RecordUserAction(a.Config, username,
			fmt.Sprintf("terminated process %d in container %s using Process Manager", pidInt, payload.Container),
			reqip.ClientIP(r))
		web.WriteJSON(w, http.StatusOK, map[string]any{"success": true, "message": "Process killed successfully"})
		return
	}

	if r.URL.Query().Get("output") == "json" {
		web.WriteJSON(w, http.StatusOK, processes)
		return
	}

	renderProcessManagerPage(a, w, r, filterDisplayable(processes))
}

// filterDisplayable drops entrypoint/healthcheck noise rows before rendering the table
func filterDisplayable(processes []Process) []Process {
	var out []Process
	for _, p := range processes {
		if isDisplayableCmd(p.CMD) {
			out = append(out, p)
		}
	}
	return out
}
