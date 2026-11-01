import React, { useState } from "react";
import clsx from "clsx";

import { CheckCircle } from "@site/src/refine-theme/icons/check-circle";
import { CrossCircle } from "@site/src/refine-theme/icons/cross-circle";
import { EnterpriseGetInTouchButton } from "./enterprise-get-in-touch-button";
import { ArrowLeftLongIcon } from "./icons/arrow-left-long";
import { AnimatePresence, motion } from "framer-motion";

export const EnterpriseTable = ({ className }: { className?: string }) => {
    const [activeTab, setActiveTab] = useState<"plesk" | "davpanel">(
        "davpanel",
    );

    return (
        <div
            className={clsx(
                "flex flex-col",
                "not-prose",
                "min-h-[1556px] landing-sm:min-h-[1444px] landing-md:min-h-min",
                "w-full",
                className,
            )}
        >
            <div
                className={clsx(
                    "pl-4 landing-sm:pl-6 landing-md:pl-10",
                    "text-2xl landing-sm:text-[32px] landing-sm:leading-[40px]",
                )}
            >
                <h2
                    id="compare" 
                    className={clsx(
                        "font-semibold",
                        "dark:text-gray-400 text-gray-600",
                    )}
                >
                    Compare Plesk VS DavPanel
                </h2>
            </div>

            <div className={clsx("w-full", "pb-8", "relative")}>
                <AnimatePresence exitBeforeEnter>
                    <motion.div
                        key={activeTab}
                        initial={{
                            opacity: 0,
                            x: activeTab === "plesk" ? "-100%" : "100%",
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x: activeTab === "plesk" ? "-100%" : "100%",
                        }}
                        transition={{
                            duration: 0.3,
                            bounce: 0,
                            ease: "easeInOut",
                        }}
                        className={clsx("relative", "w-full", "pt-8")}
                    >
                        <TableStickyHeader
                            activeTab={activeTab}
                            setActiveTab={(tab: "plesk" | "davpanel") => {
                                setActiveTab(tab);
                            }}
                        />
                        <TableSectionWrapper>
                            {tableData.map((section) => {
                                const isLast =
                                    section.title === tableData.at(-1).title;

                                return (
                                    <TableSection
                                        key={section.title}
                                        title={section.title}
                                        activeTab={activeTab}
                                        items={section.items}
                                        isLast={isLast}
                                    />
                                );
                            })}
                        </TableSectionWrapper>
                    </motion.div>
                </AnimatePresence>
            </div>
            <EnterpriseGetInTouchButton
                className={clsx("block landing-sm:hidden", "mx-auto")}
                linkClassName={clsx("w-[344px]", "mx-auto")}
            />
        </div>
    );
};

const TableItemHeading = ({ children }) => {
    return (
        <div
            className={clsx(
                "pl-4 landing-sm:pl-10 pb-4 pt-4 pr-4",
                "bg-refine-davpanel-table-alt",
                "dark:bg-refine-davpanel-table-alt-dark",
                "border-b",
                "border-gray-200",
                "dark:border-gray-700",
                "text-gray-900",
                "dark:text-gray-0",
                "text-base",
                "font-semibold",
            )}
        >
            {children}
        </div>
    );
};

const TableItemContent = ({ children, valueType, activeTab, className }) => {
    const isIcon = valueType[activeTab] === "icon";

    return (
        <div
            className={clsx(
                isIcon && "w-auto",
                !isIcon && "w-[560px]",
                "landing-sm:w-[360px]",
                "landing-md:w-[296px]",
                "landing-lg:w-[396px]",
                "landing-sm:py-4",
                "landing-sm:px-6",
                "flex",
                "items-start",
                "justify-start",
                "gap-2",
                className,
            )}
        >
            {children}
        </div>
    );
};

