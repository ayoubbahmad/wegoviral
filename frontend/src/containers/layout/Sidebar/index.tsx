"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart2,
    Users,
    Target,
    Library,
    Trophy,
    Settings,
    Zap,
    LogOut,
    Video,
    FileText,
    FolderOpen,
    Paintbrush,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/Auth";
import { useSidebarStore } from "./slice";

const navItems = [
    { name: "Home", href: "/home", icon: LayoutDashboard },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Scripts", href: "/scripts", icon: FileText },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Performance", href: "/performance", icon: BarChart2 },
    { name: "Community", href: "/community", icon: Users },
    { name: "Competitors", href: "/competitors", icon: Target },
    { name: "Library", href: "/library", icon: Library },
    { name: "Challenges", href: "/challenges", icon: Trophy },
    { name: "Design System", href: "/design-system", icon: Paintbrush },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { sidebarCollapsed, toggleSidebar } = useSidebarStore();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex h-16 items-center px-4 border-b border-border/50 justify-between">
                <div className="flex items-center">
                    <div className="p-1.5 bg-primary rounded-md shrink-0">
                        <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {!sidebarCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-3 text-xl font-bold tracking-tight whitespace-nowrap"
                        >
                            Creator OS
                        </motion.span>
                    )}
                </div>
                {!sidebarCollapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
                {sidebarCollapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-20 p-1 bg-primary text-primary-foreground rounded-full border border-border shadow-lg z-50 hover:scale-110 transition-transform"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer justify-center md:justify-start",
                                isActive
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                                sidebarCollapsed && "px-0 justify-center"
                            )}
                            title={sidebarCollapsed ? item.name : ""}
                        >
                            <AnimatePresence mode="wait">
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-bg"
                                        className="absolute inset-0 bg-primary rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </AnimatePresence>

                            <Icon className={cn("w-5 h-5 relative z-10 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            {!sidebarCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="relative z-10 whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
                {user && (
                    <div className={cn(
                        "p-3 rounded-xl bg-secondary/50 border border-border flex items-center gap-3",
                        sidebarCollapsed && "px-1 justify-center border-none bg-transparent"
                    )}>
                        <img
                            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border border-border shrink-0"
                        />
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </motion.div>
                        )}
                        {!sidebarCollapsed && (
                            <button
                                onClick={logout}
                                className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors",
                        sidebarCollapsed && "px-0 justify-center"
                    )}
                    title={sidebarCollapsed ? "Settings" : ""}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {!sidebarCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            Settings
                        </motion.span>
                    )}
                </Link>
            </div>
        </aside>
    );
}
