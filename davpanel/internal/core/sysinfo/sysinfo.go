// Package sysinfo provides startup-time lookups (public IP, panel version, domain/port, SSL presence) that are cheap to cache and expensive to recompute per request.
package sysinfo

import (
	"context"
	"io"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"

	"github.com/kangpcode/davpanel/internal/core/cache"
)

const CaddyfilePath = "/etc/davpanel/caddy/Caddyfile"

var defaultBindRegex = regexp.MustCompile(`default_bind\s+([\d.]+)`)

var httpClient = &http.Client{Timeout: time.Second}

// FetchPublicIP tries two IP-echo services, then Caddy's default_bind, then "Unknown". Cached for 1h.
func FetchPublicIP(ctx context.Context, c *cache.Cache) string {
	ip, _ := cache.Memoize(ctx, c, "app.fetch_public_ip", time.Hour, func() (string, error) {
		urls := []string{"https://ip.davpanel.com", "https://ifconfig.me/ip"}
		for _, url := range urls {
			if ip, ok := fetchIPFrom(url); ok {
				return ip, nil
			}
		}

		if data, err := os.ReadFile(CaddyfilePath); err == nil {
			for _, line := range strings.Split(string(data), "\n") {
				if m := defaultBindRegex.FindStringSubmatch(line); m != nil {
					return m[1], nil
				}
			}
		}

		return "Unknown", nil
	})
	return ip
}

func fetchIPFrom(url string) (string, bool) {
	resp, err := httpClient.Get(url)
	if err != nil {
		return "", false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", false
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", false
	}
	return strings.TrimSpace(string(body)), true
}

func runDavcli(args ...string) (string, error) {
	out, err := exec.Command("davcli", args...).Output()
	return strings.TrimSpace(string(out)), err
}

// GetDavPanelVersion returns the installed panel version, cached for 2h.
func GetDavPanelVersion(ctx context.Context, c *cache.Cache) string {
	v, _ := cache.Memoize(ctx, c, "app.get_davpanel_version", 2*time.Hour, func() (string, error) {
		out, err := runDavcli("version")
		if err != nil || out == "" {
			return "latest", nil
		}
		return out, nil
	})
	return v
}

// HasSSL reports whether hostname has an issued cert (ACME or custom), cached per-hostname for 6 minutes
func HasSSL(ctx context.Context, c *cache.Cache, hostname string) bool {
	v, _ := cache.Memoize(ctx, c, "app.has_ssl:"+hostname, 6*time.Minute, func() (bool, error) {
		acme := "/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/" + hostname + "/" + hostname + ".crt"
		custom := "/etc/davpanel/caddy/ssl/custom/" + hostname + "/" + hostname + ".crt"
		return fileExists(acme) || fileExists(custom), nil
	})
	return v
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// GetDavPanelDomain returns the panel's configured domain, cached for 6 minutes
func GetDavPanelDomain(ctx context.Context, c *cache.Cache) string {
	v, _ := cache.Memoize(ctx, c, "app.get_davpanel_domain", 6*time.Minute, func() (string, error) {
		out, err := runDavcli("domain")
		if err != nil {
			return "", nil
		}
		return out, nil
	})
	return v
}

// GetDavAdminPort returns the port the separate "davadmin" service (which sends notification emails) listens on; left uncached since its only caller already runs in a background goroutine
func GetDavAdminPort() string {
	out, err := runDavcli("admin", "port")
	if err != nil || out == "" {
		return "2087"
	}
	return out
}

// GetDavPanelPort returns the port the panel itself listens on, cached for 1h
func GetDavPanelPort(ctx context.Context, c *cache.Cache) string {
	v, _ := cache.Memoize(ctx, c, "app.get_davpanel_port", time.Hour, func() (string, error) {
		out, err := runDavcli("port")
		if err != nil {
			return "", nil
		}
		return out, nil
	})
	return v
}
