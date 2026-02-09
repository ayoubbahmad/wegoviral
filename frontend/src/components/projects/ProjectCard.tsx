'use client';

import { Folder, MoreHorizontal, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  id: string;
  name: string;
  items: number;
  lastModified: string;
}

import { Card } from '../ui/Card';

export function ProjectCard({ id, name, items, lastModified }: ProjectCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      onClick={() => router.push(`/projects/${id}`)}
      hover
      className="flex flex-col h-[220px]"
    >
      <Card.Header 
        icon={Folder}
        actions={
          <button 
            onClick={(e) => { e.stopPropagation(); }} 
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        }
      />

      <Card.Content className="flex-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>
      </Card.Content>

      <Card.Footer 
        metadata={
          <>
            <Card.MetaItem icon={FileText} label={`${items} items`} />
            <Card.MetaItem icon={Clock} label={lastModified} />
          </>
        }
      />
    </Card>
  );
}

export function NewProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <Card 
      onClick={onClick}
      hover
      variant="glass"
      className="flex flex-col items-center justify-center h-[220px] border-2 border-dashed border-border/50 bg-transparent group"
    >
      <div className="p-4 rounded-full bg-secondary/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all mb-4">
        <Folder className="w-8 h-8" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
        Create New Project
      </span>
    </Card>
  );
}
