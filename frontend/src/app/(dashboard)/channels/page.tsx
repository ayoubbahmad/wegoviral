"use client";

import { Search, SlidersHorizontal, UserPlus, Info, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for suggested channels (empty initially or some suggestions)
const MOCK_SUGGESTED_CHANNELS = [
    { id: "1", name: "Ray William Johnson", followers: "18M", platform: "youtube", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ray" },
    { id: "2", name: "Sapiens Science", followers: "2.1M", platform: "tiktok", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sapi" },
];

export default function ChannelsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="space-y-2">
                 <h1 className="text-3xl font-bold tracking-tight">Build your watchlist</h1>
                 <p className="text-muted-foreground">Find the best channels to use as inspiration for your content</p>
            </div>

            {/* Search Section */}
            <div className="space-y-4">
                {/* Search Tabs */}
                <div className="flex border-b border-border">
                    <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-foreground">
                        <div className="flex items-center gap-2">
                            <span className="rotate-90">≡</span> {/* Placeholder for the 'Describe your Niche' list icon */}
                            Describe your Niche
                        </div>
                    </button>
                     <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        <div className="flex items-center gap-2">
                             <UserPlus className="w-4 h-4" />
                             Similar to Channel
                        </div>
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        <div className="flex items-center gap-2">
                             <span className="rotate-45">📎</span> 
                             Manual
                        </div>
                    </button>
                </div>

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
                         
                         <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                             Search
                             <span className="text-[10px] opacity-70">↵</span>
                         </button>
                    </div>
                </div>
            </div>

            {/* Suggested & Included Lists */}
            <div className="grid md:grid-cols-2 gap-6">
                 {/* Suggested Column */}
                <div className="bg-card/30 border border-border rounded-2xl p-6 min-h-[300px] flex flex-col">
                    <div className="flex flex-col h-full items-center justify-center text-center text-muted-foreground space-y-2 p-8">
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
                                         <button className="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg transition-colors">
                                             <UserPlus className="w-4 h-4" />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                        ) : (
                            <>
                                <p className="text-sm">Use the textbox above to get suggestions</p>
                            </>
                        )}
                    </div>
                     <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <span>Load more</span>
                         <button className="hover:text-foreground transition-colors">Add all to watchlist</button>
                     </div>
                </div>

                 {/* Included Column */}
                 <div className="bg-card/30 border border-border rounded-2xl p-6 min-h-[300px] flex flex-col">
                    <div className="flex flex-col h-full items-center justify-center text-center text-muted-foreground space-y-2">
                        <p className="text-sm">No channels added yet</p>
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <button className="hover:text-foreground transition-colors">Remove all</button>
                         <button className="bg-blue-600/20 text-blue-500 px-3 py-1.5 rounded-lg font-medium cursor-not-allowed">Save watchlist</button>
                     </div>
                </div>
            </div>
        </div>
    );
}
