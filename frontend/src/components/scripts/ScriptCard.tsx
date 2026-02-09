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
        "flex flex-col h-full",
        isCompact ? "p-4" : "p-6",
        className
      )}
    >
      <Card.Header 
        icon={!isCompact ? FileText : undefined}
        title={isCompact ? script.title : undefined}
        actions={
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
            script.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
          )}>
            {script.status}
          </span>
        }
      />

      <Card.Content>
        {!isCompact && (
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{script.title}</h3>
        )}
        <p className={cn(
          "text-muted-foreground leading-relaxed font-medium",
          isCompact ? "text-xs line-clamp-2 mb-3" : "text-sm line-clamp-3 mb-6"
        )}>
          {script.excerpt}
        </p>
      </Card.Content>

      <Card.Footer 
        metadata={
          <>
            <Card.MetaItem icon={Clock} label={formatRelativeDate(script.lastUpdated)} />
            <Card.MetaItem icon={Layers} label={`${script.wordCount} words`} />
          </>
        }
        actions={
          onDelete && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={handleDelete}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )
        }
      />
    </Card>
  );
}