const TableItemDescription = ({ children, isLast }) => {
    return (
        <div
            className={clsx(
                "min-w-[296px] landing-md:min-w-auto",
                "landing-md:flex-1",
                "text-base",
                "flex",
                "text-gray-700",
                "dark:text-gray-400",
                "landing-sm:pl-10 landing-sm:pb-4 landing-sm:pt-4 landing-sm:pr-4",
                !isLast && "landing-sm:border-r",
                !isLast && "landing-sm:border-gray-200",
                !isLast && "landing-sm:dark:border-gray-700",
            )}
        >
            {children}
        </div>
    );
};

const TableItemContentGroup = ({
    plesk,
    davpanel,
    activeTab,
    isLast,
    valueType,
}) => {
    const isIcon = valueType[activeTab] === "icon";

    return (
        <div
            className={clsx(
                "flex-shrink-0",
                "flex",
                "w-auto",
                isIcon && "ml-auto",
                isLast && "landing-sm:border-b",
                isLast && "landing-sm:border-l",
                isLast && "landing-sm:border-gray-200",
                isLast && "landing-sm:dark:border-gray-700",
                isLast && "landing-sm:rounded-bl-3xl",
                isLast && "landing-sm:rounded-br-3xl",
                "overflow-hidden",
            )}
        >
            <div className={clsx("flex", "flex-shrink-0")}>
                <TableItemContent
                    activeTab={activeTab}
                    valueType={valueType}
                    className={clsx(
                        activeTab !== "plesk" && "hidden landing-md:flex",
                        activeTab === "plesk" && "flex",
                    )}
                >
                    {plesk}
                </TableItemContent>
                <div
                    className={clsx(
                        "w-px h-full",
                        "bg-gray-200",
                        "dark:bg-gray-700",
                        "flex-shrink-0",
                        "hidden",
                        "landing-md:block",
                    )}
                />
                <TableItemContent
                    activeTab={activeTab}
                    valueType={valueType}
                    className={clsx(
                        activeTab !== "davpanel" && "hidden landing-md:flex",
                        activeTab === "davpanel" && "flex",
                    )}
                >
                    {davpanel}
                </TableItemContent>
            </div>
        </div>
    );
};

const TableItem = ({
    description,
    plesk,
    davpanel,
    activeTab,
    isLast,
    valueType,
}) => {
    return (
        <div
            className={clsx(
                !isLast && "border-b",
                !isLast && "border-b-gray-200",
                !isLast && "dark:border-b-gray-700",
                "w-full",
                "p-4 landing-sm:p-0",
                "overflow-hidden",
            )}
        >
            <div
                key={activeTab}
                className={clsx(
                    "flex",
                    valueType[activeTab] === "icon" && "flex-row",
                    valueType[activeTab] !== "icon" &&
                        "flex-col landing-sm:flex-row",
                    "gap-2 landing-sm:gap-0",
                )}
            >
                <TableItemDescription isLast={isLast}>
                    {description}
                </TableItemDescription>
                <TableItemContentGroup
                    {...{ plesk, davpanel, activeTab, isLast, valueType }}
                />
            </div>
        </div>
    );
};

const TableSection = ({ title, items, activeTab, isLast = false }) => {
    return (
        <>
            <TableItemHeading>{title}</TableItemHeading>
            {items.map((item, index) => (
                <TableItem
                    key={index}
                    activeTab={activeTab}
                    {...item}
                    isLast={isLast && index === items.length - 1}
                />
            ))}
        </>
    );
};

const TableTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div
            className={clsx(
                "flex",
                "flex-shrink-0",
                "rounded-tl-2xl landing-md:rounded-tl-3xl",
                "rounded-tr-2xl landing-md:rounded-tr-3xl",
                "border",
                "border-gray-200",
                "dark:border-gray-700",
                "border-b-0",
                "bg-gray-0",
                "dark:bg-gray-900",
                "w-full landing-sm:w-[360px]",
                "overflow-hidden",
                "landing-md:w-auto",
                "relative",
            )}
        >
            <button
                type="button"
                onClick={() => {
                    setActiveTab((prev) => {
                        if (prev === "plesk") return "davpanel";
                        return "plesk";
                    });
                }}
                className={clsx(
                    "transition-opacity duration-200 ease-in-out",
                    "z-[1]",
                    "flex",
                    "landing-md:hidden",
                    "absolute",
                    "right-6",
                    "top-4",
                    "rounded-full",
                    "w-12 h-6",
                    "items-center justify-center",
                    activeTab === "davpanel" &&
                        "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
                    activeTab === "plesk" &&
                        "bg-refine-blue dark:bg-refine-cyan-alt text-gray-0 dark:text-gray-900",
                )}
            >
                <ArrowLeftLongIcon
                    className={clsx(
                        "transition-transform duration-200 ease-in-out",
                        activeTab === "plesk" && "rotate-360",
                        activeTab === "davpanel" && "rotate-180",
                    )}
                />
            </button>
            <div
                className={clsx("relative", "w-full", "flex", "flex-shrink-0")}
            >
                <div
                    className={clsx(
                        "w-full",
                        "landing-md:w-[296px]",
                        "landing-lg:w-[396px]",
                        "p-4 landing-md:p-6",
                        activeTab !== "plesk" && "hidden landing-md:flex",
                        activeTab === "plesk" && "flex",
                        "items-center",
                        "justify-start",
                        "text-center",
                        "text-base",
                        "landing-sm:text-2xl",
                    )}
                >
                    <div
                        className={clsx(
                            "font-normal",
                            "whitespace-nowrap",
                            activeTab === "plesk" && "opacity-100",
                            activeTab !== "plesk" &&
                                "opacity-0 landing-md:opacity-100",
                            "transition-opacity",
                            "ease-in-out",
                            "duration-100",
                            "dark:text-gray-400 text-gray-700",
                        )}
                    >
                        Plesk
                    </div>
                </div>
                <div
                    className={clsx(
                        "w-px",
                        "h-full",
                        "bg-gray-200",
                        "dark:bg-gray-700",
                        "hidden",
                        "landing-md:block",
                        "flex-shrink-0",
                    )}
                />
                <div
                    className={clsx(
                        "w-full",
                        "landing-md:w-[296px]",
                        "landing-lg:w-[396px]",
                        "p-4 landing-md:p-6",
                        activeTab !== "davpanel" && "hidden landing-md:flex",
                        activeTab === "davpanel" && "flex",
                        "items-center",
                        "justify-start",
                        "text-center",
                        "text-base",
                        "landing-sm:text-2xl",
                    )}
                >
                    <div
                        className={clsx(
                            "font-semibold",
                            "whitespace-nowrap",
                            activeTab === "davpanel" && "opacity-100",
                            activeTab !== "davpanel" &&
                                "opacity-0 landing-md:opacity-100",
                            "transition-opacity",
                            "ease-in-out",
                            "duration-100",
                            "dark:text-refine-cyan-alt dark:drop-shadow-[0_0_30px_rgba(71,235,235,0.25)]",
                            "text-refine-blue drop-shadow-[0_0_30px_rgba(51,51,255,0.3)]",
                        )}
                    >
                        DavPanel Enterprise
                    </div>
                </div>
            </div>
        </div>
    );
};

const TableStickyHeader = ({ activeTab, setActiveTab }) => {
    return (
        <div
            className={clsx(
                "sticky",
                "z-[1]",
                "top-[64px]",
                "pt-4",
                "flex",
                "justify-end",
                "w-full",
                "border-b",
                "bg-gray-0",
                "dark:bg-gray-900",
                "border-b-gray-200",
                "dark:border-b-gray-700",
            )}
        >
            <div className={clsx("ml-px", "flex-1", "backdrop-blur-[3px]")} />
            <TableTabs {...{ activeTab, setActiveTab }} />
        </div>
    );
};

const TableSectionWrapper = ({ children }) => {
    return (
        <div
            className={clsx(
                "flex",
                "flex-col",
                "border-r",
                "border-b landing-sm:border-b-0",
                "border-l landing-sm:border-l-0",
                "rounded-br-2xl landing-md:rounded-br-3xl",
                "rounded-bl-2xl",
                "border-gray-200",
                "dark:border-gray-700",
            )}
        >
            {children}
        </div>
    );
};

