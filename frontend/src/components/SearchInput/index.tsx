import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { T } from "@/i18n/T";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  buttonText?: string;
  containerClassName?: string;
}

/**
 * Search input with an integrated search button and keyboard shortcut visual.
 */
export const SearchInput = ({
  onSearch,
  buttonText,
  containerClassName,
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full max-w-xl group", containerClassName)}>
      <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <input 
        type="text" 
        className={cn(
          "w-full h-11 ps-11 pe-20 rounded-lg bg-card border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm",
          className
        )}
        {...props}
      />
      <button 
        type="button"
        onClick={() => onSearch?.(props.value as string)}
        className="absolute end-1.5 top-1.5 bottom-1.5 px-4 rounded-md bg-secondary border border-border/50 text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center gap-2 group/btn"
      >
        {buttonText ?? <T k="common.search" />}
        <CornerDownLeft className="w-3 h-3 opacity-50 rtl:-scale-x-100" aria-hidden />
      </button>
    </div>
  );
};
