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
      className={cn("group", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {trend !== undefined && (
            <span className={cn(
              "text-xs font-medium flex items-center px-1.5 py-0.5 rounded-full",
              trend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
              <ArrowUpRight className={cn("w-3 h-3 ml-0.5", trend < 0 && "rotate-90")} />
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
};
