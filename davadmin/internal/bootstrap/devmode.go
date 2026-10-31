package bootstrap

import (
	"bufio"
	"os"
	"strings"

	"github.com/kangpcode/davadmin/internal/config"
)

// DavpanelConfigPath is a var (not const) so tests can point it at a
// scratch fixture instead of the real /etc path. Defaults to the same path
// config.Davpanel() reads, kept as a separate var here (rather than an
// import-time reference) since this line-scan runs before config's cached
// loader is ever touched.
var DavpanelConfigPath = config.DavpanelConfigPath

// IsDevMode reports true only if DavpanelConfigPath contains a line that
// is exactly "dev_mode=on" (case-insensitive, surrounding whitespace
// trimmed). Any read error, including a missing file, is treated as false.
func IsDevMode() bool {
	f, err := os.Open(DavpanelConfigPath)
	if err != nil {
		return false
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		if strings.EqualFold(strings.TrimSpace(scanner.Text()), "dev_mode=on") {
			return true
		}
	}
	return false
}
