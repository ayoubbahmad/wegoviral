import { LayoutGrid, Table2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ViewToggleProps {
  mode: "grid" | "table";
  onChange: (mode: "grid" | "table") => void;
  className?: string;
}

/**
 * Standardized Grid/Table switcher for lists.
 */
export const ViewToggle = ({ mode, onChange, className }: ViewToggleProps) => {
  return (
    <div className={cn("flex p-1 bg-card border border-border/50 rounded-xl", className)}>
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onChange("table")}
        className={cn(
          "p-2 rounded-lg transition-all",
          mode === "table" ? "bg-primary/10 text-primary shadow-sm" : ""
        )}
        title="Table View"
      >
        <Table2 className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => onChange("grid")}
        className={cn(
          "p-2 rounded-lg transition-all",
          mode === "grid" ? "bg-primary/10 text-primary shadow-sm" : ""
        )}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
    </div>
  );
};
