'use client';

import { cn } from "@/lib/utils";

const COLORS = [
    { name: "Background", var: "var(--background)", desc: "Main app background" },
    { name: "Foreground", var: "var(--foreground)", desc: "Main text color" },
    { name: "Card", var: "var(--card)", desc: "Card and container backgrounds" },
    { name: "Primary", var: "var(--primary)", desc: "Main action and accent color" },
    { name: "Primary Foreground", var: "var(--primary-foreground)", desc: "Text on primary background" },
    { name: "Secondary", var: "var(--secondary)", desc: "Subtle backgrounds and secondary actions" },
    { name: "Muted Foreground", var: "var(--muted-foreground)", desc: "Dimmed text and secondary labels" },
    { name: "Border", var: "var(--border)", desc: "Border and divider color" },
];

export function ColorShowcase() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLORS.map((color) => (
                    <div key={color.name} className="space-y-3">
                        <div 
                            className="h-32 rounded-3xl border border-border/50 shadow-inner"
                            style={{ backgroundColor: color.var }}
                        />
                        <div className="px-2">
                            <p className="text-sm font-bold text-foreground">{color.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{color.var}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{color.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-primary/20">
                <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Gradients & Blurs</p>
                <div className="flex flex-wrap gap-8">
                    <div className="space-y-3">
                        <div className="w-24 h-24 rounded-full bg-primary blur-3xl opacity-20" />
                        <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">Primary Glow</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-24 h-24 rounded-full bg-purple-500 blur-3xl opacity-20" />
                        <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">Accent Glow</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-48 h-24 rounded-3xl bg-gradient-to-r from-primary to-purple-500 border border-white/10" />
                        <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">Primary Spread</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
