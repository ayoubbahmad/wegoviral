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
  FileText,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, formatRelativeDate } from "@/lib/utils";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { ScriptCard } from "@/components/scripts/ScriptCard";
import { useScriptsController } from "./controller";

export const ScriptsLibraryContainer = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { scripts, isLoading, handleDeleteScript } = useScriptsController();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader 
          title="Scripts Library"
          description="Manage and organize all your video scripts in one place."
        />
        <div className="flex items-center justify-center p-32">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Scripts Library"
        description="Manage and organize all your video scripts in one place."
        actions={
          <Link href="/scripts/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4" />
              Create New Script
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchInput 
            placeholder="Search scripts by title or content..."
          />
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <Link 
              href="/scripts/ingredients" 
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/50"
            >
              <Calendar className="w-3.5 h-3.5" />
              Ingredients
            </Link>
            <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/50">
              <Sparkles className="w-3.5 h-3.5" />
              AI Generate
            </button>
          </div>
        </div>

        {scripts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scripts.map((script) => (
                <ScriptCard 
                  key={script.id}
                  script={script as any}
                  variant="full"
                  onDelete={() => handleDeleteScript(script.id)}
                  onClick={() => router.push(`/scripts/${script.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Status</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Words</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Updated</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {scripts.map((script) => (
                    <tr 
                      key={script.id} 
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/scripts/${script.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">{script.title}</span>
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
                          {formatRelativeDate(script.lastUpdated)}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScript(script.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                              <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
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
