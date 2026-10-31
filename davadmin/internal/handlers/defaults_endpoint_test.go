package handlers

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDefaultsMetadataUsesConfiguredEndpointAndSurvivesOutage(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, `{"data":{"8.4":{"isLatestVersion":true}}}`)
	}))
	t.Setenv("DAVPANEL_PHP_VERSIONS_API", srv.URL)
	data, err := fetchDefaultsPHPWatch()
	if err != nil || !data["8.4"].IsLatestVersion {
		t.Fatalf("configured metadata endpoint was not used: data=%v err=%v", data, err)
	}
	srv.Close()
	data, err = fetchDefaultsPHPWatch()
	if err != nil || len(data) != 0 {
		t.Fatalf("metadata outage should leave service defaults usable: data=%v err=%v", data, err)
	}
}
