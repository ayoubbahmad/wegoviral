"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  MessageSquare, 
  Zap, 
  Trash2, 
  ChevronRight, 
  Settings2,
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useAutomationsController } from "./controller";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from '@/components/ui/Card';
import { Input } from "@/components/ui/Input";

export const AutomationsContainer = () => {
  const { 
    automations, 
    isLoading, 
    handleCreate, 
    handleDelete, 
    handleToggleActive 
  } = useAutomationsController();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    triggerKeyword: "",
    responseMessage: "",
    commentReplyEnabled: false,
    commentReplyMessage: ""
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.triggerKeyword || !formData.responseMessage) return;
    
    await handleCreate(formData);
    setIsAdding(false);
    setFormData({ 
      name: "", 
      triggerKeyword: "", 
      responseMessage: "",
      commentReplyEnabled: false,
      commentReplyMessage: "" 
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="DM Automations"
        description="Trigger automatic messages based on keywords in comments or mentions."
        actions={
          <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "primary"} className="pl-3">
            {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "New Automation"}
          </Button>
        }
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border-primary/20 bg-primary/5 shadow-xl shadow-primary/5">
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Automation Name</label>
                  <Input 
                    placeholder="e.g. Community Access" 
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Keyword Trigger</label>
                  <Input 
                    placeholder="e.g. community" 
                    value={formData.triggerKeyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, triggerKeyword: e.target.value })}
                    className="font-mono text-primary font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Response Message</label>
                  <Input 
                    placeholder="Hey! Here is the link..." 
                    value={formData.responseMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, responseMessage: e.target.value })}
                  />
                </div>
                <div className="md:col-span-3 space-y-4 pt-2 border-t border-border/50">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-sm font-bold">Automated Comment Reply</p>
                         <p className="text-xs text-muted-foreground">Automatically reply to the viewer's comment after sending the DM.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, commentReplyEnabled: !formData.commentReplyEnabled })}
                        className="transition-colors"
                      >
                         {formData.commentReplyEnabled ? (
                           <ToggleRight className="w-8 h-8 text-primary" />
                         ) : (
                           <ToggleLeft className="w-8 h-8 text-muted-foreground/30" />
                         )}
                      </button>
                   </div>
                   
                   <AnimatePresence>
                     {formData.commentReplyEnabled && (
                       <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Comment Text</label>
                            <Input 
                              placeholder="e.g. Just sent you a DM! Check it out." 
                              value={formData.commentReplyMessage}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, commentReplyMessage: e.target.value })}
                            />
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" variant="primary">
                    <CheckCircle2 className="w-4 h-4" />
                    Save Automation
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse border border-border/50" />
            ))}
          </div>
        ) : automations.length === 0 ? (
          <Card className="p-20 text-center border-dashed bg-muted/20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold">No Automations Active</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect your social accounts and create your first keyword trigger to start automating your community growth.
              </p>
              <Button variant="outline" onClick={() => setIsAdding(true)}>
                Get Started
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => (
              <motion.div
                key={automation.id}
                layout
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="group hover:border-primary/40 transition-all duration-300 relative overflow-hidden bg-background">
                  <div className="absolute top-0 right-0 p-4">
                    <button 
                      onClick={() => handleToggleActive(automation.id, automation.active)}
                      className="transition-colors"
                    >
                      {automation.active ? (
                        <ToggleRight className="w-8 h-8 text-primary" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="w-4 h-4" />
                         </div>
                         <h3 className="font-bold text-lg">{automation.name}</h3>
                      </div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                        Status: <span className={automation.active ? "text-emerald-500" : "text-zinc-500"}>
                          {automation.active ? "Enabled" : "Disabled"}
                        </span>
                        <span className="mx-2">•</span>
                        Runs: <span className="text-foreground">{automation.runCount || 0}</span>
                      </p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
                          <div className="mt-1">
                             <MessageSquare className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold uppercase text-muted-foreground">Trigger Keyword</p>
                             <p className="text-sm font-mono font-bold text-foreground">"{automation.triggerKeyword}"</p>
                          </div>
                       </div>

                       <div className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
                          <div className="mt-1">
                             <Settings2 className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold uppercase text-muted-foreground">Action Flow</p>
                             <div className="flex flex-col gap-2 mt-1">
                                <div className="flex items-center gap-2">
                                   <div className="px-2 py-0.5 rounded-lg bg-primary/20 text-primary text-[10px] font-bold">DM</div>
                                   <p className="text-[11px] text-foreground line-clamp-1 italic">"{automation.responseMessage}"</p>
                                </div>
                                {automation.commentReplyEnabled && (
                                   <div className="flex items-center gap-2">
                                      <div className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-500 text-[10px] font-bold">REPLY</div>
                                      <p className="text-[11px] text-foreground line-clamp-1 italic">"{automation.commentReplyMessage}"</p>
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                       <p className="text-[10px] text-muted-foreground/60 italic">
                          Platform: {automation.platform || "Instagram"}
                       </p>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                         onClick={() => handleDelete(automation.id)}
                       >
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
