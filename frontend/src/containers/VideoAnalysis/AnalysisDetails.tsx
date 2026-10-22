import { Anchor, Layout, Palette } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { useT } from '@/i18n/provider';

interface AnalysisItemProps {
  title: string;
  bulletsLabel: string;
  type: string;
  description: string;
  bullets?: string[];
  icon: React.ElementType;
  iconColor: string;
}

function AnalysisCard({
  title,
  bulletsLabel,
  type,
  description,
  bullets,
  icon: Icon,
  iconColor,
}: AnalysisItemProps) {
  const t = useT();
  return (
    <div className='p-8 rounded-3xl bg-card/30 border border-border shadow-sm hover:border-primary/50 transition-all'>
      <div className='flex items-center gap-2 mb-6'>
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3
          className={`text-xl font-bold tracking-tight uppercase ${iconColor}`}
        >
          {title}
        </h3>
      </div>

      <div className='space-y-6'>
        <div>
          <div className='text-xs font-black text-foreground mb-2 uppercase tracking-widest opacity-60'>
            {t('creator.video.type')}
          </div>
          <Badge variant='secondary' shape='pill'>
            {type}
          </Badge>
        </div>

        <div>
          <div className='text-xs font-black text-foreground mb-2 uppercase tracking-widest opacity-60'>
            {t('creator.video.descriptionLabel')}
          </div>
          <p className='text-sm leading-[1.8] text-muted-foreground font-medium'>
            {description}
          </p>
        </div>

        {bullets && (
          <div>
            <div className='text-xs font-black text-foreground mb-3 uppercase tracking-widest opacity-60'>
              {bulletsLabel}
            </div>
            <div className='space-y-3'>
              {bullets.map((bullet, i) => (
                <div
                  key={i}
                  className='flex gap-3 text-sm text-muted-foreground border-s-2 border-primary/20 ps-4 py-1'
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
  const t = useT();
  return (
    <AnalysisCard
      title={t('creator.video.hookAnalysis')}
      bulletsLabel={t('creator.video.frameworks')}
      icon={Anchor}
      iconColor='text-blue-500'
      type={analysis?.type || t('creator.video.samples.hookType')}
      description={
        analysis?.description ||
        t('creator.video.samples.hookBody')
      }
      bullets={analysis?.bullets || [t('creator.video.samples.hookLines.first'), t('creator.video.samples.hookLines.second')]}
    />
  );
}

export function StructureAnalysis({ analysis }: { analysis?: any }) {
  const t = useT();
  return (
    <AnalysisCard
      title={t('creator.video.structureAnalysis')}
      bulletsLabel={t('creator.video.frameworks')}
      icon={Layout}
      iconColor='text-purple-500'
      type={analysis?.type || t('creator.video.samples.structureType')}
      description={
        analysis?.description ||
        t('creator.video.samples.structureBody')
      }
      bullets={analysis?.bullets || [t('creator.video.samples.structurePoints.first'), t('creator.video.samples.structurePoints.second')]}
    />
  );
}

export function StyleAnalysis({ analysis }: { analysis?: any }) {
  const t = useT();
  return (
    <AnalysisCard
      title={t('creator.video.styleAnalysis')}
      bulletsLabel={t('creator.video.attributes')}
      icon={Palette}
      iconColor='text-amber-500'
      type={analysis?.type || t('creator.video.samples.styleType')}
      description={
        analysis?.description ||
        t('creator.video.samples.styleBody')
      }
      bullets={analysis?.bullets || [t('creator.video.samples.styleTraits.first'), t('creator.video.samples.styleTraits.second')]}
    />
  );
}
