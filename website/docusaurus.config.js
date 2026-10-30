/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require("dotenv").config();

const redirectJson = require("./redirects.json");

/** @type {import('@docusaurus/types/src/index').DocusaurusConfig} */
const siteConfig = {
    title: "DavPanel",
    tagline: 'Unparalleled support. Effortless website hosting. Continuous feature development.',
    url: "https://davpanel.com",
    baseUrl: "/",
    onBrokenLinks: 'ignore',
    onBrokenAnchors: 'ignore',
    projectName: "davpanel",
    organizationName: "kangpcode",
    trailingSlash: true,
    favicon: "img/favicon.svg",
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: Boolean(process.env.DISABLE_DOCS)
                    ? false
                    : {
                          path: "./docs",
                          sidebarPath: require.resolve("./sidebars.js"),
                          editUrl:
                              "https://github.com/kangpcode/DavPanel/tree/main/website",
                          showLastUpdateAuthor: true,
                          showLastUpdateTime: true,
                          disableVersioning:
                              process.env.DISABLE_VERSIONING === "true",
                          versions: {
                              current: {
                                  label: "2.0.19",
                              },
                          },
                          lastVersion: "current",
                          admonitions: {
                              keywords: [
                                  "additional",
                                  "note",
                                  "tip",
                                  "info-tip",
                                  "info",
                                  "caution",
                                  "danger",
                                  "sourcecode",
                                  "create-example",
                                  "simple",
                              ],
                          },
                          exclude: ["**/**/_*.md"],
                          // Adding the sidebarItemsGenerator with reverse logic
                          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
                              const sidebarItems = await defaultSidebarItemsGenerator(args);

                              // Reverse items only for the 'Changelog' category
                              const modifiedSidebarItems = sidebarItems.map((item) => {
                                  if (item.type === 'category' && item.label === 'Changelog') {
                                      return { ...item, items: item.items.reverse() };
                                  }
                                  return item;
                              });

                              // Docusaurus sorts file names as text (2.0.19 before 2.0.2), so put changelog versions in numeric order
                              if (args.item.dirName === 'changelog') {
                                  const isVersion = (item) => item.type === 'doc' && /\/\d+(\.\d+)*$/.test(item.id);
                                  const versions = modifiedSidebarItems
                                      .filter(isVersion)
                                      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
                                  return modifiedSidebarItems.map((item) => (isVersion(item) ? versions.shift() : item));
                              }

                              return modifiedSidebarItems;
                          },
                      },
                blog: process.env.DISABLE_BLOG
                    ? false
                    : {
                          blogTitle: "Blog",
                          blogDescription:
                              "A resource for DavPanel, front-end ecosystem, and web development",
                          routeBasePath: "/blog",
                          postsPerPage: "ALL",
                          blogSidebarTitle: "All posts",
                          blogSidebarCount: 0,
                          onUntruncatedBlogPosts: 'ignore',
                          feedOptions: {
                              type: "all",
                              copyright: `Copyright © ${new Date().getFullYear()} DavPanel.`,
                          },
                      },
                theme: {
                    customCss: [
                        require.resolve("./src/refine-theme/css/colors.css"),
                        require.resolve("./src/refine-theme/css/fonts.css"),
                        require.resolve("./src/refine-theme/css/custom.css"),
                        require.resolve("./src/css/custom.css"),
                        require.resolve("./src/css/split-pane.css"),
                        require.resolve("./src/css/demo-page.css"),
                    ],
                },
                sitemap: {
                    ignorePatterns: ["**/_*.md"],
                },
            },
        ],
    ],
    plugins: [
        [
            "@docusaurus/plugin-client-redirects",
            {
                redirects: redirectJson.redirects,
                createRedirects(existingPath) {
                    if (existingPath.includes("/api-reference/core/")) {
                        return [
                            existingPath.replace(
                                "/api-reference/core/",
                                "/api-references/",
                            ),
                        ];
                    }
                    return undefined; // Return a falsy value: no redirect created
                },
            },
        ],
        [
            "docusaurus-plugin-generate-llms-txt",
            {
                outputFile: "llms-full.txt",
            },
        ],
        "./plugins/llms-pages-plugin.js",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                hashed: true,
                indexBlog: false,
                indexPages: false,
                ignoreFiles: [/\/changelog\//],
            },
        ],
        [
            "docusaurus-plugin-copy-page-button",
            {
                // Rendered manually in doc-header.tsx instead, in the
                // "Get Support" button's old slot.
                injectButton: false,
                // TEMP disabled: postBuild crashes with EISDIR on some
                // route (reads a path that's actually a directory). Copy/
                // view/open-in-AI still work via client-side extraction
                // without this — it only adds pre-generated /page.md
                // routes. Needs real investigation, not just disabling.
                generateMarkdownRoutes: false,
            },
        ],
        async function tailwindcss() {
            return {
                name: "docusaurus-tailwindcss",
                configurePostCss(postcssOptions) {
                    postcssOptions.plugins.push(require("tailwindcss"));
                    postcssOptions.plugins.push(require("autoprefixer"));
                    return postcssOptions;
                },
            };
        },
        ...(process.env.DISABLE_BLOG
            ? []
            : [["./plugins/related-posts-plugin.js", { relatedCount: 3 }]]),
        "./plugins/og-images.js",
    ],
    themeConfig: {
        prism: {
            theme: require("prism-react-renderer").themes.github,
            darkTheme: require("prism-react-renderer").themes.vsDark,
            magicComments: [
                // Remember to extend the default highlight class name as well!
                {
                    className: "theme-code-block-highlighted-line",
                    line: "highlight-next-line",
                    block: { start: "highlight-start", end: "highlight-end" },
                },
                {
                    className: "code-block-hidden",
                    line: "hide-next-line",
                    block: { start: "hide-start", end: "hide-end" },
                },
                {
                    className: "theme-code-block-added-line",
                    line: "added-line",
                    block: { start: "added-start", end: "added-end" },
                },
                {
                    className: "theme-code-block-removed-line",
                    line: "removed-line",
                    block: { start: "removed-start", end: "removed-end" },
                },
            ],
        },
        image: "img/davpanel-social.png",
        metadata: [
            {
                name: "keywords",
                content:
                    "davpanel, davadmin, dav panel, dav admin, hosting control panel, container hosting",
            },
        ],
        navbar: {
            logo: {
                alt: "DavPanel",
                src: "img/svg/davpanel_logo.svg",
            },
            items: [
                { to: "/blog", label: "Blog", position: "left" },
                {
                    type: "docsVersionDropdown",
                    position: "right",
                    dropdownActiveClassDisabled: true,
                },
                {
                    href: "https://github.com/kangpcode/DavPanel",
                    position: "right",
                    className: "header-icon-link header-github-link",
                },
                {
                    href: "https://github.com/kangpcode/DavPanel/discussions",
                    position: "right",
                    className: "header-icon-link header-discord-link",
                },
                {
                    href: "https://github.com/kangpcode/DavPanel/discussions",
                    position: "right",
                    className: "header-icon-link header-twitter-link",
                },
            ],
        },
        footer: {
            logo: {
                alt: "DavPanel",
                src: "/img/svg/davpanel_logo.svg",
            },
            links: [
                {
                    title: "Resources",
                    items: [
                        {
                            label: "DavPanel Docs",
                            to: "/docs/panel/intro/",
                        },
                        {
                            label: "DavAdmin Docs",
                            to: "/docs/admin/intro/",
                        },
                        {
                            label: "Blog",
                            to: "/blog",
                        },
                    ],
                },
                {
                    title: "Product",
                    items: [
                        {
                            label: "Features",
                            to: "/features",
                        },
                        {
                            label: "Live Preview",
                            to: "/demo",
                        },
                        {
                            label: "Mobile App",
                            to: "/mobile",
                        },
                        {
                            label: "Roadmap",
                            to: "/roadmap",
                        },
                    ],
                },
                {
                    title: "Company",
                    items: [
                        {
                            label: "About",
                            to: "/about",
                        },
                        {
                            label: "Support",
                            to: "/support",
                        },
                    ],
                },
                {
                    title: "__LEGAL",
                    items: [
                        {
                            label: "License",
                            to: "/LICENSE",
                        },
                        {
                            label: "Privacy",
                            to: "/privacy-policy",
                        },
                        {
                            label: "kangpcode@users.noreply.github.com",
                            to: "mailto:kangpcode@users.noreply.github.com",
                        },
                    ],
                },
                {
                    title: "__SOCIAL",
                    items: [
                        {
                            href: "https://github.com/kangpcode/DavPanel",
                            label: "github",
                        },
                        {
                            href: "https://github.com/kangpcode/DavPanel/discussions",
                            label: "community",
                        },
                    ],
                },
            ],
        },
        docs: {
            sidebar: {
                autoCollapseCategories: false,
            },
        },
        colorMode: {
            defaultMode: "dark",
        },
    },
    customFields: {
        /** Footer Fields */
        footerDescription:
            '<strong style="font-weight:700;">DavPanel</strong> is an open-source container hosting control panel maintained by Dhafa Nazula Permadi (kangpcode).',
        contactTitle: "Contact",
        contactDescription: [
            "DavPanel",
            "Maintained by kangpcode",
        ],
        contactEmail: "kangpcode@users.noreply.github.com",
        /** ---- */
    },
    webpack: {
        jsLoader: (isServer) => ({
            loader: require.resolve("swc-loader"),
            options: {
                jsc: {
                    parser: {
                        syntax: "typescript",
                        tsx: true,
                    },
                    transform: {
                        react: {
                            runtime: "automatic",
                            throwIfNamespace: false,
                        },
                    },
                    target: "es2017",
                },
                module: {
                    type: isServer ? "commonjs" : "es6",
                },
            },
        }),
    },
};

module.exports = siteConfig;
