package bootstrap

import (
	"os"
	"path/filepath"
	"testing"
)

func TestIsDevMode(t *testing.T) {
	dir := t.TempDir()
	orig := DavpanelConfigPath
	defer func() { DavpanelConfigPath = orig }()

	DavpanelConfigPath = filepath.Join(dir, "missing.config")
	if IsDevMode() {
		t.Fatal("expected false when config file is missing")
	}

	DavpanelConfigPath = filepath.Join(dir, "davpanel.config")
	os.WriteFile(DavpanelConfigPath, []byte("[PANEL]\ndev_mode=off\n"), 0644)
	if IsDevMode() {
		t.Fatal("expected false for dev_mode=off")
	}

	os.WriteFile(DavpanelConfigPath, []byte("[PANEL]\ndev_mode=on\n"), 0644)
	if !IsDevMode() {
		t.Fatal("expected true for dev_mode=on")
	}
}
