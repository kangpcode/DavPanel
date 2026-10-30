import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import type { Plugin } from "@docusaurus/types";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

type DocusaurusDoc = {
    permalink: string;
    title: string;
    description: string;
    frontMatter: {
        image?: string;
    };
};

type ContentPluginType = {
    default: {
        loadedVersions: Array<{ versionName: string; docs: DocusaurusDoc[] }>;
    };
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const BACKGROUND_COLOR = "#0B0F17";
const ACCENT_COLOR = "#1890FF";
const MUTED_COLOR = "#9AA4B2";
const SITE_URL = "https://davpanel.com";

// static/icons/davpanel_logo.svg, viewBox "0 0 213 215"
const LOGO_PATH =
    "M990 2071 c-39 -13 -141 -66 -248 -129 -53 -32 -176 -103 -272 -158 -206 -117 -276 -177 -306 -264 -17 -50 -19 -88 -19 -460 0 -476 0 -474 94 -568 55 -56 124 -98 604 -369 169 -95 256 -104 384 -37 104 54 532 303 608 353 76 50 126 113 147 184 8 30 12 160 12 447 0 395 -1 406 -22 461 -34 85 -98 138 -317 264 -104 59 -237 136 -295 170 -153 90 -194 107 -275 111 -38 2 -81 0 -95 -5z m205 -561 c66 -38 166 -95 223 -127 l102 -58 0 -262 c0 -262 0 -263 -22 -276 -13 -8 -52 -31 -88 -51 -36 -21 -126 -72 -200 -115 l-135 -78 -3 261 -3 261 -166 95 c-91 52 -190 109 -219 125 -30 17 -52 34 -51 39 3 9 424 256 437 255 3 0 59 -31 125 -69z";

// Keep in sync with permalinkToOgImagePath() in src/theme/DocItem/Metadata/index.js
function permalinkToOgImagePath(permalink: string): string {
    const clean = permalink.replace(/\/+$/, "") || "/index";
    return `/img/og${clean}.png`;
}

// Non-docs site pages (src/pages/**) don't expose title/description to the
// plugin at content-load time, so they're listed here explicitly. Keep each
// entry in sync with the title/description set in that page's own <Head>.
type SitePageOgEntry = {
    permalink: string;
    title: string;
    description: string;
};

// Background screenshot for docs pages, keyed by permalink section. Sections
// not listed here (changelog, articles, the docs root, ...) keep the plain
// background, unchanged.
function docBackgroundFilename(permalink: string): string | undefined {
    if (/\/panel\//.test(permalink)) {
        return "davpanel_screenshot.png";
    }
    if (/\/admin\//.test(permalink)) {
        return "davadmin_screenshot.png";
    }
    return undefined;
}

const SITE_PAGES: SitePageOgEntry[] = [
    {
        permalink: "/",
        title: "DavPanel | Next Generation Web Hosting Panel",
        description:
            "A highly customizable web hosting control panel built around containers.",
    },
    {
        permalink: "/enterprise/",
        title: "DavPanel Enterprise | Next Generation Hosting Panel",
        description:
            "DavPanel Enterprise Edition provides robust user isolation and management features, designed for web hosting providers, all at a fixed price.",
    },
    {
        permalink: "/community/",
        title: "DavPanel Community Edition | Free Web Hosting Panel",
        description:
            "DavPanel Community edition is a free web hosting control panel, suitable for VPS and private use.",
    },
    {
        permalink: "/cpanel-alternative/",
        title: "DavPanel vs cPanel/WHM: Alternative Hosting Panel Compared",
        description:
            "Compare DavPanel vs cPanel/WHM: Podman-based per-user isolation, native ARM support, and a fixed €14.95/month price per server - no per-account fees or hikes.",
    },
    {
        permalink: "/cyberpanel-alternative/",
        title: "DavPanel vs CyberPanel: Alternative Hosting Panel Compared",
        description:
            "Compare DavPanel vs CyberPanel: real per-user isolation without CloudLinux, granular permissions, and enterprise support from €14.95/month per server.",
    },
    {
        permalink: "/directadmin-alternative/",
        title: "DavPanel vs DirectAdmin: Alternative Hosting Panel Compared",
        description:
            "Compare DavPanel vs DirectAdmin: Podman-based per-user isolation, a full REST API and MCP server for AI agents, priced per server, not per account.",
    },
    {
        permalink: "/plesk-alternative/",
        title: "DavPanel vs Plesk: Alternative Hosting Panel Compared",
        description:
            "Compare DavPanel vs Plesk: true per-user Podman isolation, native ARM support, and one fixed €14.95/month price per server - no per-account licensing fees.",
    },
    {
        permalink: "/about/",
        title: "About | DavPanel Project",
        description:
            "DavPanel is built by hosting operators, for hosting operators - Podman-native isolation, built-in security, and no per-seat pricing.",
    },
    {
        permalink: "/assets/",
        title: "Brand Assets | DavPanel",
        description:
            "Download official DavPanel brand assets and logo icons in SVG format, with customizable colors for press and partner use.",
    },
    {
        permalink: "/billing/",
        title: "Billing Software Integrations for DavPanel | DavPanel",
        description:
            "DavPanel integrates with WHMCS, FOSSBilling, Blesta, ClientExec, and WISECP for automated hosting account provisioning, suspension, and termination.",
    },
    {
        permalink: "/blesta-module/",
        title: "Blesta module for DavPanel | DavPanel",
        description:
            "Automate hosting account provisioning between Blesta and DavPanel - install, configure, and provision in about 5 minutes.",
    },
    {
        permalink: "/calculator/",
        title: "Resource Calculator | DavPanel",
        description:
            "Estimate the CPU, RAM, and disk you need to host a given number of users on DavPanel, based on real benchmarks, plus your DavPanel license cost.",
    },
    {
        permalink: "/calculator/benchmark/",
        title: "Benchmark Methodology | DavPanel",
        description:
            "How we benchmarked DavPanel 2.0 (Podman) resource usage: test setup, the account-creation script used, and the raw davcli docker-collect_stats results.",
    },
    {
        permalink: "/clientexec-module/",
        title: "ClientExec module for DavPanel | DavPanel",
        description:
            "Automate hosting account provisioning between ClientExec and DavPanel - install, configure, and provision in about 5 minutes.",
    },
    {
        permalink: "/demo/",
        title: "Live Demo | DavPanel",
        description:
            "Try a live demo of DavPanel and DavAdmin online - explore the dashboard and admin panel before you install anything.",
    },
    {
        permalink: "/docs/",
        title: "Documentation | DavPanel",
        description:
            "Browse the DavPanel and DavAdmin documentation: installation, API reference, terminal commands, and how-to guides for running DavPanel hosting infrastructure.",
    },
    {
        permalink: "/features/",
        title: "Features | DavPanel",
        description:
            "See every feature built into DavPanel: multiple PHP versions, per-user isolation, Nginx/OpenLiteSpeed, Podman, backups, and built-in security.",
    },
    {
        permalink: "/fossbilling-module/",
        title: "FOSSBilling module for DavPanel | DavPanel",
        description:
            "Automate hosting account provisioning between FOSSBilling and DavPanel - install, configure, and provision in about 5 minutes.",
    },
    {
        permalink: "/hosting-providers/",
        title: "Control Panel for Hosting Providers | DavPanel Enterprise",
        description:
            "Hosting providers offering DavPanel on VPS and dedicated servers - compare locations, services, and managed support options.",
    },
    {
        permalink: "/install/",
        title: "Install command generator | DavPanel",
        description:
            "Generate a custom DavPanel install command with your choice of domain, ports, firewall, DNS, and security options.",
    },
    {
        permalink: "/LICENSE/",
        title: "LICENSE | DavPanel",
        description:
            "The DavPanel End User License Agreement (EULA) covering license grant, restrictions, ownership, and purchase terms.",
    },
    {
        permalink: "/licenses-for-partners/",
        title: "NOC Partners Pricing | DavPanel Enterprise",
        description:
            "DavPanel Enterprise pricing for NOC partners with their own IP ranges, priced by network prefix length.",
    },
    {
        permalink: "/migrations/",
        title: "Free Migration to DavPanel | DavPanel",
        description:
            "Free migration from cPanel, Plesk, DirectAdmin and CyberPanel to DavPanel for annual Enterprise license holders - up to 20 accounts and 500 GB included.",
    },
    {
        permalink: "/patches/",
        title: "DavPanel Patches | DavPanel",
        description:
            "Official DavPanel patches for reported bugs - apply a fix immediately with one command instead of waiting for the next release.",
    },
    {
        permalink: "/privacy-policy/",
        title: "Privacy Policy | DavPanel",
        description:
            "Read the DavPanel privacy policy to learn what data we collect, how it's used, and how we protect it.",
    },
    {
        permalink: "/refund-policy/",
        title: "Refund Policy | DavPanel",
        description:
            "DavPanel Enterprise refund policy - licenses can be refunded within 7 days of purchase if not yet activated.",
    },
    {
        permalink: "/roadmap/",
        title: "Roadmap | DavPanel",
        description:
            "See what DavPanel is building next - features in active development and what's planned, updated manually by our team.",
    },
    {
        permalink: "/statistics/",
        title: "Usage Statistics | DavPanel",
        description:
            "Live usage statistics for DavPanel: latest version, release date, active installations, and recent updates across the community.",
    },
    {
        permalink: "/support/",
        title: "Support | DavPanel",
        description:
            "Get help with DavPanel and DavAdmin - search the docs, ask the community, open an Enterprise support ticket, or report a bug.",
    },
    {
        permalink: "/whmcs-module/",
        title: "WHMCS module for DavPanel | DavPanel",
        description:
            "Automate hosting account provisioning between WHMCS and DavPanel - install, configure, and provision in about 5 minutes.",
    },
    {
        permalink: "/wisecp-module/",
        title: "WISECP module for DavPanel | DavPanel",
        description:
            "Automate hosting account provisioning between WISECP and DavPanel - install, configure, and provision in about 5 minutes.",
    },
];

// Strip emoji/symbol glyphs the Inter font can't render (would show as tofu boxes).
const EMOJI_PATTERN =
    /[\u{2190}-\u{2BFF}\u{1F000}-\u{1FFFF}\u{FE0F}\u{200D}]/gu;

function truncate(rawText: string, maxLength: number): string {
    const text = rawText.replace(EMOJI_PATTERN, "").replace(/\s+/g, " ").trim();
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength).trimEnd()}…`;
}

type FontConfig = {
    name: string;
    data: Buffer;
    weight: 400 | 700;
    style: "normal";
};

let fontsPromise: Promise<FontConfig[]> | null = null;

function loadFonts(): Promise<FontConfig[]> {
    if (!fontsPromise) {
        fontsPromise = Promise.all([
            fs.readFile(
                require.resolve(
                    "@fontsource/inter/files/inter-latin-400-normal.woff",
                ),
            ),
            fs.readFile(
                require.resolve(
                    "@fontsource/inter/files/inter-latin-700-normal.woff",
                ),
            ),
        ]).then(([regular, bold]) => [
            { name: "Inter", data: regular, weight: 400, style: "normal" },
            { name: "Inter", data: bold, weight: 700, style: "normal" },
        ]);
    }
    return fontsPromise;
}

const screenshotPromises: Record<string, Promise<string>> = {};

// static/img/<filename>, base64-encoded once per filename and reused across
// every OG image that shares that background screenshot.
function loadScreenshotDataUri(
    siteDir: string,
    filename: string,
): Promise<string> {
    if (!screenshotPromises[filename]) {
        screenshotPromises[filename] = fs
            .readFile(path.join(siteDir, "static", "img", filename))
            .then((buf) => `data:image/png;base64,${buf.toString("base64")}`);
    }
    return screenshotPromises[filename];
}

async function renderOgImage(
    title: string,
    description: string,
    permalink: string,
    backgroundImageDataUri?: string,
): Promise<Buffer> {
    const fonts = await loadFonts();
    const logoFill = backgroundImageDataUri ? "#FFFFFF" : ACCENT_COLOR;
    const pageUrl = `${SITE_URL}${permalink}`;

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: BACKGROUND_COLOR,
                    padding: "72px",
                    fontFamily: "Inter",
                },
                children: [
                    ...(backgroundImageDataUri
                        ? [
                              {
                                  type: "img",
                                  props: {
                                      src: backgroundImageDataUri,
                                      width: OG_WIDTH,
                                      height: OG_HEIGHT,
                                      style: {
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          width: OG_WIDTH,
                                          height: OG_HEIGHT,
                                          objectFit: "cover",
                                          opacity: 0.16,
                                      },
                                  },
                              },
                          ]
                        : []),
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                            },
                            children: [
                                {
                                    type: "svg",
                                    props: {
                                        width: 44,
                                        height: 44,
                                        viewBox: "0 0 213 215",
                                        children: {
                                            type: "path",
                                            props: {
                                                d: LOGO_PATH,
                                                transform:
                                                    "translate(0,215) scale(0.1,-0.1)",
                                                fill: logoFill,
                                            },
                                        },
                                    },
                                },
                                {
                                    type: "span",
                                    props: {
                                        style: {
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color: "#FFFFFF",
                                        },
                                        children: "DavPanel",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: { display: "flex", flexDirection: "column" },
                            children: [
                                // A "|" in the title (e.g. "DavPanel Enterprise |
                                // Next Generation Hosting Panel") breaks onto its
                                // own line instead of rendering the pipe glyph.
                                ...title
                                    .split("|")
                                    .map((line) => line.trim())
                                    .filter(Boolean)
                                    .map((line, index) => ({
                                        type: "div",
                                        props: {
                                            style: {
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 2,
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                fontSize: 58,
                                                fontWeight: 700,
                                                lineHeight: 1.15,
                                                color: "#FFFFFF",
                                                maxWidth: 1000,
                                                ...(index > 0
                                                    ? { marginTop: 4 }
                                                    : {}),
                                            },
                                            children: line,
                                        },
                                    })),
                                ...(description
                                    ? [
                                          {
                                              type: "div",
                                              props: {
                                                  style: {
                                                      display: "-webkit-box",
                                                      WebkitBoxOrient:
                                                          "vertical",
                                                      WebkitLineClamp: 3,
                                                      textOverflow: "ellipsis",
                                                      overflow: "hidden",
                                                      marginTop: 20,
                                                      fontSize: 28,
                                                      lineHeight: 1.4,
                                                      color: MUTED_COLOR,
                                                      maxWidth: 960,
                                                  },
                                                  children: description,
                                              },
                                          },
                                      ]
                                    : []),
                            ],
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                fontSize: 22,
                                color: ACCENT_COLOR,
                            },
                            children: pageUrl,
                        },
                    },
                ],
            },
        },
        { width: OG_WIDTH, height: OG_HEIGHT, fonts },
    );

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } });
    return resvg.render().asPng();
}

type CacheMap = Record<string, string>;

async function readCache(cacheFile: string): Promise<CacheMap> {
    try {
        return await fs.readJson(cacheFile);
    } catch {
        return {};
    }
}

export default function pluginOgImages(context: {
    siteDir: string;
}): Plugin<void> {
    return {
        name: "davpanel-plugin-og-images",
        async allContentLoaded({ allContent }) {
            const docsContent = allContent[
                "docusaurus-plugin-content-docs"
            ] as ContentPluginType | undefined;

            const currentVersion = docsContent?.default.loadedVersions.find(
                (version) => version.versionName === "current",
            );

            if (!currentVersion) {
                return;
            }

            const cacheFile = path.join(
                context.siteDir,
                "node_modules",
                ".cache",
                "og-images.json",
            );

            const cache = await readCache(cacheFile);
            const nextCache: CacheMap = {};

            for (const doc of currentVersion.docs) {
                if (doc.frontMatter?.image) {
                    // Respect a manually set image, don't generate one.
                    continue;
                }

                const title = truncate(doc.title || "DavPanel Docs", 80);
                const description = truncate(doc.description ?? "", 160);
                const imagePath = permalinkToOgImagePath(doc.permalink);
                const outputFile = path.join(
                    context.siteDir,
                    "static",
                    imagePath,
                );
                const backgroundFilename = docBackgroundFilename(
                    doc.permalink,
                );
                const hash = crypto
                    .createHash("sha1")
                    .update(`${title} ${description} ${backgroundFilename ?? ""}`)
                    .digest("hex");

                nextCache[imagePath] = hash;

                if (
                    cache[imagePath] === hash &&
                    (await fs.pathExists(outputFile))
                ) {
                    continue;
                }

                const backgroundDataUri = backgroundFilename
                    ? await loadScreenshotDataUri(
                          context.siteDir,
                          backgroundFilename,
                      )
                    : undefined;

                const png = await renderOgImage(
                    title,
                    description,
                    doc.permalink,
                    backgroundDataUri,
                );
                await fs.ensureDir(path.dirname(outputFile));
                await fs.writeFile(outputFile, png);
            }

            for (const page of SITE_PAGES) {
                const title = truncate(page.title, 80);
                const description = truncate(page.description, 160);
                const imagePath = permalinkToOgImagePath(page.permalink);
                const outputFile = path.join(
                    context.siteDir,
                    "static",
                    imagePath,
                );
                const hash = crypto
                    .createHash("sha1")
                    .update(`${title} ${description} screenshot-bg`)
                    .digest("hex");

                nextCache[imagePath] = hash;

                if (
                    cache[imagePath] === hash &&
                    (await fs.pathExists(outputFile))
                ) {
                    continue;
                }

                const screenshotDataUri = await loadScreenshotDataUri(
                    context.siteDir,
                    "davpanel_screenshot.png",
                );
                const png = await renderOgImage(
                    title,
                    description,
                    page.permalink,
                    screenshotDataUri,
                );
                await fs.ensureDir(path.dirname(outputFile));
                await fs.writeFile(outputFile, png);
            }

            await fs.ensureDir(path.dirname(cacheFile));
            await fs.writeJson(cacheFile, nextCache);
        },
    };
}
