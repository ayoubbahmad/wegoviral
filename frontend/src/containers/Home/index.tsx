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
import { HomeSkeleton } from "@/views/Home/skeleton";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const HomeContainer = () => {
  const {
    stats,
    isLoading,
    videos,
    scripts,
    projects,
    challenges
  } = useHomeController();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Home"
        description="Welcome back. Everything you need to scale your influence in one place."
      />

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Videos Section */}
        <div className="space-y-4">
          <SectionHeader 
            title="Videos"
            icon={Video}
            href="/videos"
            titleClassName="text-primary"
          />
          
          <Button 
            variant="outline" 
            className="w-full border-dashed group"
          >
            <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            Analyze New Video
          </Button>

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
          <SectionHeader 
            title="Scripts"
            icon={FileText}
            href="/scripts"
            titleClassName="text-purple-500"
          />

          <Button 
            variant="outline" 
            className="w-full border-dashed border-purple-500/20 text-purple-500 hover:bg-purple-500/5 hover:border-purple-500/50 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Create New Script
          </Button>

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
          <SectionHeader 
            title="Projects"
            icon={FolderOpen}
            href="/projects"
            titleClassName="text-amber-500"
          />

          <Button 
            variant="outline" 
            className="w-full border-dashed border-amber-500/20 text-amber-500 hover:bg-amber-500/5 hover:border-amber-500/50 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Start New Project
          </Button>

          <div className="space-y-3 pt-1">
            {projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/50 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                </div>
                <ProgressBar value={proj.progress} color={proj.color} showLabel />
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="space-y-4">
          <SectionHeader 
            title="Challenges"
            icon={Trophy}
            href="/challenges"
            titleClassName="text-emerald-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-dashed border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/50 group">
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Join
            </Button>
            <Button variant="outline" className="border-dashed border-emerald-800/20 text-emerald-600 hover:bg-emerald-800/5 hover:border-emerald-800/50 group">
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Create
            </Button>
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
    </PageContainer>
  );
};
