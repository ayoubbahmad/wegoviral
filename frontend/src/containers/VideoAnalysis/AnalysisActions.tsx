import { Zap, FolderPlus, Archive, FileText } from 'lucide-react';

export function AnalysisActions() {
  const actions = [
    { label: 'Remix idea', icon: Zap },
    { label: 'Add to project', icon: FolderPlus },
    { label: 'Save to library', icon: Archive },
    { label: 'Create prompt', icon: FileText },
  ];

  return (
    <div className='p-4 rounded-xl border border-border bg-card'>
      <div className='flex items-center gap-2 mb-4'>
        <Zap className='w-5 h-5 text-blue-500' />
        <h3 className='font-semibold text-lg text-blue-500'>Actions</h3>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {actions.map((action) => (
          <button
            key={action.label}
            className='flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-border bg-background hover:bg-secondary/50 hover:border-primary/50 transition-all group'
          >
            <action.icon className='w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors' />
            <span className='text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors'>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
