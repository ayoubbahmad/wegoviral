import { useState } from 'react';
import {
  Sparkles,
  Plus,
  Bookmark,
  Send,
  X,
  ChevronDown,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/provider';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  actionLabel: string;
}

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actionLabel,
}: ModalProps) {
  const t = useT();
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl p-6 animate-in zoom-in-95 duration-200'>
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className='absolute top-4 end-4 p-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <X className='w-4 h-4' />
        </button>

        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>{title}</h2>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>

        <div className='mb-8'>{children}</div>

        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors'
          >
            {t('common.cancel')}
          </button>
          <button className='px-5 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all'>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnalysisModals({ videoTitle }: { videoTitle?: string }) {
  const t = useT();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const actions = [
    { id: 'remix', icon: Sparkles },
    { id: 'project', icon: Plus },
    { id: 'library', icon: Bookmark },
    { id: 'prompt', icon: Send },
  ] as const;

  return (
    <div className='p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-blue-500/30 transition-all'>
      <div className='flex items-center gap-2 mb-6'>
        <Sparkles className='w-5 h-5 text-blue-500' />
        <h3 className='text-lg font-bold text-blue-500'>{t('creator.video.sections.actions')}</h3>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => setActiveModal(action.id)}
            className='flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-border/50 bg-background hover:bg-blue-500/5 hover:border-blue-500/30 transition-all group active:scale-95'
          >
            <action.icon className='w-6 h-6 text-muted-foreground group-hover:text-blue-500 transition-colors' />
            <span className='text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors text-center'>
              {t(`creator.video.actions.${action.id}.label`)}
            </span>
          </button>
        ))}
      </div>

      {/* Modals Implementation */}
      <Modal
        isOpen={activeModal === 'remix'}
        onClose={() => setActiveModal(null)}
        title={t('creator.video.actions.remix.title')}
        description={t('creator.video.remixBody')}
        actionLabel={t('creator.video.writeScript')}
      >
        <div className='p-4 rounded-xl bg-muted/30 border border-border/50'>
          <div className='text-xs font-bold mb-2 uppercase opacity-60'>
            {t('creator.video.sourceVideo')}
          </div>
          <div className='text-sm font-semibold truncate leading-none'>
            {videoTitle || t('creator.video.sourceVideo')}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'project'}
        onClose={() => setActiveModal(null)}
        title={t('creator.video.actions.project.title')}
        description={t('creator.video.projectBody')}
        actionLabel={t('creator.video.addToProject')}
      >
        <div className='relative group/select'>
          <button className='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border group-hover/select:border-primary/50 transition-colors'>
            <span className='text-sm text-muted-foreground'>
              {t('creator.video.selectProject')}
            </span>
            <ChevronDown className='w-4 h-4 text-muted-foreground' />
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'library'}
        onClose={() => setActiveModal(null)}
        title={t('creator.video.actions.library.title')}
        description={t('creator.video.libraryBody')}
        actionLabel={t('creator.video.saveToLibrary')}
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-xs font-bold text-foreground mb-2 uppercase opacity-60'>
              {t('creator.video.name')}
            </label>
            <input
              type='text'
              className='w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 outline-none text-sm font-medium'
              defaultValue={t('creator.video.libraryItem', { title: videoTitle ?? '' })}
            />
          </div>
          <div className='space-y-3'>
            <label className='flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/30 transition-colors cursor-pointer group'>
              <input
                type='checkbox'
                defaultChecked
                className='w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all opacity-0 absolute'
              />
              <div className='w-5 h-5 rounded border border-border flex items-center justify-center bg-card transition-all group-has-[:checked]:bg-primary group-has-[:checked]:border-primary'>
                <Check className='w-3 h-3 text-white' />
              </div>
              <div>
                <div className='text-sm font-bold'>{t('creator.video.saveHook')}</div>
                <div className='text-[10px] text-muted-foreground'>
                  {t('creator.video.saveHookBody')}
                </div>
              </div>
            </label>
            <label className='flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/30 transition-colors cursor-pointer group'>
              <input
                type='checkbox'
                className='w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all opacity-0 absolute'
              />
              <div className='w-5 h-5 rounded border border-border flex items-center justify-center bg-card transition-all group-has-[:checked]:bg-primary group-has-[:checked]:border-primary'>
                <Check className='w-3 h-3 text-white' />
              </div>
              <div>
                <div className='text-sm font-bold'>{t('creator.video.saveStyle')}</div>
                <div className='text-[10px] text-muted-foreground'>
                  {t('creator.video.saveStyleBody')}
                </div>
              </div>
            </label>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'prompt'}
        onClose={() => setActiveModal(null)}
        title={t('creator.video.actions.prompt.title')}
        description={t('creator.video.promptBody')}
        actionLabel={t('creator.video.copyPrompt')}
      >
        <div className='relative group'>
          <div className='absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity'>
            <button aria-label={t('creator.video.copy')} className='p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground transition-colors shadow-lg'>
              <Copy className='w-3.5 h-3.5' />
            </button>
          </div>
          <div dir='ltr' className='max-h-[250px] overflow-auto p-4 rounded-xl bg-muted/50 border border-border/50 font-mono text-[10px] text-muted-foreground leading-relaxed'>
            {`<system_instructions>
  <job>World-class short-form script writer</job>
  <goal>Create high-quality viral content</goal>
  <style_guide>Informal, punchy, human tone</style_guide>
</system_instructions>

<task>Write attention-grabbing script (90-120 words)</task>
<topic>Ramadan fasting physiological impact</topic>`}
          </div>
        </div>
      </Modal>
    </div>
  );
}
