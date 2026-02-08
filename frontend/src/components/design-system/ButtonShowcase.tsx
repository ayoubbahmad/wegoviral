'use client';

import { Plus, Play, MoreHorizontal, ArrowRight, Zap } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function ButtonShowcase() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Core Variants</p>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-3 flex flex-col items-center">
                        <Button variant="pill" size="lg" hoverScale>
                            <Plus className="w-3.5 h-3.5 fill-current" /> Primary Action
                        </Button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Primary / Rounded</p>
                    </div>
                    
                    <div className="space-y-3 flex flex-col items-center">
                        <Button variant="secondary" size="md">
                            Secondary Action
                        </Button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Secondary</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <Button variant="outline" className="px-6 py-3 text-primary bg-primary/5 hover:bg-primary/10 border-primary/20">
                            Custom Outline
                        </Button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Accent Subtle</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Icon & Special States</p>
                <div className="flex flex-wrap items-center gap-8">
                    <div className="space-y-3 flex flex-col items-center">
                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-lg">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Icon Square</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <Button variant="floating" hoverScale>
                            <Play className="w-6 h-6 fill-current" />
                        </Button>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Floating Action</p>
                    </div>

                    <div className="space-y-3 flex flex-col items-center">
                        <Card padding="none" variant="secondary" className="flex items-center gap-1 p-1 rounded-xl">
                            <Button variant="primary" size="sm" className="rounded-lg shadow-none">Active</Button>
                            <Button variant="ghost" size="sm" className="rounded-lg">Inactive</Button>
                        </Card>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">Toggle Switch</p>
                    </div>
                </div>
            </div>

            <Card variant="default" className="p-8 bg-gradient-to-br from-card to-secondary/30">
                 <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-6">Nav Links</p>
                 <div className="flex flex-wrap gap-8 items-center border border-dashed border-border/50 p-6 rounded-2xl">
                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-all" /> Back Navigation
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Zap className="w-3.5 h-3.5" /> Feature Badge
                    </div>
                 </div>
            </Card>
        </div>
    );
}
