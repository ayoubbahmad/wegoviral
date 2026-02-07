import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  buttonText?: string;
  containerClassName?: string;
}

/**
 * Premium search input with integrated "Go" button and keyboard shortcut visual.
 */
export const SearchInput = ({
  onSearch,
  buttonText = "Go",
  containerClassName,
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full max-w-xl group", containerClassName)}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <input 
        type="text" 
        className={cn(
          "w-full h-11 pl-11 pr-20 rounded-xl bg-card border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm",
          className
        )}
        {...props}
      />
      <button 
        onClick={() => onSearch?.(props.value as string)}
        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-secondary border border-border/50 text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center gap-2 group/btn"
      >
        {buttonText}
        <span className="text-[10px] opacity-50 group-hover/btn:translate-x-0.5 transition-transform">↵</span>
      </button>
    </div>
  );
};
