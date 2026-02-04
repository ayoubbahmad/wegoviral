import {
  ArrowUpRight,
  Users,
  Eye,
  Activity,
  Video,
  FileText,
  FolderOpen,
  Plus,
  Play
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Everything you need to scale your influence in one place.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/50 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              {stat.trend && (
                <span className="text-xs font-medium text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  +{stat.trend}% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Videos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Videos
            </h2>
            <Link href="/videos" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative aspect-video rounded-xl bg-muted/30 border border-border/50 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <p className="text-xs font-bold text-white line-clamp-1">Viral Hook Analysis: Episode #{i + 12}</p>
                  <p className="text-[10px] text-zinc-400">2.4M views • 2 days ago</p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Analyze New Video
            </button>
          </div>
        </div>

        {/* Scripts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Scripts
            </h2>
            <Link href="/scripts" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm">Winning Vertical Guide V{i}</h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Draft</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">Today we're breaking down exactly why some creators are crushing the vertical game while others are left behind...</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                  <span>Updated 4h ago</span>
                  <span>•</span>
                  <span>450 words</span>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Script
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              Projects
            </h2>
            <Link href="/projects" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "30-Day Growth Challenge", progress: 65, color: "bg-amber-500" },
              { name: "Creator OS Launch", progress: 92, color: "bg-emerald-500" },
              { name: "YouTube Brand Deal", progress: 20, color: "bg-blue-500" }
            ].map((proj, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-amber-500/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${proj.color} transition-all`} style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Start New Project
            </button>
          </div>
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
