'use client';

import { Folder, MoreHorizontal, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  name: string;
  items: number;
  lastModified: string;
  onClick?: () => void;
}

export function ProjectCard({ name, items, lastModified, onClick }: ProjectCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-between p-6 h-[200px] rounded-3xl border border-border/50 bg-card/30",
        "hover:bg-card/50 hover:border-border hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer active:scale-[0.98]"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <Folder className="w-6 h-6 fill-current opacity-80" />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
          {name}
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{items} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{lastModified}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center p-6 h-[200px] rounded-3xl border-2 border-dashed border-border/50 bg-transparent",
        "hover:bg-secondary/20 hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98] gap-4"
      )}
    >
      <div className="p-4 rounded-full bg-secondary/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
        <Folder className="w-8 h-8" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
        Create New Project
      </span>
    </div>
  );
}
