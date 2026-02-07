"use client";

import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ViewToggle } from "@/components/ui/ViewToggle";

// Mock data for scripts
const MOCK_SCRIPTS = [
  { id: "1", title: "Winning Vertical Guide V1", status: "Draft", lastUpdated: "4h ago", wordCount: 450, excerpt: "Today we're breaking down exactly why some creators are crushing the vertical game..." },
  { id: "2", title: "The 3 Hook Framework", status: "Completed", lastUpdated: "1d ago", wordCount: 820, excerpt: "In this script, we analyze the top 0.1% of hooks that consistently drive retention..." },
  { id: "3", title: "Screaming at the Camera", status: "Draft", lastUpdated: "2d ago", wordCount: 310, excerpt: "A high-energy approach to stopping the scroll immediately with intense visuals..." },
  { id: "4", title: "Silent Storytelling Tactics", status: "Completed", lastUpdated: "1w ago", wordCount: 1200, excerpt: "How to use visual cues and text overlays to tell a story without saying a word..." },
];

export const ScriptsLibraryContainer = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4">
        <PageHeader 
          title="Scripts Library"
          description="Manage and organize all your video scripts in one place."
          className="flex-1"
        />
        <Link href="/scripts/new">
          <Button variant="primary" className="h-11 px-6">
            <Plus className="w-4 h-4" />
            Create New Script
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchInput 
            placeholder="Search scripts by title or content..."
          />
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <Link 
              href="/scripts/ingredients" 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-xs font-bold text-muted-foreground hover:text-primary transition-all border border-border/50"
            >
              <Sparkles className="w-4 h-4" /> 7 Core Variables
            </Link>
          </div>
        </div>

        {MOCK_SCRIPTS.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_SCRIPTS.map((script) => (
                <div 
                  key={script.id} 
                  className="group flex flex-col p-6 rounded-[2rem] bg-card border border-border/50 hover:border-purple-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      script.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {script.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{script.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                    {script.excerpt}
                  </p>
                  
                  <div className="pt-6 border-t border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {script.lastUpdated}
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-zinc-500" />
                        {script.wordCount}w
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Script Name</th>
                    <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Word Count</th>
                    <th className="p-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Last Updated</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SCRIPTS.map((script) => (
                    <tr key={script.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors group cursor-pointer">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold group-hover:text-primary transition-colors">{script.title}</div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">{script.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          script.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                        }`}>
                          {script.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground tabular-nums">
                          <Layers className="w-3.5 h-3.5" />
                          {script.wordCount}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {script.lastUpdated}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <EmptyState 
            title="No scripts found"
            description="You haven't created any scripts yet. Start your first one now!"
            icon={FileText}
            actionText="Create Script"
            onAction={() => window.location.href = "/scripts/new"}
          />
        )}
      </div>
    </PageContainer>
  );
};
