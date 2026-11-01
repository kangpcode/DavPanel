import React from "react";
import clsx from "clsx";

export const CpanelIntroContent = ({ className }: { className?: string }) => {
    return (
        <div
            className={clsx(
                "flex flex-col",
                "gap-6 landing-sm:gap-8",
                "not-prose",
                className,
            )}
        >
            <h2
                className={clsx(
                    "text-2xl landing-sm:text-[32px] landing-sm:leading-[40px]",
                    "font-semibold",
                    "dark:text-gray-0 text-gray-900",
                )}
            >
                Why hosting providers choose DavPanel as their cPanel
                alternative
            </h2>
            <div
                className={clsx(
                    "flex flex-col",
                    "gap-4",
                    "text-base",
                    "dark:text-gray-400 text-gray-700",
                    "max-w-[792px]",
                )}
            >
                <p>
                    cPanel/WHM licenses are billed per account, and prices
                    have climbed sharply in recent years as tiers fill up.
                    DavPanel is a{" "}
                    <span
                        className={clsx(
                            "font-semibold",
                            "dark:text-gray-0 text-gray-900",
                        )}
                    >
                        cPanel alternative
                    </span>{" "}
                    built for hosting providers who want a predictable bill:
                    one fixed price per server, however many accounts you
                    run, that never increases.
                </p>
                <p>
                    Under the hood, DavPanel isolates every user and every
                    service (PHP, MySQL, and more) in its own Podman
                    container, rather than sharing services across accounts
                    the way cPanel does unless you pay extra for CloudLinux.
                    DavPanel release builds target x86_64 and ARM64.
                    Its Linux installer paths cover Ubuntu, Debian, AlmaLinux,
                    Rocky Linux, Oracle Linux and CentOS Stream. Check the{" "}
                    <a href="/docs/admin/intro/#supported-os-versions">OS matrix</a>{" "}
                    for version restrictions and pending installation checks.
                </p>
                <p>
                    Switching from cPanel/WHM doesn't mean starting over: the
                    built-in cPanel Backup Importer migrates existing
                    accounts, domains, and email onto DavPanel so you can
                    move your hosting business over with minimal downtime.
                </p>
            </div>
        </div>
    );
};
