import { cn } from "@/lib/utils";
import { T } from '@/i18n/T';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * Standardized thin progress bar for metrics and project tracking.
 */
export const ProgressBar = ({
  value,
  max = 100,
  color = "bg-primary",
  className,
  showLabel,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
          <span><T k='common.progress' /></span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", color)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};
