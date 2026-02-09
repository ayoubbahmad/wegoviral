import { LucideIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
  className?: string;
  variant?: "default" | "glass" | "secondary";
}

/**
 * Standardized card for displaying metrics and key performance indicators.
 * Built on the unified Card component.
 */
export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  description,
  className,
  variant = "default",
}: StatCardProps) => {
  return (
    <Card 
      variant={variant}
      className={cn("group h-full flex flex-col", className)}
    >
      <Card.Header 
        title={label}
        icon={Icon}
        actions={
          trend !== undefined && (
            <span className={cn(
              "text-[10px] font-bold flex items-center px-1.5 py-0.5 rounded-md",
              trend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
              <ArrowUpRight className={cn("w-3 h-3 ml-0.5", trend < 0 && "rotate-90")} />
            </span>
          )
        }
      />
      
      <Card.Content>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          {description && (
            <p className="text-xs text-muted-foreground font-medium">{description}</p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
