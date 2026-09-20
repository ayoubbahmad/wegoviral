import { Segment } from "@/types/followers";
import { cn } from "@/lib/utils";
import { Crown, Star, User, Sparkles } from "lucide-react";

interface LoyaltyBadgeProps {
    segment: Segment;
    className?: string;
}

export function LoyaltyBadge({ segment, className }: LoyaltyBadgeProps) {
    const config = {
        VIP: {
            icon: Crown,
            label: "VIP",
            classes: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
        },
        Superfan: {
            icon: Star,
            label: "Superfan",
            classes: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
        },
        Regular: {
            icon: User,
            label: "Regular",
            classes: "bg-secondary text-muted-foreground border-border",
        },
        New: {
            icon: Sparkles,
            label: "New",
            classes: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
        },
    };

    const { icon: Icon, label, classes } = config[segment];

    return (
        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", classes, className)}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}
