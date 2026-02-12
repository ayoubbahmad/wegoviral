import { FileText, Clock, Layers, Trash2, Anchor, Palette } from 'lucide-react';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScriptTemplate } from '../../types';

interface TemplateCardProps {
  template: ScriptTemplate;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function TemplateCard({
  template,
  isActive,
  onClick,
  onDelete,
  className,
}: TemplateCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card
      onClick={onClick}
      hover
      padding='none'
      className={cn(
        'flex flex-col h-full cursor-pointer transition-all duration-300',
        isActive
          ? 'border-primary shadow-xl shadow-primary/10 -translate-y-1'
          : '',
        'p-6',
        className,
      )}
    >
      <Card.Header
        icon={Palette}
        title={template.category}
        actions={
          <span className='text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider'>
            Template
          </span>
        }
      />

      <Card.Content>
        <h3 className='font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1'>
          {template.title}
        </h3>
        <p className='text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed font-medium'>
          {template.excerpt || 'No excerpt available for this template.'}
        </p>
      </Card.Content>

      <Card.Footer
        metadata={
          <>
            <Card.MetaItem
              icon={Clock}
              label={formatRelativeDate(template.createdAt)}
            />
            <Card.MetaItem
              icon={Layers}
              label={`${template.content.length} steps`}
            />
          </>
        }
        actions={
          onDelete && (
            <Button
              variant='ghost'
              size='sm'
              className='h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
              onClick={handleDelete}
            >
              <Trash2 className='w-3.5 h-3.5' />
            </Button>
          )
        }
      />
    </Card>
  );
}
