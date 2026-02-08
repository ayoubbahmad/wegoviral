import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      "rounded-3xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}>
      {children}
    </div>
  );
};
