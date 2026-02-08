import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Standardized Label component for form fields.
 */
export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn(
        "text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block",
        className
      )}
      {...props}
    />
  );
};
