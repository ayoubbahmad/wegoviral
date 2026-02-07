'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Palette, Type, MousePointer2, Layout, BellRing, Sparkles } from "lucide-react";
import { ColorShowcase } from "./ColorShowcase";
import { TypographyShowcase } from "./TypographyShowcase";
import { ButtonShowcase } from "./ButtonShowcase";
import { CardShowcase } from "./CardShowcase";
import { FeedbackShowcase } from "./FeedbackShowcase";
import { Tabs } from "../ui/Tabs";

const SECTIONS = [
    { id: 'colors', label: 'Colors', icon: Palette, component: ColorShowcase },
    { id: 'typography', label: 'Typography', icon: Type, component: TypographyShowcase },
    { id: 'buttons', label: 'Buttons', icon: MousePointer2, component: ButtonShowcase },
    { id: 'cards', label: 'Cards', icon: Layout, component: CardShowcase },
    { id: 'feedback', label: 'Feedback', icon: BellRing, component: FeedbackShowcase },
];

export function DesignSystemShowcase() {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || ColorShowcase;

    return (
        <div className="space-y-12">
            {/* Intro */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
                <p className="text-muted-foreground">
                    Our consolidated design language for CreatorOS. Consistently premium, high-contrast, and glassmorphic.
                </p>
            </div>

            {/* Navigation */}
            <Tabs 
                items={SECTIONS}
                activeId={activeSection}
                onChange={setActiveSection}
                sticky
            />

            {/* Content Area */}
            <div className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ActiveComponent />
            </div>

            {/* Rules / Specs */}
            <div className="p-12 rounded-[3rem] border border-dashed border-border/50 bg-secondary/10 space-y-6">
                <h2 className="text-xl font-black text-foreground uppercase italic tracking-tight">System Specification</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Border Radius</p>
                        <p className="text-sm font-medium text-muted-foreground">Main containers: 3.5rem (56px) / 2.5rem (40px). Components: 1.5rem (24px) / 1rem (16px).</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Spacing Scale</p>
                        <p className="text-sm font-medium text-muted-foreground">Standardized on Tailwind's 4px grid. Layout gaps: 12 (48px) / 10 (40px). Component padding: 6 (24px).</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Visual Depth</p>
                        <p className="text-sm font-medium text-muted-foreground">Layering achieved via `bg-card/30`, `backdrop-blur-md`, and 1px `border-border/50` strokes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
