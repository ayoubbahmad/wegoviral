import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardized wrapper for all dashboard pages.
 * Handles vertical rhythm (space-y-12) and safe area bottom padding (pb-32).
 */
export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("space-y-12 pb-32 animate-in fade-in duration-500", className)}>
      {children}
    </div>
  );
};
