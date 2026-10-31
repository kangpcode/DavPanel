package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/pquerna/otp/totp"

	"github.com/kangpcode/davadmin/internal/auth"
)

func newAPILoginTestServer(t *testing.T) (*APILogin, *httptest.Server, *http.Client) {
	t.Helper()
	db := newAPITestDB(t)
	hash, err := auth.GeneratePasswordHash("correct-password")
	if err != nil {
		t.Fatal(err)
	}
	if err := db.CreateUser("alice", hash, "admin"); err != nil {
		t.Fatal(err)
	}

	a := &APILogin{DB: db, Sessions: auth.NewManager("test-secret", false), Limiter: auth.NewPerIPLimiter(1000, 1000)}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/login", a.HandleAPILogin)
	mux.HandleFunc("GET /login/sso/{token}", a.HandleSSOLogin)
	srv := httptest.NewServer(mux)
	t.Cleanup(srv.Close)

	jar, err := cookiejar.New(nil)
	if err != nil {
		t.Fatal(err)
	}
	return a, srv, &http.Client{Jar: jar, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
}

func TestAPILoginWrongPasswordReturns401(t *testing.T) {
	_, srv, client := newAPILoginTestServer(t)
	resp, err := client.Post(srv.URL+"/api/login", "application/json", strings.NewReader(`{"username":"alice","password":"wrong"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestAPILoginValidCredentialsIssuesRedeemableToken(t *testing.T) {
	_, srv, client := newAPILoginTestServer(t)

	resp, err := client.Post(srv.URL+"/api/login", "application/json", strings.NewReader(`{"username":"alice","password":"correct-password"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
	var body map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&body)
	token, _ := body["token"].(string)
	if token == "" {
		t.Fatalf("expected a token, got %v", body)
	}

	redeem, err := client.Get(srv.URL + "/login/sso/" + token)
	if err != nil {
		t.Fatal(err)
	}
	defer redeem.Body.Close()
	if redeem.StatusCode != http.StatusSeeOther {
		t.Fatalf("expected 303 redirect, got %d", redeem.StatusCode)
	}
	if loc := redeem.Header.Get("Location"); loc != "/dashboard" {
		t.Fatalf("expected redirect to /dashboard, got %q", loc)
	}
	var sawSessionCookie bool
	for _, c := range redeem.Cookies() {
		if c.Name == auth.SessionCookieName {
			sawSessionCookie = true
		}
	}
	if !sawSessionCookie {
		t.Fatalf("expected session cookie to be set after SSO redemption")
	}

	// The token is single-use: redeeming it again must fail.
	replay, err := client.Get(srv.URL + "/login/sso/" + token)
	if err != nil {
		t.Fatal(err)
	}
	defer replay.Body.Close()
	if replay.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected replay to be rejected with 401, got %d", replay.StatusCode)
	}
}

func TestSSOLoginUnknownTokenReturns401(t *testing.T) {
	_, srv, client := newAPILoginTestServer(t)
	resp, err := client.Get(srv.URL + "/login/sso/does-not-exist")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
}

func TestAPILoginRequiresTOTPBeforeIssuingBrowserSession(t *testing.T) {
	a, srv, client := newAPILoginTestServer(t)
	const secret = "JBSWY3DPEHPK3PXP"
	if err := a.DB.SetTOTP("alice", secret, true); err != nil {
		t.Fatal(err)
	}
	for _, code := range []string{"", "not-a-code"} {
		payload, _ := json.Marshal(map[string]string{"username": "alice", "password": "correct-password", "totp_code": code})
		resp, err := client.Post(srv.URL+"/api/login", "application/json", strings.NewReader(string(payload)))
		if err != nil {
			t.Fatal(err)
		}
		var body struct {
			Required bool   `json:"twofa_required"`
			Token    string `json:"token"`
		}
		json.NewDecoder(resp.Body).Decode(&body)
		resp.Body.Close()
		if resp.StatusCode != http.StatusUnauthorized || !body.Required || body.Token != "" {
			t.Fatalf("missing/invalid TOTP issued credentials: status=%d body=%+v", resp.StatusCode, body)
		}
	}
	code, err := totp.GenerateCode(secret, time.Now())
	if err != nil {
		t.Fatal(err)
	}
	payload, _ := json.Marshal(map[string]string{"username": "alice", "password": "correct-password", "totp_code": code})
	resp, err := client.Post(srv.URL+"/api/login", "application/json", strings.NewReader(string(payload)))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	var body struct {
		Token string `json:"token"`
	}
	json.NewDecoder(resp.Body).Decode(&body)
	if resp.StatusCode != http.StatusOK || body.Token == "" {
		t.Fatalf("valid TOTP rejected: status=%d", resp.StatusCode)
	}
	redeem, err := client.Get(srv.URL + "/login/sso/" + body.Token)
	if err != nil {
		t.Fatal(err)
	}
	defer redeem.Body.Close()
	if redeem.StatusCode != http.StatusSeeOther {
		t.Fatalf("verified SSO rejected: %d", redeem.StatusCode)
	}
}

func TestSSOTokenCannotBypassNewlyEnabledTOTP(t *testing.T) {
	a, srv, client := newAPILoginTestServer(t)
	resp, err := client.Post(srv.URL+"/api/login", "application/json", strings.NewReader(`{"username":"alice","password":"correct-password"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	var body struct {
		Token string `json:"token"`
	}
	json.NewDecoder(resp.Body).Decode(&body)
	if body.Token == "" {
		t.Fatal("expected a token before enabling TOTP")
	}
	if err := a.DB.SetTOTP("alice", "JBSWY3DPEHPK3PXP", true); err != nil {
		t.Fatal(err)
	}
	redeem, err := client.Get(srv.URL + "/login/sso/" + body.Token)
	if err != nil {
		t.Fatal(err)
	}
	defer redeem.Body.Close()
	if redeem.StatusCode != http.StatusUnauthorized {
		t.Fatalf("stale SSO bypassed TOTP: %d", redeem.StatusCode)
	}
	for _, cookie := range redeem.Cookies() {
		if cookie.Name == auth.SessionCookieName {
			t.Fatal("stale SSO issued a session cookie")
		}
	}
}
