"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/provider";
import { useCan } from "@/providers/Auth";
import { SPACES, SPACE_LIST, type SpaceId } from "./spaces";

interface SpaceSwitcherProps {
    activeSpace: SpaceId;
    collapsed: boolean;
}

export function SpaceSwitcher({ activeSpace, collapsed }: SpaceSwitcherProps) {
    const router = useRouter();
    const can = useCan();
    const t = useT();
    const availableSpaces = SPACE_LIST.filter((space) => !space.requires || can(space.requires));
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const current = SPACES[activeSpace];
    const CurrentIcon = current.icon;

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleSelect = (spaceId: SpaceId) => {
        setIsOpen(false);
        if (spaceId !== activeSpace) router.push(SPACES[spaceId].defaultHref);
    };

    return (
        <div ref={containerRef} className="relative min-w-0">
            <button
                onClick={() => setIsOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                title={collapsed ? t('nav.switchSpace', { space: t(`nav.spaces.${current.id}.label`) }) : undefined}
                className={cn(
                    "flex items-center gap-3 rounded-xl p-1 pe-2 text-start hover:bg-secondary/50 transition-colors min-w-0",
                    collapsed && "pe-1"
                )}
            >
                <div className="p-1.5 bg-primary rounded-lg shrink-0 shadow-lg shadow-primary/20">
                    <CurrentIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 min-w-0"
                    >
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mb-1">
                                WeGoViral
                            </p>
                            <p className="text-sm font-bold tracking-tight truncate leading-none">
                                {t(`nav.spaces.${current.id}.label`)}
                            </p>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </motion.div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 w-64 rounded-xl border border-border bg-card p-1.5 shadow-2xl",
                            collapsed ? "start-full top-0 ms-3" : "start-0 top-full mt-2"
                        )}
                    >
                        <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {t('nav.switchSpaceTitle')}
                        </p>
                        {availableSpaces.map((space) => {
                            const Icon = space.icon;
                            const isActive = space.id === activeSpace;

                            return (
                                <button
                                    key={space.id}
                                    role="menuitem"
                                    onClick={() => handleSelect(space.id)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start transition-colors",
                                        isActive ? "bg-secondary/70" : "hover:bg-secondary/50"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg shrink-0",
                                        isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{t(`nav.spaces.${space.id}.label`)}</p>
                                        <p className="text-xs text-muted-foreground truncate">{t(`nav.spaces.${space.id}.description`)}</p>
                                    </div>
                                    {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
