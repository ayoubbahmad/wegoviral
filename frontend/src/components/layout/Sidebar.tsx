"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Users,
    Video,
    FileText,
    Folder,
    Archive,
    Download,
    Settings,
    LogOut,
    HelpCircle,
    MessageSquare,
    History,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

const mainNavItems = [
    { name: "Home", href: "/overview", icon: LayoutGrid },
    { name: "Channels", href: "/channels", icon: Users },
    { name: "Videos", href: "/videos", icon: Video },
    { name: "Scripts", href: "/scripts", icon: FileText },
    { name: "Projects", href: "/projects", icon: Folder },
    { name: "Vault", href: "/vault", icon: Archive },
    { name: "Exports", href: "/exports", icon: Download },
    { name: "Settings", href: "/settings", icon: Settings },
];

const bottomNavItems = [
    { name: "Changelog", href: "/changelog", icon: History },
    { name: "Share feedback", href: "/feedback", icon: MessageSquare },
    { name: "Get support", href: "/support", icon: HelpCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
            <div className="flex h-16 items-center px-6 border-b border-border/50">
                <div className="p-1.5 bg-primary rounded-md mr-3">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">Sandcastles</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="flex flex-col gap-1">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground hover:bg-muted/50",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-y-1 -left-1 w-1 rounded-r-md bg-primary" />
                                )}
                                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 mt-auto space-y-1 border-t border-border/50 bg-card/30">
                 {/* Upgrade Card Placeholder matching screenshot style if needed, skipping for now to focus on nav */}
                 
                {bottomNavItems.map((item) => {
                     const Icon = item.icon;
                     return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                        </Link>
                     )
                })}

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}
