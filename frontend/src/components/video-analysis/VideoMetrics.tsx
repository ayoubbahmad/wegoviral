import { TrendingUp, Eye, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    icon?: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    color: "green" | "blue" | "purple" | "orange" | "yellow";
}

export function MetricCard({ label, value, icon: Icon, trend, trendUp, color }: MetricCardProps) {
    const colorStyles = {
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center p-4 rounded-xl border", colorStyles[color])}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium opacity-90">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {trend && (
                <div className="text-xs font-medium mt-1 flex items-center gap-1 opacity-80">
                    {trend}
                    <AlertCircle className="w-3 h-3" />
                </div>
            )}
        </div>
    );
}

export function VideoMetrics() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <MetricCard
                label="1.4x outlier score"
                value="1.4x"
                trend="outlier score"
                icon={TrendingUp}
                color="green"
            />
            <MetricCard
                label="1.7M views"
                value="1.7M"
                icon={Eye}
                color="blue"
            />
             <MetricCard
                label="2% engagement rate"
                value="2%"
                trend="engagement rate"
                icon={TrendingUp} // Down arrow actually needed for engagement sometimes if low, but standard is fine
                color="orange"
            />
            <MetricCard
                label="34K likes"
                value="34K"
                icon={ThumbsUp}
                color="purple"
            />
             <MetricCard
                label="453 comments"
                value="453"
                icon={MessageSquare}
                color="yellow"
            />
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card/50">
                 <span className="text-sm font-medium text-muted-foreground">1.9M channel followers</span>
            </div>
        </div>
    );
}
