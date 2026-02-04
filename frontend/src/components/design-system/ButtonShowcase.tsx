'use client';

import { Plus, Play, MoreHorizontal, ArrowRight, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonShowcase() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Core Variants</p>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-3 flex flex-col items-center">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                            <Plus className="w-3.5 h-3.5 fill-current" /> Primary Action
                        </button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Primary</p>
                    </div>
                    
                    <div className="space-y-3 flex flex-col items-center">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary border border-border/50 text-foreground font-bold text-xs hover:bg-secondary/80 transition-all active:scale-95 leading-none">
                            Secondary Action
                        </button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Secondary</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all active:scale-95">
                            Ghost Accent
                        </button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Accent Subtle</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Icon & Special Stats</p>
                <div className="flex flex-wrap items-center gap-8">
                    <div className="space-y-3 flex flex-col items-center">
                        <button className="p-3 rounded-2xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Icon Square</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <button className="p-4 rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-all shadow-xl shadow-primary/30">
                            <Play className="w-6 h-6 fill-current" />
                        </button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Floating Action</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-2xl border border-border/30">
                            <button className="px-4 py-2 rounded-xl bg-card text-primary shadow-sm text-[10px] font-black uppercase tracking-widest">Active</button>
                            <button className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest">Inactive</button>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Toggle Switch</p>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 bg-gradient-to-br from-card to-secondary/30">
                 <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-6">Nav Links</p>
                 <div className="flex flex-wrap gap-8 items-center border border-dashed border-border/50 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group cursor-pointer">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-all" /> Back Navigation
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Zap className="w-3.5 h-3.5" /> Feature Badge
                    </div>
                 </div>
            </div>
        </div>
    );
}
