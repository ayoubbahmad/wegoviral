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
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  Instagram,
  Clapperboard,
  Edit2,
  LayoutGrid,
  List as ListIcon,
  Filter
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
    searchTerm,
    setSearchTerm,
    selectedPlatform,
    setSelectedPlatform,
    handleCreate,
    handleDelete, 
    handleToggleActive,
    handleUpdate 
  } = useAutomationsController();

  const [isAdding, setIsAdding] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    triggerKeyword: "",
    responseMessage: "",
    commentReplyEnabled: false,
    commentReplyMessage: "",
    isGlobal: true,
    instagramPostId: ""
  });

  const mockedPosts = [
    { id: "post_1", thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop", title: "New AI Wearable Video" },
    { id: "post_2", thumbnail: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop", title: "Scale Your Agency (Reel)" },
    { id: "post_3", thumbnail: "https://images.unsplash.com/photo-1611162616484-2a2951163988?w=100&h=100&fit=crop", title: "Direct Response Marketing 101" }
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.triggerKeyword || !formData.responseMessage) return;
    
    if (editingId) {
      await handleUpdate(editingId, formData);
    } else {
      await handleCreate(formData);
    }

    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      name: "", 
      triggerKeyword: "", 
      responseMessage: "",
      commentReplyEnabled: false,
      commentReplyMessage: "",
      isGlobal: true,
      instagramPostId: ""
    });
  };

  const startEdit = (automation: any) => {
    setFormData({
      name: automation.name,
      triggerKeyword: automation.triggerKeyword,
      responseMessage: automation.responseMessage,
      commentReplyEnabled: automation.commentReplyEnabled,
      commentReplyMessage: automation.commentReplyMessage || "",
      isGlobal: automation.isGlobal,
      instagramPostId: automation.instagramPostId || ""
    });
    setEditingId(automation.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="DM Automations"
        description="Trigger automatic messages based on keywords in comments or mentions."
        actions={
          <Button onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingId(null);
            } else {
              setIsAdding(true);
            }
          }} variant={isAdding ? "outline" : "primary"} className="pl-3">
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

                {/* Instagram Post Binding */}
                <div className="md:col-span-3 space-y-4 pt-2 border-t border-border/50">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-sm font-bold">Target Specific Post</p>
                         <p className="text-xs text-muted-foreground">Link this automation to a specific Instagram post or Reel.</p>
                      </div>
                      <div className="flex bg-muted/50 p-1 rounded-xl">
                         <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, isGlobal: true, instagramPostId: "" })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.isGlobal ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                         >
                            Global
                         </button>
                         <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, isGlobal: false })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!formData.isGlobal ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                         >
                            Specific Post
                         </button>
                      </div>
                   </div>

                   <AnimatePresence>
                      {!formData.isGlobal && (
                         <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                         >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                               {mockedPosts.map((post) => (
                                  <div 
                                     key={post.id}
                                     onClick={() => setFormData({ ...formData, instagramPostId: post.id })}
                                     className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${formData.instagramPostId === post.id ? "bg-primary/10 border-primary shadow-sm" : "bg-background border-border hover:border-primary/50"}`}
                                  >
                                     <img src={post.thumbnail} className="w-10 h-10 rounded-lg object-crop" />
                                     <div className="min-w-0">
                                        <p className="text-xs font-bold truncate">{post.title}</p>
                                        <p className="text-[10px] text-muted-foreground">Instagram</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" variant="primary">
                    <CheckCircle2 className="w-4 h-4" />
                    {editingId ? "Update Automation" : "Save Automation"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input 
                  placeholder="Search automations..." 
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border/50 focus:border-primary"
               />
            </div>
            <div className="flex bg-muted/50 p-1 rounded-xl shrink-0">
               <button 
                  onClick={() => setSelectedPlatform("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlatform === "all" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
               >
                  All
               </button>
               <button 
                  onClick={() => setSelectedPlatform("instagram")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlatform === "instagram" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
               >
                  Instagram
               </button>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <div className="flex bg-muted/50 p-1 rounded-xl">
               <button 
                  onClick={() => setViewType("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
               >
                  <LayoutGrid className="w-4 h-4" />
               </button>
               <button 
                  onClick={() => setViewType("table")}
                  className={`p-1.5 rounded-lg transition-all ${viewType === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
               >
                  <ListIcon className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid gap-4">
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
                <h3 className="text-xl font-bold">No results found</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedPlatform("all"); }}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : viewType === "grid" ? (
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
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            Status: <span className={automation.active ? "text-emerald-500" : "text-zinc-500"}>
                              {automation.active ? "Enabled" : "Disabled"}
                            </span>
                          </p>
                          <span className="text-muted-foreground/30">•</span>
                          <div className="flex items-center gap-1">
                             {automation.isGlobal ? (
                                <Globe className="w-3 h-3 text-muted-foreground" />
                             ) : (
                                <Clapperboard className="w-3 h-3 text-primary" />
                             )}
                             <span className="text-[10px] font-bold text-muted-foreground">
                                {automation.isGlobal ? "Global" : "Linked Post"}
                             </span>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-muted-foreground/60">
                          Runs: <span className="text-foreground">{automation.runCount || 0}</span>
                        </div>
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
                         <div className="flex items-center gap-1">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="text-primary/50 hover:text-primary hover:bg-primary/10"
                             onClick={() => startEdit(automation)}
                           >
                              <Edit2 className="w-4 h-4" />
                           </Button>
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
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border-border/50">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Automation</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Platform</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Keyword</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Action Flow</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Runs</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/50">
                        {automations.map((automation) => (
                           <tr key={automation.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${automation.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/30'}`}>
                                       <Zap className="w-4 h-4" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold">{automation.name}</p>
                                       <p className="text-[10px] text-muted-foreground">{automation.isGlobal ? "Global rule" : "Post-specific"}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <Instagram className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Instagram</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <code className="text-[11px] px-2 py-1 rounded-md bg-muted font-bold">"{automation.triggerKeyword}"</code>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1">
                                    <div className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold">DM</div>
                                    {automation.commentReplyEnabled && (
                                       <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                                    )}
                                    {automation.commentReplyEnabled && (
                                       <div className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-bold">REPLY</div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-xs font-bold">{automation.runCount || 0}</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1">
                                    <button 
                                       onClick={() => handleToggleActive(automation.id, automation.active)}
                                       className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                    >
                                       {automation.active ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground/30" />}
                                    </button>
                                    <button 
                                       onClick={() => startEdit(automation)}
                                       className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                    >
                                       <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                       onClick={() => handleDelete(automation.id)}
                                       className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
          )}
        </div>

        {/* Safety Sidebar */}
        <div className="space-y-6">
           <Card className="p-6 bg-amber-500/5 border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-500 mb-4">
                 <AlertTriangle className="w-5 h-5" />
                 <h4 className="font-bold">Instagram Safety</h4>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">Monthly Limits</p>
                    <p className="text-xs leading-relaxed">Safety limit: <span className="font-bold text-foreground">200 automated messages/hour</span> to avoid account flags.</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">7-Day Window</p>
                    <p className="text-xs leading-relaxed">Automations only trigger for comments made within the last 7 days.</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase text-muted-foreground">One Rule Per Post</p>
                    <p className="text-xs leading-relaxed">Only the first matched automation will trigger per interaction.</p>
                 </div>
                 <div className="pt-2 border-t border-amber-500/10">
                    <div className="flex items-start gap-2 text-xs text-amber-700/70 italic">
                       <Info className="w-3 h-3 mt-0.5 shrink-0" />
                       <p>We use the official Instagram Business API to keep your account safe.</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-6 bg-primary/5 border-primary/20">
              <h4 className="font-bold mb-4">Post Binding</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                 Link your automations to specific posts to run different campaigns on each Reel or post.
              </p>
              <div className="p-3 bg-background rounded-2xl border border-border/50 text-center">
                 <p className="text-[10px] font-bold text-primary italic">Pro Tip</p>
                 <p className="text-[11px] mt-1">Global rules act as a backup for all other posts.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
