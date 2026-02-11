import {
  AlignLeft,
  ArrowUpRight,
  Zap,
  FileText as FileIcon,
} from 'lucide-react';

export interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <section
      id='description'
      className='p-8 rounded-3xl border border-border bg-card/30 relative overflow-hidden group'
    >
      <div className='flex items-center gap-2 mb-6 text-blue-500'>
        <AlignLeft className='w-5 h-5' />
        <h3 className='font-bold text-xl tracking-tight uppercase'>
          Description
        </h3>
      </div>
      <p className='text-sm leading-[1.8] text-muted-foreground font-medium whitespace-pre-wrap'>
        {description}
      </p>
      <button className='mt-6 flex items-center gap-2 p-2 px-4 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary transition-all'>
        Show full description
        <ArrowUpRight className='w-3 h-3' />
      </button>
    </section>
  );
}

export function TranscriptSection() {
  return (
    <section
      id='transcript'
      className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
    >
      <div className='flex items-center justify-between border-b border-border/50 pb-6'>
        <div className='flex items-center gap-2 text-purple-500'>
          <FileIcon className='w-5 h-5' />
          <h3 className='font-bold text-xl tracking-tight uppercase'>
            Transcript
          </h3>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-[10px] font-black text-muted-foreground uppercase bg-secondary/50 px-3 py-1 rounded-full'>
            Extracting...
          </span>
        </div>
      </div>
      <div className='p-12 rounded-2xl bg-secondary/10 border border-dashed border-border flex flex-col items-center gap-4 text-center'>
        <Zap className='w-8 h-8 text-primary animate-pulse' />
        <div>
          <h4 className='font-bold text-foreground mb-1'>
            Transcript processing
          </h4>
          <p className='text-xs text-muted-foreground max-w-[280px]'>
            We're currently extracting the transcript for this video. This
            usually takes a few seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
