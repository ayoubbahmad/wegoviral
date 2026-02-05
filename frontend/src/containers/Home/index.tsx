"use client";

import {
  ArrowUpRight,
  Plus,
  Play,
  Video,
  FileText,
  FolderOpen,
  Trophy,
  Flame,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useHomeController } from "./controller";

export const HomeContainer = () => {
  const {
    stats,
    videos,
    scripts,
    projects,
    challenges
  } = useHomeController();

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

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Videos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
              <Video className="w-5 h-5" />
              Videos
            </h2>
            <Link href="/videos" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">View All</Link>
          </div>
          
          <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-semibold text-primary flex items-center justify-center gap-2 bg-primary/5">
            <Plus className="w-4 h-4" />
            Analyze New Video
          </button>

          <div className="space-y-3 pt-1">
            {videos.map((i) => (
              <div key={i} className="group relative aspect-video rounded-xl bg-muted/30 border border-border/50 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all">
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
          </div>
        </div>

        {/* Scripts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-purple-500">
              <FileText className="w-5 h-5" />
              Scripts
            </h2>
            <Link href="/scripts" className="text-xs font-medium text-muted-foreground hover:text-purple-500 transition-colors">View All</Link>
          </div>

          <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-sm font-semibold text-purple-500 flex items-center justify-center gap-2 bg-purple-500/5">
            <Plus className="w-4 h-4" />
            Create New Script
          </button>

          <div className="space-y-3 pt-1">
            {scripts.map((i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm">Winning Vertical Guide V{i}</h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Draft</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 font-medium">Today we're breaking down exactly why some creators are crushing the vertical game...</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold">
                  <span>Updated 4h ago</span>
                  <span>450 words</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-500">
              <FolderOpen className="w-5 h-5" />
              Projects
            </h2>
            <Link href="/projects" className="text-xs font-medium text-muted-foreground hover:text-amber-500 transition-colors">View All</Link>
          </div>

          <button className="w-full py-3 rounded-xl border border-dashed border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-sm font-semibold text-amber-500 flex items-center justify-center gap-2 bg-amber-500/5">
            <Plus className="w-4 h-4" />
            Start New Project
          </button>

          <div className="space-y-3 pt-1">
            {projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{proj.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${proj.color} transition-all`} style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-500">
              <Trophy className="w-5 h-5" />
              Challenges
            </h2>
            <Link href="/challenges" className="text-xs font-medium text-muted-foreground hover:text-emerald-500 transition-colors">View All</Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="py-3 rounded-xl border border-dashed border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-sm font-semibold text-emerald-500 flex items-center justify-center gap-2 bg-emerald-500/5 group">
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Join
            </button>
            <button className="py-3 rounded-xl border border-dashed border-border hover:border-emerald-800/50 hover:bg-emerald-800/5 transition-all text-sm font-semibold text-emerald-600 flex items-center justify-center gap-2 bg-emerald-800/5 border-emerald-800/20">
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {challenges.map((challenge, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden group">
                {challenge.hot && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-orange-500 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg flex items-center gap-1 uppercase tracking-tighter shadow-sm animate-pulse">
                      <Flame className="w-2.5 h-2.5" />
                      Hot
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-sm mb-1">{challenge.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-5 h-5 rounded-full border-2 border-card bg-muted overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=challenger${i}${j}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{challenge.recruits} joining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
