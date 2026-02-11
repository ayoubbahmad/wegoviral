import { Anchor, Layout, Palette } from 'lucide-react';
import { Badge } from '@/components/Badge';

interface AnalysisItemProps {
  title: string;
  type: string;
  description: string;
  bullets?: string[];
  icon: React.ElementType;
  iconColor: string;
}

function AnalysisCard({
  title,
  type,
  description,
  bullets,
  icon: Icon,
  iconColor,
}: AnalysisItemProps) {
  return (
    <div className='p-8 rounded-3xl bg-card/30 border border-border shadow-sm hover:border-primary/50 transition-all'>
      <div className='flex items-center gap-2 mb-6'>
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3
          className={`text-xl font-bold tracking-tight uppercase ${iconColor}`}
        >
          {title} Analysis
        </h3>
      </div>

      <div className='space-y-6'>
        <div>
          <div className='text-xs font-black text-foreground mb-2 uppercase tracking-widest opacity-60'>
            Type
          </div>
          <Badge variant='secondary' shape='pill'>
            {type}
          </Badge>
        </div>

        <div>
          <div className='text-xs font-black text-foreground mb-2 uppercase tracking-widest opacity-60'>
            Description
          </div>
          <p className='text-sm leading-[1.8] text-muted-foreground font-medium'>
            {description}
          </p>
        </div>

        {bullets && (
          <div>
            <div className='text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-60'>
              {title === 'Style' ? 'Attributes' : 'Frameworks'}
            </div>
            <div className='space-y-3'>
              {bullets.map((bullet, i) => (
                <div
                  key={i}
                  className='flex gap-3 text-sm text-muted-foreground border-l-2 border-primary/20 pl-4 py-1'
                >
                  <span className='font-medium'>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HookAnalysis({ analysis }: { analysis?: any }) {
  return (
    <AnalysisCard
      title='Hook'
      icon={Anchor}
      iconColor='text-blue-500'
      type={analysis?.type || 'Secret Reveal'}
      description={
        analysis?.description ||
        "Suggests unknown insight or future implication that the viewer doesn't know but would inform what is happening."
      }
      bullets={analysis?.bullets || ['Hook line 1', 'Hook line 2']}
    />
  );
}

export function StructureAnalysis({ analysis }: { analysis?: any }) {
  return (
    <AnalysisCard
      title='Structure'
      icon={Layout}
      iconColor='text-purple-500'
      type={analysis?.type || 'Breakdown'}
      description={
        analysis?.description ||
        'Explains the foundational principles and building blocks of a topic.'
      }
      bullets={analysis?.bullets || ['Point 1', 'Point 2']}
    />
  );
}

export function StyleAnalysis({ analysis }: { analysis?: any }) {
  return (
    <AnalysisCard
      title='Style'
      icon={Palette}
      iconColor='text-amber-500'
      type={analysis?.type || 'Educational/Instructive'}
      description={
        analysis?.description ||
        'Professional and authoritative delivery designed to foster trust and establish expertise.'
      }
      bullets={analysis?.bullets || ['Tone: Professional', 'Pacing: Steady']}
    />
  );
}
