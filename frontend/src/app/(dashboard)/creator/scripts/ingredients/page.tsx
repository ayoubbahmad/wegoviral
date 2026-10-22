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
import { useT } from '@/i18n/provider';

const INGREDIENTS = [
  { id: 'topic', icon: Lightbulb, color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20' },
  { id: 'angle', icon: BarChart3, color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20' },
  { id: 'hook', icon: Anchor, color: 'bg-pink-500/10 text-pink-500', border: 'border-pink-500/20' },
  { id: 'story', icon: Palette, color: 'bg-orange-500/10 text-orange-500', border: 'border-orange-500/20' },
  { id: 'visualFormat', icon: Video, color: 'bg-green-500/10 text-green-500', border: 'border-green-500/20' },
  { id: 'visuals', icon: ImageIcon, color: 'bg-cyan-500/10 text-cyan-500', border: 'border-cyan-500/20' },
  { id: 'audio', icon: Music, color: 'bg-red-500/10 text-red-500', border: 'border-red-500/20' },
] as const;

export default function ScriptingIngredientsPage() {
  const t = useT();
  return (
    <div className="space-y-12 pb-32 pt-8">
      <Link 
        href="/creator/scripts" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t("creator.ingredients.back")}
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t("creator.ingredients.title")}</h1>
        <p className="text-muted-foreground text-lg font-medium">
          {t("creator.ingredients.description")}
        </p>
      </div>

      <div className="space-y-4">
        {INGREDIENTS.map((ingredient, index) => (
          <div 
            key={ingredient.id}
            className={`flex items-start gap-6 p-6 rounded-3xl border ${ingredient.border} bg-card/30 hover:bg-card/50 transition-all group`}
          >
            <div className={`p-4 rounded-2xl ${ingredient.color} shrink-0 group-hover:scale-110 transition-transform`}>
              <ingredient.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">{t("creator.ingredients.variable", { number: `0${index + 1}` })}</span>
                <h2 className="text-lg font-bold text-foreground">{t(`creator.ingredients.items.${ingredient.id}.name`)}</h2>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {t(`creator.ingredients.items.${ingredient.id}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[32px] border border-yellow-500/20 bg-yellow-500/5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 end-0 p-12 -me-8 -mt-8 opacity-10">
           <Zap className="w-24 h-24 text-yellow-500" />
        </div>
        <div className="flex items-center gap-3 text-yellow-500">
           <Zap className="w-5 h-5 fill-yellow-500" />
           <h3 className="font-black uppercase tracking-widest text-sm">{t("creator.ingredients.tipTitle")}</h3>
        </div>
        <p className="text-yellow-500/80 text-sm font-medium leading-[1.8] relative z-10">
          {t("creator.ingredients.tipBody")}
        </p>
      </div>
    </div>
  );
}
