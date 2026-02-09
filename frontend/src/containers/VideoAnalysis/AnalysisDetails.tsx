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

export function HookAnalysis() {
  return (
    <AnalysisCard
      title='Hook'
      icon={Anchor}
      iconColor='text-blue-500'
      type='Secret Reveal'
      description="Suggests unknown insight or future implication that the viewer doesn't know but would inform what is happening. Teases a feeling that the speaker knows something the viewer doesn't."
      bullets={[
        '"X is going to change Y"',
        '"Nobody is aware that X is happening, but I think it might change Y"',
      ]}
    />
  );
}

export function StructureAnalysis() {
  return (
    <AnalysisCard
      title='Structure'
      icon={Layout}
      iconColor='text-purple-500'
      type='Breakdown'
      description='Explains the foundational principles and building blocks of a topic. Useful for identifying and investigating the core elements of a larger topic.'
      bullets={[
        'Foundational principles',
        'Identifies core elements',
        'Investigative approach',
      ]}
    />
  );
}

export function StyleAnalysis() {
  return (
    <AnalysisCard
      title='Style'
      icon={Palette}
      iconColor='text-amber-500'
      type='Educational/Instructive'
      description='Professional and authoritative delivery designed to foster trust and establish expertise in a specific niche.'
      bullets={[
        'Tone: High energy and enthusiasm',
        'Voice: Confident and commanding',
        'Pacing: Rapid-fire delivery',
      ]}
    />
  );
}
