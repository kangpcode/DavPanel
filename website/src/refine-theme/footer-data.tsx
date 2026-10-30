import React from "react";
import { FooterGithubIcon } from "./icons/footer-github";
import { NewBadgeIcon } from "./icons/popover";

export const menuItems = [
    {
        label: "Resources",
        items: [
            {
                label: "DavPanel Docs",
                href: "/docs/panel/intro/",
            },
            {
                label: "DavAdmin Docs",
                href: "/docs/admin/intro/",
            },
            {
                label: "How-to Guides",
                href: "/docs/articles/intro/",
            },
            {
                label: "Terminal commands",
                href: "/docs/articles/opencli/",
            },    
            {
                label: "DavPanel API",
                href: "/docs/panel/api/",
            },
            {
                label: "DavAdmin API",
                href: "/docs/articles/dev-experience/davadmin-api",
            },
            {
                label: "Resource Calculator",
                href: "/calculator/",
            },
            {
                label: "Install Command",
                href: "/install",
            },
        ],
    },
    {
        label: "Product",
        items: [
            {
                label: "Compare editions",
                href: "/enterprise/#compare",
            },
            {
                label: "Partner / NOC Pricing",
                href: "/licenses-for-partners",
            },
            {
                label: "Features",
                href: "/features",
            },
            {
                label: "Mobile App",
                href: "/mobile",
                icon: <NewBadgeIcon />,
            },
            {
                label: "Live Preview",
                href: "/demo",
            },
            {
                label: "Roadmap",
                href: "/roadmap",
            },
            {
                label: "Changelog",
                href: "/docs/changelog/intro/",
            },
        ],
    },
    {
        label: "Compare",
        items: [
            {
                label: "cPanel VS DavPanel",
                href: "/cpanel-alternative",
            },
            {
                label: "Plesk VS DavPanel",
                href: "/plesk-alternative",
            },
            {
                label: "DirectAdmin VS DavPanel",
                href: "/directadmin-alternative",
            },
            {
                label: "CyberPanel VS DavPanel",
                href: "/cyberpanel-alternative",
            },
        ],
    },
    {
        label: "Company",
        items: [
            {
                label: "About",
                href: "/about",
            },
            {
                label: "Blog",
                href: "/blog",
            },
            {
                label: "Statistics",
                href: "/statistics",
            },            
            {
                label: "Contact",
                href: "mailto:info@davpanel.com",
            },
        ],
    },
];

export const secondaryMenuItems = [
    {
        label: "Privacy Policy",
        href: "/privacy-policy",
    },
    {
        label: "Refund Policy",
        href: "/refund-policy",
    },
    {
        label: "License",
        href: "/LICENSE",
    },
];

export const footerDescription = `DavPanel - web hosting panel.`;

export const socialLinks = [
    {
        icon: FooterGithubIcon,
        href: "https://github.com/kangpcode/DavPanel",
    },
];
