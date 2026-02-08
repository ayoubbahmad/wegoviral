import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "secondary" | "dashed";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Premium Card component with multiple variants and hover effects.
 */
export const Card = ({ 
  children, 
  className, 
  variant = "default", 
  padding = "md",
  hover = false,
  onClick
}: CardProps) => {
  const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variantMap = {
    default: "bg-card border-border",
    glass: "bg-card/30 backdrop-blur-md border-border/50",
    secondary: "bg-secondary/20 border-border/50",
    dashed: "bg-transparent border-dashed border-border/50",
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        variantMap[variant],
        paddingMap[padding],
        hover && "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.01] cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
