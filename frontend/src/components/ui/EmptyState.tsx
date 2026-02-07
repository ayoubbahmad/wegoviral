import { LucideIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Standardized placeholder for empty lists or missing data.
 */
export const EmptyState = ({
  title,
  description,
  icon: Icon = Info,
  actionText,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] border border-dashed border-border/50 bg-secondary/5",
      className
    )}>
      <div className="p-4 bg-background rounded-2xl shadow-sm border border-border/50 mb-4 group">
        <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="font-bold">
          {actionText}
        </Button>
      )}
    </div>
  );
};
