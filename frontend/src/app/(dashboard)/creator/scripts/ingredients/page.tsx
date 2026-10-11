'use client';

import { 
  ArrowLeft, 
  Lightbulb, 
  BarChart3, 
  Anchor, 
  Palette, 
  Video, 
  Image as ImageIcon, 
  Music,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const INGREDIENTS = [
  {
    name: "Topic",
    description: "The core subject of your video. What is it actually about? Be specific.",
    icon: Lightbulb,
    color: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/20"
  },
  {
    name: "Angle",
    description: "The unique perspective or 'hook' you use to approach the topic. Why should someone care?",
    icon: BarChart3,
    color: "bg-purple-500/10 text-purple-500",
    border: "border-purple-500/20"
  },
  {
    name: "Hook Format",
    description: "The visual and verbal structure used in the first 3 seconds to grab attention.",
    icon: Anchor,
    color: "bg-pink-500/10 text-pink-500",
    border: "border-pink-500/20"
  },
  {
    name: "Story Format / Style",
    description: "The overall narrative structure: listicle, tutorial, case study, or problem/solution.",
    icon: Palette,
    color: "bg-orange-500/10 text-orange-500",
    border: "border-orange-500/20"
  },
  {
    name: "Visual Format",
    description: "The primary way you deliver the information visually: A-roll, B-roll heavy, or graphics-led.",
    icon: Video,
    color: "bg-green-500/10 text-green-500",
    border: "border-green-500/20"
  },
  {
    name: "Visuals",
    description: "Specific visual elements: text overlays, stock footage, or custom animations.",
    icon: ImageIcon,
    color: "bg-cyan-500/10 text-cyan-500",
    border: "border-cyan-500/20"
  },
  {
    name: "Audio",
    description: "The soundscape: music choice, sound effects, and voiceover tone.",
    icon: Music,
    color: "bg-red-500/10 text-red-500",
    border: "border-red-500/20"
  }
];

export default function ScriptingIngredientsPage() {
  return (
    <div className="space-y-12 pb-32 pt-8">
      <Link 
        href="/creator/scripts" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Writer
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">The 7 Core Variables</h1>
        <p className="text-muted-foreground text-lg font-medium">
          Master these 7 ingredients to create viral scripts every single time.
        </p>
      </div>

      <div className="space-y-4">
        {INGREDIENTS.map((ingredient, index) => (
          <div 
            key={ingredient.name}
            className={`flex items-start gap-6 p-6 rounded-3xl border ${ingredient.border} bg-card/30 hover:bg-card/50 transition-all group`}
          >
            <div className={`p-4 rounded-2xl ${ingredient.color} shrink-0 group-hover:scale-110 transition-transform`}>
              <ingredient.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Variable 0{index + 1}</span>
                <h2 className="text-lg font-bold text-foreground">{ingredient.name}</h2>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[32px] border border-yellow-500/20 bg-yellow-500/5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 opacity-10">
           <Zap className="w-24 h-24 text-yellow-500" />
        </div>
        <div className="flex items-center gap-3 text-yellow-500">
           <Zap className="w-5 h-5 fill-yellow-500" />
           <h3 className="font-black uppercase tracking-widest text-sm">Pro Tip: The Synergistic Effect</h3>
        </div>
        <p className="text-yellow-500/80 text-sm font-medium leading-[1.8] relative z-10">
          A great script isn't just one variable done right — it's the harmony between all seven. When your Topic matches the Angle, and your Visuals reinforce the Audio, retention skyrockets. Use this checklist as a final pass for every script you generate.
        </p>
      </div>
    </div>
  );
}
