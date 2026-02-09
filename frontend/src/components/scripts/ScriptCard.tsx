import { FileText, Clock, Layers, Trash2 } from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export interface Script {
  id: string;
  title: string;
  excerpt: string;
  status: "Draft" | "Completed";
  lastUpdated: string;
  wordCount: number;
}

interface ScriptCardProps {
  script: Script;
  variant?: "compact" | "full";
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ScriptCard({ script, variant = "full", onClick, onDelete, className }: ScriptCardProps) {
  const isCompact = variant === "compact";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.();
  };

  return (
    <Card 
      onClick={onClick}
      hover
      variant={isCompact ? "glass" : "default"}
      padding="none"
      className={cn(
        "flex flex-col relative overflow-hidden h-full group",
        isCompact ? "p-4" : "p-6",
        className
      )}
    >
      <div className={cn("flex items-start justify-between", isCompact ? "mb-2" : "mb-4")}>
        {!isCompact ? (
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        ) : (
          <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors pr-2">{script.title}</h3>
        )}
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
            script.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
          )}>
            {script.status}
          </span>
          {onDelete && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                onClick={handleDelete}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {!isCompact && (
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{script.title}</h3>
      )}

      <p className={cn(
        "text-muted-foreground leading-relaxed font-medium",
        isCompact ? "text-xs line-clamp-2 mb-3" : "text-sm line-clamp-3 mb-6 flex-1"
      )}>
        {script.excerpt}
      </p>

      <div className={cn(
        "flex items-center gap-3 text-[10px] text-zinc-500 font-bold",
        !isCompact && "pt-6 border-t border-border/30 justify-between"
      )}>
        <div className="flex items-center gap-1.5">
          <Clock className={cn("text-zinc-500", isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          <span>{formatRelativeDate(script.lastUpdated)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className={cn("text-zinc-500", isCompact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          <span>{script.wordCount} words</span>
        </div>
      </div>
    </Card>
  );
}
