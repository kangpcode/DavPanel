import React, { useState } from "react";
import clsx from "clsx";

import { CheckCircle } from "@site/src/refine-theme/icons/check-circle";
import { CrossCircle } from "@site/src/refine-theme/icons/cross-circle";
import { EnterpriseGetInTouchButton } from "./enterprise-get-in-touch-button";
import { ArrowLeftLongIcon } from "./icons/arrow-left-long";
import { AnimatePresence, motion } from "framer-motion";

export const EnterpriseTable = ({ className }: { className?: string }) => {
    const [activeTab, setActiveTab] = useState<"cloudpanel" | "davpanel">(
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
                    Compare CloudPanel VS DavPanel
                </h2>
            </div>

            <div className={clsx("w-full", "pb-8", "relative")}>
                <AnimatePresence exitBeforeEnter>
                    <motion.div
                        key={activeTab}
                        initial={{
                            opacity: 0,
                            x: activeTab === "cloudpanel" ? "-100%" : "100%",
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x: activeTab === "cloudpanel" ? "-100%" : "100%",
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
                            setActiveTab={(tab: "cloudpanel" | "davpanel") => {
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
    cloudpanel,
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
                        activeTab !== "cloudpanel" && "hidden landing-md:flex",
                        activeTab === "cloudpanel" && "flex",
                    )}
                >
                    {cloudpanel}
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
    cloudpanel,
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
                    {...{ cloudpanel, davpanel, activeTab, isLast, valueType }}
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
                        if (prev === "cloudpanel") return "davpanel";
                        return "cloudpanel";
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
                    activeTab === "cloudpanel" &&
                        "bg-refine-blue dark:bg-refine-cyan-alt text-gray-0 dark:text-gray-900",
                )}
            >
                <ArrowLeftLongIcon
                    className={clsx(
                        "transition-transform duration-200 ease-in-out",
                        activeTab === "cloudpanel" && "rotate-360",
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
                        activeTab !== "cloudpanel" && "hidden landing-md:flex",
                        activeTab === "cloudpanel" && "flex",
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
                            activeTab === "cloudpanel" && "opacity-100",
                            activeTab !== "cloudpanel" &&
                                "opacity-0 landing-md:opacity-100",
                            "transition-opacity",
                            "ease-in-out",
                            "duration-100",
                            "dark:text-gray-400 text-gray-700",
                        )}
                    >
                        CloudPanel
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
                cloudpanel: (
                    <TableText>26 - 60€/ month</TableText>
                ),
                davpanel: (
                    <TableText>14.95€ / month</TableText>
                ),
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Pricing model",
                cloudpanel: (
                    <TableText>Per account</TableText>
                ),
                davpanel: (
                    <TableText>Per server</TableText>
                ),
                valueType: {
                    cloudpanel: "text",
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
                cloudpanel: <TableText><a href="https://docs.cloudpanel.net/installation-guide/system-requirements/" target="_blank">AlmaLinux 8,9,10 Ubuntu 22 Cloudlinux 7,8,9 RockyLinux 8,9</a></TableText>,
                davpanel: <TableText><a href="/docs/admin/intro/#supported-os-versions">Ubuntu, Debian, AlmaLinux, Rocky Linux, Oracle Linux, CentOS Stream</a></TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Support for ARM CPUs (Aarch64)",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "User Isolation",
                cloudpanel: <TableText>Only with Cloudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Service Isolation",
                cloudpanel: <TableText>Shared services (PHP, MySQL..)</TableText>,
                davpanel: <TableText>Service per user</TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Kernel Updates",
                cloudpanel: <TableText>Only with KernelCare</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
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
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Nginx",
                cloudpanel: <TableText>only as a Reverse Proxy</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "icon",
                },
            },            
            {
                description: "OpenLitespeed",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "OpenResty",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Redis",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Memcached",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },         
            {
                description: "OpenSearch",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "ElasticSearch",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <TableText>8.1 - 8.4</TableText>,
                davpanel: <TableText>5.6 - 8.5</TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "PHP Selector",
                cloudpanel: <TableText>Only with Cloudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "PHP.INI Editor",
                cloudpanel: <TableText>Limited</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "icon",
                },
            },         
            {
                description: "PHP service per user",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            }, 
            {
                description: "Users can add Containers",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },
    {
        title: "Advanced",
        items: [
            {
                description: "Process Manager",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Web Terminal",
                cloudpanel: <TableText>Per user</TableText>,
                davpanel: <TableText>Per service</TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },         
            {
                description: "Edit webserver settings",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "View Resource Usage",
                cloudpanel: <TableText>Only with CLoudlinux</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
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
                cloudpanel: <TableText>Unix</TableText>,
                davpanel: <TableText>GO</TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "Min Schedule",
                cloudpanel: <TableText>Minute</TableText>,
                davpanel: <TableText>Seconds</TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "No overlap",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },            
            {
                description: "Edit cron file",
                cloudpanel: <TableText>Only with Shell enabled</TableText>,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "icon",
                },
            },
            {
                description: "Logs",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Upload multiple files",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Drag&Drop Uploads",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "File Editor",
                cloudpanel: <TableText>Basic</TableText>,
                davpanel: <TableText><a href="https://microsoft.github.io/monaco-editor/">Monaco (VS Code) Editor</a></TableText>,
                valueType: {
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
            {
                description: "FTP",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Malware Scanner",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Download from URL",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Disk Usage Explorer",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Inodes Explorer",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Fix Permissions",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "MariaDB",
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Percona",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "phpMyAdmin",
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "PostgreSQL",
                cloudpanel: <CheckIcon />,
                davpanel: <TableText>BETA</TableText>,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "text",
                },
            },
            {
                description: "Import Databases",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Root Privileges",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },   
            {
                description: "Edit MySQL Configuration",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },  
            {
                description: "Manage Processes",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },         
            {
                description: "Switch MySQL to MariaDB",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },    
        ],
    },
    {
        title: "Accounts",
        items: [
            {
                description: "Administrator Accounts",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "User can change username",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Features per user",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Detailed Activity Log",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Detailed Login Log",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Add pages to favorites",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Dark Mode",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Custom message per user",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
             {
                description: "Customize email templates",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },    
        ],
    },
    {
        title: "Domains",
        items: [
            {
                description: "Edit WAF rules per domain",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "View WAF logs per domain",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },  
            {
                description: ".onion Domains",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Suspend Domains",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
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
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "WP Manager",
                cloudpanel: <CheckIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Temporary Domains",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Node / Python Enviroment",
                cloudpanel: <TableText>venv</TableText>,
                davpanel: <TableText>Containerized</TableText>,
                valueType: {
                    cloudpanel: "text",
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
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Sieve (RFC 5228) filtering",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Fail2ban",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },  
        ],
    },   
  {
        title: "Security",
        items: [
            {
                description: "Coraza WAF",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Sentinel Firewall (CSF)",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Custom ports",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },    
            {
                description: "Containerization",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Disable admin panel",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Rate-limit logins",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            },
            {
                description: "Manage Sessions",
                cloudpanel: <CrossIcon />,
                davpanel: <CheckIcon />,
                valueType: {
                    cloudpanel: "icon",
                    davpanel: "icon",
                },
            }
        ],
    },
    {
        title: "Pricing",
        items: [
            {
                description: "Yearly Pricing",
                cloudpanel: (
                    <div className={clsx("h-full")}>
                        <TableText>312 - 720€ / year</TableText>
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
                    cloudpanel: "text",
                    davpanel: "text",
                },
            },
        ],
    },
];
