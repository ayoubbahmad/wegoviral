"use client";

import { 
  Plus, 
  Search, 
  MoreVertical,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  ChevronRight,
  FileText
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
import { ScriptCard } from "@/components/scripts/ScriptCard";

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
                <ScriptCard 
                  key={script.id}
                  script={script as any}
                  variant="full"
                />
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
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
