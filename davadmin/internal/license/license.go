// Package license implements Enterprise license detection and remote
// validation (startup check, periodic recheck, backoff-aware recheck
// interval) so Enterprise-only features can be gated behind an
// actually-valid license rather than just the presence of a key-shaped
// string.
package license

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

const (
	GracePeriod     = 24 * time.Hour
	RecheckInterval = 6 * time.Hour
	FailureFloor    = 24 * time.Hour
	requestTimeout  = 5 * time.Second
)

// APIURL and CacheFilePath are vars (not consts) so tests can point them at
// a scratch httptest server / scratch file instead of the real endpoint and
// /tmp path.
var (
	// APIURL is the remote license-check endpoint.
	APIURL = licenseAPIURL()

	// CacheFilePath is where the last successful check result is cached.
	CacheFilePath = "/var/cache/davpanel/license.json"
)

// backoffSchedule is the escalating recheck cadence while the remote check
// keeps failing -- hourly on day 1,
// every 6h on day 2, every 12h on day 3, daily (FailureFloor) from day 4 on.
var backoffSchedule = []struct {
	after    time.Duration
	interval time.Duration
}{
	{24 * time.Hour, 1 * time.Hour},
	{2 * 24 * time.Hour, 6 * time.Hour},
	{3 * 24 * time.Hour, 12 * time.Hour},
}

var tagRe = regexp.MustCompile(`<([a-zA-Z0-9_]+)>([^<]+)</([a-zA-Z0-9_]+)>`)

func licenseAPIURL() string {
	if endpoint := strings.TrimSpace(os.Getenv("DAVPANEL_LICENSE_API")); endpoint != "" {
		return endpoint
	}
	return "https://api.davpanel.com/enterprise/index.php"
}

// Type classifies a license key as Community or Enterprise by its shape
// alone (this part doesn't require a network call -- it's the
// display/routing decision of "is this even supposed to be an Enterprise
// install").
func Type(key string) string {
	if strings.HasPrefix(key, "enterprise") || strings.HasPrefix(key, "noc") || strings.HasPrefix(key, "lifetime") {
		return "Enterprise"
	}
	return "Community"
}

// Checker holds the live validity state for an Enterprise license, kept up
// to date by a background goroutine (see StartBackgroundRecheck).
type Checker struct {
	Key      string
	PublicIP string

	mu           sync.RWMutex
	valid        bool
	failureSince time.Time
	hasFailure   bool
	httpClient   *http.Client
}

// NewChecker performs the initial synchronous check.
func NewChecker(key, publicIP string) *Checker {
	c := &Checker{Key: key, PublicIP: publicIP, httpClient: &http.Client{Timeout: requestTimeout}}
	c.valid = c.checkStartup()
	return c
}

// Valid reports whether Enterprise features should currently be unlocked.
func (c *Checker) Valid() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.valid
}

// StartBackgroundRecheck sleeps for the current backoff-aware interval,
// rechecks, repeats, forever, until the process exits (there's no stop
// channel -- it's a daemon goroutine for the process lifetime).
func (c *Checker) StartBackgroundRecheck() {
	go func() {
		for {
			time.Sleep(c.recheckInterval())
			// checkStartup locks c.mu itself for hasFailure/failureSince, so don't hold it here too -- RWMutex isn't reentrant and that deadlocks every future Valid() call
			valid := c.checkStartup()
			c.mu.Lock()
			c.valid = valid
			c.mu.Unlock()
		}
	}()
}

func (c *Checker) recheckInterval() time.Duration {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if !c.hasFailure {
		return RecheckInterval
	}
	elapsed := time.Since(c.failureSince)
	for _, step := range backoffSchedule {
		if elapsed < step.after {
			return step.interval
		}
	}
	return FailureFloor
}

// checkStartup does a remote check, with a grace-period fallback to the
// last successful check's cache file if the remote call fails.
func (c *Checker) checkStartup() bool {
	status := c.remoteCheck()

	if status == "Active" {
		c.writeCache()
		c.mu.Lock()
		c.hasFailure = false
		c.mu.Unlock()
		return true
	}

	c.mu.Lock()
	if !c.hasFailure {
		c.hasFailure = true
		c.failureSince = time.Now()
	}
	c.mu.Unlock()

	if status == "Unavailable" {
		if age, ok := c.readCacheAge(); ok && age < GracePeriod {
			return true
		}
	}
	return false
}

// remoteCheck does a POST with licensekey/ip form fields, and parses the
// response as a flat sequence of <tag>value</tag> pairs, looking for
// status.
func (c *Checker) remoteCheck() string {
	if c.PublicIP == "" || c.PublicIP == "Unknown" {
		return "Invalid"
	}

	form := url.Values{"licensekey": {c.Key}, "ip": {c.PublicIP}}
	req, err := http.NewRequest(http.MethodPost, APIURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "Invalid"
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("User-Agent", "DavAdmin-License-Check/1.0")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "Unavailable"
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 500 || resp.StatusCode == http.StatusTooManyRequests {
		return "Unavailable"
	}
	if resp.StatusCode != http.StatusOK {
		return "Invalid"
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "Invalid"
	}

	for _, m := range tagRe.FindAllStringSubmatch(string(body), -1) {
		if m[1] == "status" && m[1] == m[3] {
			return m[2]
		}
	}
	return "Invalid"
}

type cacheFile struct {
	CheckedAt   float64 `json:"checked_at"`
	Fingerprint string  `json:"fingerprint"`
}

func (c *Checker) cacheFingerprint() string {
	return fmt.Sprintf("%x", sha256.Sum256([]byte(c.Key+"\x00"+c.PublicIP)))
}

func (c *Checker) writeCache() {
	data, err := json.Marshal(cacheFile{CheckedAt: float64(time.Now().Unix()), Fingerprint: c.cacheFingerprint()})
	if err != nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(CacheFilePath), 0o700); err != nil {
		return
	}
	file, err := os.CreateTemp(filepath.Dir(CacheFilePath), ".license-*")
	if err != nil {
		return
	}
	defer os.Remove(file.Name())
	if _, err := file.Write(data); err != nil {
		file.Close()
		return
	}
	if err := file.Close(); err != nil {
		return
	}
	os.Rename(file.Name(), CacheFilePath)
}

func (c *Checker) readCacheAge() (time.Duration, bool) {
	data, err := os.ReadFile(CacheFilePath)
	if err != nil {
		return 0, false
	}
	var cached cacheFile
	if err := json.Unmarshal(data, &cached); err != nil || cached.Fingerprint != c.cacheFingerprint() {
		return 0, false
	}
	age := time.Since(time.Unix(int64(cached.CheckedAt), 0))
	return age, age >= 0
}

// RequireEnterprise wraps a handler so it 403s unless the license is a
// currently-valid Enterprise one. This gates Enterprise-only routes
// (importer/transfer, FTP, DNS/Docker clustering, resellers, the REST API,
// emails). No Go handler needs this gate yet -- none of those
// Enterprise-only features are implemented yet (see the migration
// backlog) -- but it's ready for when they are.
func RequireEnterprise(checker *Checker, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if checker == nil || !checker.Valid() {
			http.Error(w, "This feature requires a valid Enterprise license.", http.StatusForbidden)
			return
		}
		next(w, r)
	}
}
