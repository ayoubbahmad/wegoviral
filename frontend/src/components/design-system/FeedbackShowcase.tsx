'use client';

import { Check, Info, AlertTriangle, X, Loader2, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackShowcase() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Badges & Alerts</p>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                        <Check className="w-3 h-3" /> Success
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                        <Info className="w-3 h-3" /> Information
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                        <AlertTriangle className="w-3 h-3" /> Warning
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                        <X className="w-3 h-3" /> Error
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Processing States</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] border border-border/50 bg-secondary/20 flex items-center justify-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic animate-pulse">Analyzing Workflow...</p>
                    </div>

                    <div className="p-8 rounded-[2rem] border border-primary/20 bg-primary/5 flex items-center justify-center gap-4 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                         <Sparkles className="w-6 h-6 text-primary" />
                         <p className="text-sm font-black text-primary uppercase tracking-[0.2em]">Optimizing Results</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Modal Patterns</p>
                <div className="max-w-md p-8 rounded-[2.5rem] bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <button className="p-2 rounded-xl hover:bg-secondary transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase italic">Confirm Action</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">This action will permanently synchronize your data across all connected channels. This cannot be undone.</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                        <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Cancel</button>
                        <button className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Execute Sync</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
