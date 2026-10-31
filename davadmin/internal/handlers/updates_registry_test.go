package handlers

import (
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

func TestGitHubReleaseTagsExcludeDraftsAndPrereleases(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, `[{"tag_name":"v2.0.19"},{"tag_name":"v2.0.20","draft":true},{"tag_name":"v2.1.0-beta","prerelease":true},{"tag_name":"invalid"}]`)
	}))
	defer srv.Close()
	tags, err := fetchGitHubReleaseTags(srv.URL)
	if err != nil || !reflect.DeepEqual(tags, []string{"2.0.19"}) {
		t.Fatalf("tags=%v err=%v", tags, err)
	}
}

func TestGitHubReleaseFailureDoesNotInventARelease(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusForbidden) }))
	defer srv.Close()
	if tags, err := fetchGitHubReleaseTags(srv.URL); err == nil || len(tags) != 0 {
		t.Fatalf("expected release API error, tags=%v err=%v", tags, err)
	}
}
