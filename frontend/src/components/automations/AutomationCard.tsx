"use client";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { 
  Zap, 
  Edit2, 
  Trash2, 
  Globe, 
  Clapperboard, 
  MessageSquare, 
  Settings2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationCardProps {
  automation: any;
  onEdit: (automation: any) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}

export function AutomationCard({ automation, onEdit, onDelete, onToggle }: AutomationCardProps) {
  return (
    <Card hover className="flex flex-col h-full overflow-hidden">
      <Card.Header 
        icon={Zap}
        title={automation.name}
        actions={
          <div className="flex items-center gap-3">
            <button 
                onClick={() => onToggle(automation.id, automation.active)}
                className="transition-colors"
            >
                {automation.active ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground/30" />
                )}
            </button>
            <div className="flex flex-col items-end gap-1">
                <span className={cn(
                   "text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded",
                   automation.active ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500"
                )}>
                  {automation.active ? "Active" : "Paused"}
                </span>
                <div className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground uppercase text-[8px] font-black tracking-tighter">
                    {automation.isGlobal ? (
                        <Globe className="w-2.5 h-2.5" />
                    ) : (
                        <Clapperboard className="w-2.5 h-2.5 text-primary" />
                    )}
                    <span>{automation.isGlobal ? "Global" : "Post"}</span>
                </div>
            </div>
          </div>
        }
      />

      <Card.Content className="space-y-3">
        {/* Trigger Info */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
           <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
           <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Trigger Keyword</p>
              <p className="text-sm font-mono font-bold text-foreground">"{automation.triggerKeyword}"</p>
           </div>
        </div>

        {/* Action Info */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
           <Settings2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
           <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Action Flow</p>
              <div className="flex flex-col gap-1.5 mt-1">
                 <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">DM</div>
                    <p className="text-[11px] text-foreground line-clamp-1 italic">"{automation.responseMessage}"</p>
                 </div>
                 {automation.commentReplyEnabled && (
                    <div className="flex items-center gap-2">
                       <div className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] font-bold">REPLY</div>
                       <p className="text-[11px] text-foreground line-clamp-1 italic">"{automation.commentReplyMessage}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </Card.Content>

      <Card.Footer 
        metadata={
          <>
            <Card.MetaItem label={`Platform: ${automation.platform || "Instagram"}`} />
            <Card.MetaItem label={`Runs: ${automation.runCount || 0}`} />
          </>
        }
        actions={
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:bg-primary/10 rounded-lg h-8 w-8 p-0"
              onClick={() => onEdit(automation)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:bg-red-500/10 rounded-lg h-8 w-8 p-0"
              onClick={() => onDelete(automation.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        }
      />
    </Card>
  );
}
