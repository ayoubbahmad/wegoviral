import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "pill" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      pill: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-black uppercase tracking-widest rounded-full",
      outline: "border border-border/50 bg-background hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
      ghost: "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base font-bold",
    };

    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-medium";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
