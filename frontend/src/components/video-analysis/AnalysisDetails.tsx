import { Anchor, Layout, Palette, ChevronDown } from "lucide-react";

interface AnalysisItemProps {
  title: string;
  type: string;
  description: string;
  bullets?: string[];
  icon: React.ElementType;
  iconColor: string;
}

function AnalysisCard({ title, type, description, bullets, icon: Icon, iconColor }: AnalysisItemProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/50 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className={`text-lg font-bold ${iconColor}`}>{title} Analysis</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider opacity-60">Type</div>
          <div className="text-sm font-semibold">{type}</div>
        </div>

        <div>
          <div className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider opacity-60">Description</div>
          <p className="text-sm leading-relaxed text-muted-foreground font-medium">{description}</p>
        </div>

        {bullets && (
          <div>
            <div className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider opacity-60">
              {title === "Style" ? "Attributes" : "Frameworks"}
            </div>
            <div className="space-y-2">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span className="font-medium">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalysisDetails() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <AnalysisCard 
        id="hook"
        title="Hook"
        icon={Anchor}
        iconColor="text-blue-500"
        type="Secret Reveal"
        description="Suggests unknown insight or future implication that the viewer doesn't know but would inform what is happening. Teases a feeling that the speaker knows something the viewer doesn't."
        bullets={[
          '"X is going to change Y"',
          '"Nobody is aware that X is happening, but I think it might change Y"'
        ]}
      />
      <AnalysisCard 
        id="structure"
        title="Structure"
        icon={Layout}
        iconColor="text-purple-500"
        type="Breakdown"
        description="Explains the foundational principles and building blocks of a topic. Useful for identifying and investigating the core elements of a larger topic."
        bullets={[
            "Foundational principles",
            "Identifies core elements",
            "Investigative approach"
        ]}
      />
      <AnalysisCard 
        id="style"
        title="Style"
        icon={Palette}
        iconColor="text-amber-500"
        type="Educational/Instructive"
        description="Professional and authoritative delivery designed to foster trust and establish expertise in a specific niche."
        bullets={[
            "Tone: High energy and enthusiasm",
            "Voice: Confident and commanding",
            "Pacing: Rapid-fire delivery"
        ]}
      />
    </div>
  );
}
