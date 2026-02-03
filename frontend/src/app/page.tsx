import {
  ArrowUpRight,
  Users,
  Eye,
  Activity
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening with your content.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              {stat.trend && (
                <span className="text-xs font-medium text-green-500 flex items-center">
                  +{stat.trend}% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Placeholder for recent activity or charts */}
        <div className="p-6 rounded-2xl bg-card border border-border h-64 flex flex-col items-center justify-center text-muted-foreground">
          <Activity className="w-8 h-8 mb-2 opacity-50" />
          <p>Recent Activity Chart Placeholder</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border h-64 flex flex-col items-center justify-center text-muted-foreground">
          <Users className="w-8 h-8 mb-2 opacity-50" />
          <p>Community Growth Placeholder</p>
        </div>
      </div>
    </div>
  );
}

const stats = [
  {
    label: "Total Followers",
    value: "12,345",
    trend: 12,
    icon: Users,
  },
  {
    label: "Avg. Engagement",
    value: "4.8%",
    trend: 2.1,
    icon: Activity,
  },
  {
    label: "Impressions (30d)",
    value: "45.2k",
    trend: 8,
    icon: Eye,
  },
  {
    label: "Content Score",
    value: "92",
    icon: ArrowUpRight,
  },
];
