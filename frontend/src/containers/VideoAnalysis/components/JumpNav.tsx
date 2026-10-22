import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useT } from '@/i18n/provider';

export interface JumpNavProps {
  links: readonly {
    id: string;
    icon: LucideIcon;
  }[];
  activeSection: string;
  onScrollTo: (id: string) => void;
}

export function JumpNav({ links, activeSection, onScrollTo }: JumpNavProps) {
  const t = useT();
  return (
    <div className='sticky top-8 z-20 flex justify-center'>
      <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50'>
        <div
          className='flex items-center gap-2 overflow-x-auto hide-scrollbar'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onScrollTo(link.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 active:scale-95',
                activeSection === link.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              )}
            >
              <link.icon className='w-3.5 h-3.5' />
              {t(`creator.video.sections.${link.id as 'actions'}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
