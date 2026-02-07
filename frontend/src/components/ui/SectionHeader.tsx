import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  href?: string;
  linkText?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * Standardized header for layout sections with optional icons and "View All" links.
 */
export const SectionHeader = ({
  title,
  icon: Icon,
  description,
  href,
  linkText = "View All",
  className,
  titleClassName,
}: SectionHeaderProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <h2 className={cn("text-xl font-bold flex items-center gap-2", titleClassName)}>
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </h2>
        {href && (
          <Link 
            href={href} 
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {linkText}
          </Link>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
