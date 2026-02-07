"use client";

import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

// Mock data for scripts
const MOCK_SCRIPTS = [
  { id: "1", title: "Winning Vertical Guide V1", status: "Draft", lastUpdated: "4h ago", wordCount: 450, excerpt: "Today we're breaking down exactly why some creators are crushing the vertical game..." },
  { id: "2", title: "The 3 Hook Framework", status: "Completed", lastUpdated: "1d ago", wordCount: 820, excerpt: "In this script, we analyze the top 0.1% of hooks that consistently drive retention..." },
  { id: "3", title: "Screaming at the Camera", status: "Draft", lastUpdated: "2d ago", wordCount: 310, excerpt: "A high-energy approach to stopping the scroll immediately with intense visuals..." },
  { id: "4", title: "Silent Storytelling Tactics", status: "Completed", lastUpdated: "1w ago", wordCount: 1200, excerpt: "How to use visual cues and text overlays to tell a story without saying a word..." },
];

export const ScriptsLibraryContainer = () => {
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
          <Link 
            href="/scripts/ingredients" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-xs font-bold text-muted-foreground hover:text-primary transition-all border border-border/50"
          >
            <Sparkles className="w-4 h-4" /> 7 Core Variables
          </Link>
        </div>

        {MOCK_SCRIPTS.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {MOCK_SCRIPTS.map((script) => (
              <div 
                key={script.id} 
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-purple-500/30 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{script.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        script.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                      }`}>
                        {script.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">{script.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Updated {script.lastUpdated}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {script.wordCount} words
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
