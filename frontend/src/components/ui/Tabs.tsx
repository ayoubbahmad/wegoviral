import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  containerClassName?: string;
  sticky?: boolean;
}

export const Tabs = ({ 
  items, 
  activeId, 
  onChange, 
  className, 
  containerClassName,
  sticky = false 
}: TabsProps) => {
  return (
    <div className={cn(
      sticky && "sticky top-8 z-40",
      "flex justify-center",
      containerClassName
    )}>
      <div className={cn(
        "flex items-center gap-1 p-1.5 rounded-2xl bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl w-fit",
        className
      )}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap",
              activeId === item.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
