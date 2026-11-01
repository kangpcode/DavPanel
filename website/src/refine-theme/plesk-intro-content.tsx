import React from "react";
import clsx from "clsx";

export const PleskIntroContent = ({ className }: { className?: string }) => {
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
                Why hosting providers choose DavPanel as their Plesk
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
                    Plesk licenses run 13-55€/month per account, and prices
                    have kept climbing - up 26% in 2026 alone, with annual
                    billing discontinued in favor of monthly-only pricing.
                    DavPanel is a{" "}
                    <span
                        className={clsx(
                            "font-semibold",
                            "dark:text-gray-0 text-gray-900",
                        )}
                    >
                        Plesk alternative
                    </span>{" "}
                    built around one fixed price per server, however many
                    accounts you run, with annual billing still available at
                    17% off.
                </p>
                <p>
                    Plesk shares PHP and MySQL across accounts unless you add
                    CloudLinux for user isolation, and its ARM (AArch64)
                    support is partial, limited to Ubuntu 22.04. DavPanel
                    isolates every user and every service in its own Podman
                    container by default. Release builds target x86_64 and
                    ARM64; native ARM64 hosting remains unverified.
                </p>
                <p>
                    Plesk has no automatic import tool, so switching away
                    means migrating accounts by hand. DavPanel has installer
                    paths for Ubuntu, Debian, AlmaLinux, Rocky Linux,
                    Oracle Linux and CentOS Stream. Check the{" "}
                    <a href="/docs/admin/intro/#supported-os-versions">OS matrix</a>{" "}
                    before choosing your target server image.
                </p>
            </div>
        </div>
    );
};
