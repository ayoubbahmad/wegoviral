"use client";

import { Search, UserPlus, AlignLeft, Link2, CornerDownLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { EmptyState } from "@/components/EmptyState";
import { useT } from "@/i18n/provider";

const SIZES = ["nano", "micro", "small", "medium", "large", "mega"] as const;

// Mock data for suggested channels (empty initially or some suggestions)
const MOCK_SUGGESTED_CHANNELS = [
    { id: "1", name: "Ray William Johnson", followers: "18M", platform: "youtube", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ray" },
    { id: "2", name: "Sapiens Science", followers: "2.1M", platform: "tiktok", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sapi" },
];

export default function ChannelsPage() {
    const t = useT();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"niche" | "similar" | "manual">("niche");

    return (
        <PageContainer>
            <PageHeader 
                title={t("creator.channels.title")}
                description={t("creator.channels.description")}
            />

            {/* Search Section */}
            <div className="space-y-6">
                {/* Search Tabs */}
                <Tabs 
                    activeId={activeTab}
                    onChange={(id) => setActiveTab(id as any)}
                    items={[
                        { id: "niche", label: t("creator.channels.tabs.niche"), icon: AlignLeft },
                        { id: "similar", label: t("creator.channels.tabs.similar"), icon: UserPlus },
                        { id: "manual", label: t("creator.channels.tabs.manual"), icon: Link2 }
                    ]}
                    containerClassName="!justify-start"
                />

                {/* Input Area */}
                <div className="relative rounded-xl border border-border bg-card/50 p-2 focus-within:ring-1 focus-within:ring-primary transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[100px] p-3 text-sm placeholder:text-muted-foreground/70"
                        placeholder={t("creator.channels.placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-border/30">
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{t("creator.channels.filterBy")}</span>
                            <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground">
                                {t("creator.channels.niche")}
                            </button>
                             <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground">
                                {t("creator.channels.platform")}
                            </button>
                            {/* Dropdown button for size */}
                            <div className="relative group">
                                <button className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground flex items-center gap-1">
                                    {t("creator.channels.sizes.nano")}
                                </button>
                                {/* Dropdown Visual only for now */}
                                <div className="absolute top-full start-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl p-1 hidden group-hover:block z-50">
                                    {SIZES.map((size) => (
                                        <div key={size} className="px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded cursor-pointer">{t(`creator.channels.sizes.${size}`)}</div>
                                    ))}
                                </div>
                            </div>
                         </div>
                         
                         <Button 
                            variant="primary" 
                            size="sm"
                            className="h-8"
                         >
                             {t("creator.channels.search")}
                             <CornerDownLeft className="w-3 h-3 opacity-70 rtl:-scale-x-100" aria-hidden />
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
                                 <div key={channel.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-start">
                                     <div className="flex items-center gap-3">
                                         <img src={channel.avatar} alt={channel.name} className="w-8 h-8 rounded-full" />
                                         <div>
                                             <p className="text-sm font-semibold">{channel.name}</p>
                                             <p className="text-xs text-muted-foreground">{channel.followers} • {channel.platform}</p>
                                         </div>
                                     </div>
                                      <Button variant="ghost" size="sm" aria-label={t("creator.channels.add")} className="h-8 w-8 p-0 text-primary">
                                          <UserPlus className="w-4 h-4" />
                                      </Button>
                                 </div>
                             ))}
                         </div>
                    ) : (
                        <EmptyState 
                          title={t("creator.channels.noSuggestions")}
                          description={t("creator.channels.noSuggestionsBody")}
                          icon={Search}
                          className="flex-1 bg-transparent border-none p-0"
                        />
                    )}
                     <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <span>{t("creator.channels.loadMore")}</span>
                         <button className="hover:text-foreground transition-colors">{t("creator.channels.addAll")}</button>
                     </div>
                </div>

                 {/* Included Column */}
                 <div className="bg-card/30 border border-border rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <EmptyState 
                      title={t("creator.channels.emptyWatchlist")}
                      description={t("creator.channels.emptyWatchlistBody")}
                      className="flex-1 bg-transparent border-none p-0"
                    />
                    
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                         <button className="hover:text-foreground transition-colors">{t("creator.channels.removeAll")}</button>
                         <Button variant="pill" size="sm" className="opacity-50 cursor-not-allowed">{t("creator.channels.saveWatchlist")}</Button>
                     </div>
                </div>
            </div>
        </PageContainer>
    );
}
