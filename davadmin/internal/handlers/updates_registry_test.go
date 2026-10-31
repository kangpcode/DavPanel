package handlers

import (
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

func TestRegistryTagsAuthenticateBeforeListing(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/token":
			if r.URL.Query().Get("scope") != "repository:kangpcode/davpanel:pull" {
				t.Errorf("unexpected scope: %s", r.URL.RawQuery)
			}
			io.WriteString(w, `{"token":"fixture-token"}`)
		case "/v2/kangpcode/davpanel/tags/list":
			if r.Header.Get("Authorization") != "Bearer fixture-token" {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			io.WriteString(w, `{"tags":["2.0.19","latest"]}`)
		default:
			http.NotFound(w, r)
		}
	}))
	defer srv.Close()
	tags, err := fetchRegistryTags(srv.URL, "kangpcode/davpanel")
	if err != nil || !reflect.DeepEqual(tags, []string{"2.0.19", "latest"}) {
		t.Fatalf("tags=%v err=%v", tags, err)
	}
}

func TestRegistryFailureDoesNotInventARelease(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
	}))
	defer srv.Close()
	if tags, err := fetchRegistryTags(srv.URL, "kangpcode/davpanel"); err == nil || len(tags) != 0 {
		t.Fatalf("expected an explicit registry error, tags=%v err=%v", tags, err)
	}
}
