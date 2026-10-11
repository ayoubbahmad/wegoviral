"use client";

import { Search, SlidersHorizontal, UserPlus, Info, Check, AlignLeft, Link2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { EmptyState } from "@/components/EmptyState";

// Mock data for suggested channels (empty initially or some suggestions)
const MOCK_SUGGESTED_CHANNELS = [
    { id: "1", name: "Ray William Johnson", followers: "18M", platform: "youtube", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ray" },
    { id: "2", name: "Sapiens Science", followers: "2.1M", platform: "tiktok", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sapi" },
];

export default function ChannelsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"niche" | "similar" | "manual">("niche");

    return (
        <PageContainer>
            <PageHeader 
                title="Build your watchlist"
                description="Find the best channels to use as inspiration for your content"
            />

            {/* Search Section */}
            <div className="space-y-6">
                {/* Search Tabs */}
                <Tabs 
                    activeId={activeTab}
                    onChange={(id) => setActiveTab(id as any)}
                    items={[
                        { id: "niche", label: "Describe your Niche", icon: AlignLeft },
                        { id: "similar", label: "Similar to Channel", icon: UserPlus },
                        { id: "manual", label: "Manual", icon: Link2 }
                    ]}
                    containerClassName="!justify-start"
                />

                {/* Input Area */}
                <div className="relative rounded-xl border border-border bg-card/50 p-2 focus-within:ring-1 focus-within:ring-primary transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] p-3 text-sm placeholder:text-muted-foreground/70"
                        placeholder="Describe the content you want to make"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-border/30">
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Filter suggestions by:</span>
                            <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground">
                                Niche
                            </button>
                             <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground">
                                Platform
                            </button>
                            {/* Dropdown button for size */}
                            <div className="relative group">
                                <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground flex items-center gap-1">
                                    Nano &lt; 10k followers
                                </button>
                                {/* Dropdown Visual only for now */}
                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#18181b] border border-border rounded-lg shadow-xl p-1 hidden group-hover:block z-50">
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Nano &lt; 10k followers</div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Micro 10k - 50k followers</div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Small 50k - 250k followers</div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Medium 250k - 1M followers</div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Large 1M - 5M followers</div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">Mega &gt; 5M followers</div>
                                </div>
                            </div>
                         </div>
                         
                         <Button 
                            variant="primary" 
                            size="sm"
                            className="h-8"
                         >
                             Search
                             <span className="text-[10px] opacity-70">↵</span>
                         </Button>
                    </div>
                </div>
            </div>

            {/* Suggested & Included Lists */}
            <div className="grid md:grid-cols-2 gap-6">
                 {/* Suggested Column */}
                <div className="bg-card/30 border border-border rounded-2xl p-6 min-h-[400px] flex flex-col">
                    {MOCK_SUGGESTED_CHANNELS.length > 0 && searchQuery ? (
                         <div className="w-full space-y-3">
                             {MOCK_SUGGESTED_CHANNELS.map(channel => (
                                 <div key={channel.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-left">
                                     <div className="flex items-center gap-3">
                                         <img src={channel.avatar} alt={channel.name} className="w-8 h-8 rounded-full" />
                                         <div>
                                             <p className="text-sm font-semibold">{channel.name}</p>
                                             <p className="text-xs text-muted-foreground">{channel.followers} • {channel.platform}</p>
                                         </div>
                                     </div>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary">
                                          <UserPlus className="w-4 h-4" />
                                      </Button>
                                 </div>
                             ))}
                         </div>
                    ) : (
                        <EmptyState 
                          title="No suggestions yet"
                          description="Use the textbox above to describe your niche and find inspiration."
                          icon={Search}
                          className="flex-1 bg-transparent border-none p-0"
                        />
                    )}
                     <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <span>Load more</span>
                         <button className="hover:text-foreground transition-colors">Add all to watchlist</button>
                     </div>
                </div>

                 {/* Included Column */}
                 <div className="bg-card/30 border border-border rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <EmptyState 
                      title="Watchlist is empty"
                      description="Add channels from the suggestions to build your reference library."
                      className="flex-1 bg-transparent border-none p-0"
                    />
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <button className="hover:text-foreground transition-colors">Remove all</button>
                         <Button variant="pill" size="sm" className="opacity-50 cursor-not-allowed">Save watchlist</Button>
                     </div>
                </div>
            </div>
        </PageContainer>
    );
}
