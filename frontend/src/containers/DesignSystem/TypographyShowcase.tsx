'use client';

export function TypographyShowcase() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Headings</p>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Page Headline</h1>
                        <p className="text-xs text-muted-foreground font-mono">text-4xl font-bold tracking-tight</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Section Heading</h2>
                        <p className="text-xs text-muted-foreground font-mono">text-2xl font-bold tracking-tight</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">Module Header</h3>
                        <p className="text-xs text-muted-foreground font-mono">text-lg font-bold text-foreground</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Body & UI Text</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-base text-foreground leading-relaxed">
                                Standard body text for descriptions and long reading content. This uses a readable line-height and optimized letter spacing.
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">text-base text-foreground leading-relaxed</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground leading-snug">
                                Secondary text used for metadata, smaller descriptions, and UI labels that need to be less prominent.
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">text-sm font-medium text-muted-foreground</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-widest text-primary">Accent UI Labels</p>
                            <p className="text-xs text-muted-foreground font-mono">text-xs font-black uppercase tracking-widest</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tiny Metadata Overlays</p>
                            <p className="text-xs text-muted-foreground font-mono">text-[10px] font-black uppercase tracking-[0.2em]</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
