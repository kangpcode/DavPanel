import React from "react";

// Sitewide Organization + WebSite structured data (https://schema.org/Organization),
// rendered once via src/theme/Root so it applies to every page, including docs/blog.
export const OrganizationSchema: React.FC = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                name: "DavPanel",
                url: "https://davpanel.com",
                logo: "https://davpanel.com/img/svg/davpanel_logo.svg",
                sameAs: ["https://github.com/kangpcode/DavPanel"],
            },
            {
                "@type": "WebSite",
                name: "DavPanel",
                url: "https://davpanel.com",
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
        />
    );
};