const CheckIcon = () => {
    return (
        <CheckCircle
            className={clsx(
                "dark:text-refine-green-alt text-refine-green",
                "landing-sm:mx-auto",
            )}
        />
    );
};

const CrossIcon = () => {
    return (
        <CrossCircle className={clsx("text-gray-500", "landing-sm:mx-auto")} />
    );
};

const TableText = ({ children }) => {
    return (
        <div
            className={clsx(
                "text-start",
                "text-xs landing-sm:text-base",
                "dark:text-gray-0 text-gray-900",
            )}
        >
            {children}
        </div>
    );
};

const tableData = [
        {
        title: "Pricing",
        items: [
            {
                description: "Monthly Pricing",
                plesk: (
                    <TableText>13 - 55€/ month</TableText>
                ),
                davpanel: (
                    <TableText>14.95€ / month</TableText>
                ),
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Pricing model",
                plesk: (
                    <TableText>Per account</TableText>
                ),
                davpanel: (
                    <TableText>Per server</TableText>
                ),
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            }
        ],
    },
    {
        title: "System",
        items: [
            {
                description: "Supported OS",
                plesk: <TableText><a href="https://docs.plesk.com/release-notes/obsidian/system-requirements/" target="_blank">AlmaLinux, Ubuntu, CloudLinux, RHEL, Debian, Windows Server</a></TableText>,
                davpanel: <TableText><a href="/docs/admin/intro/#supported-os-versions">Ubuntu, Debian, AlmaLinux, Rocky Linux, Oracle Linux, CentOS Stream</a></TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Support for ARM CPUs (Aarch64)",
                plesk: <TableText>Partial (Ubuntu 22.04 only)</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "User Isolation",
                plesk: <TableText>Only with Cloudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Service Isolation",
                plesk: <TableText>Shared services (PHP, MySQL..)</TableText>,
                davpanel: <TableText>Service per user</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Kernel Updates",
                plesk: <TableText>Only with KernelCare</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
        ],
    },
    {
        title: "Webservers",
        items: [
            {
                description: "Apache",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Nginx",
                plesk: <TableText>only as a Reverse Proxy</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },            
            {
                description: "OpenLitespeed",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "OpenResty",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },

    {
        title: "Caching & Search",
        items: [
            {
                description: "Varnish Caching",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Valkey / Redis",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Memcached",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "OpenSearch / ElasticSearch",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },

    {
        title: "PHP",
        items: [
            {
                description: "Supported versions",
                plesk: <TableText>8.1 - 8.4</TableText>,
                davpanel: <TableText>5.6 - 8.5</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "PHP Selector",
                plesk: <TableText>Only with Cloudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "PHP.INI Editor",
                plesk: <TableText>Limited</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "PHP service per user",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "PHP version per domain",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
        ],
    },

    {
        title: "Podman",
        items: [
            {
                description: "Users can manage Containers",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            }, 
            {
                description: "Users can add Containers",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },
    {
        title: "Advanced",
        items: [
            {
                description: "API for every UI action",
                plesk: <TableText>Limited (legacy XML API required)</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Native MCP server for AI agents",
                plesk: <TableText>Beta extension (Linux only)</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Process Manager",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Web Terminal",
                plesk: <TableText>Per user</TableText>,
                davpanel: <TableText>Per service</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Edit webserver settings",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "View Resource Usage",
                plesk: <TableText>Only with Cloudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
        ],
    },
    {
        title: "Cron Jobs",
        items: [
            {
                description: "Format",
                plesk: <TableText>Unix</TableText>,
                davpanel: <TableText>GO</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Min Schedule",
                plesk: <TableText>Minute</TableText>,
                davpanel: <TableText>Seconds</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "No overlap",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },            
            {
                description: "Edit cron file",
                plesk: <TableText>Only with Shell enabled</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Logs",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
        ],
    },
    {
        title: "Files",
        items: [     
            {
                description: "File Manager",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Upload multiple files",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Drag & Drop Upload",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "File Editor",
                plesk: <TableText>Basic</TableText>,
                davpanel: <TableText>Monaco (VS Code), Ace, CodeMirror</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "FTP",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Malware Scanner",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Download from URL",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Disk Usage Explorer",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Inodes Explorer",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Fix Permissions",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
        ],
    },
    {
        title: "Databases",
        items: [
            {
                description: "MySQL",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "MariaDB",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Percona",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "phpMyAdmin",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "PostgreSQL",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Import Databases",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Optimize Tables",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Root Privileges",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },   
            {
                description: "Edit MySQL Configuration",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },  
            {
                description: "Manage Processes",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },         
            {
                description: "Switch MySQL to MariaDB",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },    
        ],
    },
    {
        title: "Accounts",
        items: [
            {
                description: "Account limit",
                plesk: <TableText>Tied to tier (10/30/Unlimited)</TableText>,
                davpanel: <CrossIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Multiple Administrator Accounts",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "User can change username",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Features per user",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Detailed Activity Log",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Detailed Login Log",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Add pages to favorites",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Dark Mode",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Custom message per user",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
             {
                description: "Private notes for Administrators",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Customize email templates",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
        ],
    },
    {
        title: "Domains",
        items: [
            {
                description: "Automatic SSL ",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Edit VirtualHosts file",
                plesk: <TableText>Admin only</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Change docroot",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "GoAccess",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "DNS Zone Editor",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Dynamic DNS",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Edit zone file",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "TLSA records",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Export/Import zone",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "User can reset zone",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Comments for DNS records",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Suspend Domains",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
        ],
    },
   {
        title: "Websites",
        items: [
            {
                description: "HTML Website Builder",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "WP Manager",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Temporary Domains",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Google PageSpeed monitoring",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Google Safe Browsing monitoring",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Node / Python Environment",
                plesk: <TableText>venv</TableText>,
                davpanel: <TableText>Containerized</TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
        ],
    },
    {
        title: "Emails",
        items: [
            {
                description: "Postfix",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Autologin to Webmail",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Sieve (RFC 5228) filtering",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Fail2ban",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Export Addresses",
                plesk: <TableText>Via extension/CLI</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
        ],
    },
  {
        title: "Security",
        items: [
            {
                description: "CVE Vulnerabilities",
                plesk: <TableText><a href="https://www.cve.org/CVERecord/SearchResults?query=plesk" target="_blank">150+</a></TableText>,
                davpanel: <TableText><a href="https://www.cve.org/CVERecord/SearchResults?query=davpanel">3 before 1.0 release</a></TableText>,
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Granular per-user permissions",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "2FA",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Enforce 2FA for users",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Passkeys",
                plesk: <TableText>Via extension</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "IP Blocker",
                plesk: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Coraza WAF",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Edit WAF rules per domain",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "View WAF logs per domain",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Sentinel Firewall (CSF)",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Custom ports",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },    
            {
                description: "Containerization",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Disable admin panel",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Rate-limit logins",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Manage Sessions",
                plesk: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    plesk: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },
    {
        title: "Pricing",
        items: [
            {
                description: "Price Increase (3yr)",
                plesk: <TableText>+26% in 2026 alone</TableText>,
                davpanel: <CrossIcon />,
                valueType: {
                    plesk: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Forever free tier",
                plesk: <CrossIcon />,
                davpanel: <TableText><a href="/community">Community Edition</a></TableText>,
                valueType: {
                    plesk: "icon",
                    davpanel: "text",
                },
            },
            {
                description: "Annual Pricing",
                plesk: (
                    <div className={clsx("h-full")}>
                        <TableText>Annual billing discontinued (monthly only)</TableText>
                    </div>
                ),
                davpanel: (
                    <div className={clsx("flex flex-col", "gap-6", "w-full")}>
                        <TableText>149.50€ / year (17% OFF)</TableText>
                        <EnterpriseGetInTouchButton
                            className={clsx("hidden landing-sm:block")}
                            linkClassName={clsx("w-full")}
                        />
                    </div>
                ),
                valueType: {
                    plesk: "text",
                    davpanel: "text",
                },
            },
        ],
    },
];
