"use client";

import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-analysis/VideoPlayer";
import { VideoMetrics } from "@/components/video-analysis/VideoMetrics";
import { AnalysisModals } from "@/components/video-analysis/AnalysisModals";
import { AnalysisDetails } from "@/components/video-analysis/AnalysisDetails";
import { 
    FileText, 
    AlignLeft, 
    Zap, 
    BarChart2, 
    Hash, 
    Type, 
    Anchor, 
    Layout, 
    Palette,
    ArrowUpRight,
    Play
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the specific video
const MOCK_VIDEO_DATA = {
    id: "1",
    title: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and...",
    fullTitle: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and optimizes your body for peak health.",
    channelName: "@zack.chug",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zack",
    publishedAt: "11mo ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1541534741688-6078c65b5a33?w=800&q=400",
    description: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and optimizes your body for peak health. Here's what happens when you fast daily for 12 hours over 30 days: ⏳ First Few Days (Days 1-3): 🔹 Blood sugar stabilizes – No more energy crashes. 🔹 Glycogen stores deplete – Your body starts burning stored energy. 🔹 Insulin drops – Fat becomes more accessible as a fuel source. 🔹 Hunger hormones adjust ...",
    transcript: "It happens when you fast for 30 days during Ramadan.\n\nThe changes are shocking but beneficial.\n\nIn the first few days your blood sugar drops because there's no more glucose spike and this lowers your insulin and makes fat more accessible to be burned.\n\nNow after one week, autophagy kicks in where damaged cells are repaired and removed.",
};

// Jump links configuration
const JUMP_LINKS = [
    { label: "Actions", id: "actions", icon: Zap },
    { label: "Metrics", id: "metrics", icon: BarChart2 },
    { label: "Description", id: "description", icon: AlignLeft },
    { label: "Transcript", id: "transcript", icon: FileText },
    { label: "Hook", id: "hook", icon: Anchor },
    { label: "Structure", id: "structure", icon: Layout },
    { label: "Style", id: "style", icon: Palette },
];

export default function VideoAnalysisPage() {
    const params = useParams();

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-32 pt-4">
            {/* Header Content Area */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-black leading-tight tracking-tight text-foreground max-w-4xl">
                    {MOCK_VIDEO_DATA.fullTitle}
                </h1>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 group cursor-pointer hover:border-primary/50 transition-colors">
                      <img src={MOCK_VIDEO_DATA.channelAvatar} alt="Channel" className="w-5 h-5 rounded-full border border-border/50" />
                      <span className="text-sm font-bold text-foreground truncate">{MOCK_VIDEO_DATA.channelName}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                   </div>
                   <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">{MOCK_VIDEO_DATA.publishedAt}</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start">
                {/* Left Column: Video Sticky Preview */}
                <div className="sticky top-8 space-y-6">
                    <VideoPlayer thumbnailUrl={MOCK_VIDEO_DATA.thumbnailUrl} />
                </div>

                {/* Right Column: Deep Analysis Content */}
                <div className="space-y-12">
                    {/* Jump Navigation */}
                    <div className="p-1.5 rounded-2xl bg-card border border-border/50 flex flex-wrap gap-1 shadow-sm">
                        {JUMP_LINKS.map(link => (
                            <button 
                                key={link.id} 
                                onClick={() => scrollToSection(link.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary/80 text-xs font-black transition-all text-muted-foreground hover:text-foreground active:scale-95 translate-y-0 hover:-translate-y-0.5"
                            >
                                <link.icon className="w-3.5 h-3.5" />
                                <span className="uppercase tracking-wider">{link.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Actions Section */}
                    <section id="actions">
                        <AnalysisModals />
                    </section>

                    {/* Metrics Section */}
                    <section id="metrics" className="space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                             <BarChart2 className="w-5 h-5 shadow-sm" />
                             <h3 className="font-bold text-xl tracking-tight uppercase">Performance Metrics</h3>
                        </div>
                        <VideoMetrics />
                    </section>

                    {/* Description Section */}
                    <section id="description" className="p-8 rounded-3xl border border-border bg-card/30 relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-6 text-blue-500">
                             <AlignLeft className="w-5 h-5" />
                             <h3 className="font-bold text-xl tracking-tight uppercase">Description</h3>
                        </div>
                        <p className="text-sm leading-[1.8] text-muted-foreground font-medium whitespace-pre-wrap">
                            {MOCK_VIDEO_DATA.description}
                        </p>
                        <button className="mt-6 flex items-center gap-2 p-2 px-4 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                            Show full description
                            <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </section>
                    
                    {/* Transcript Section */}
                    <section id="transcript" className="p-8 rounded-3xl border border-border bg-card/30 space-y-6">
                         <div className="flex items-center justify-between border-b border-border/50 pb-6">
                             <div className="flex items-center gap-2 text-purple-500">
                                <FileText className="w-5 h-5" />
                                <h3 className="font-bold text-xl tracking-tight uppercase">Transcript</h3>
                             </div>
                             <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-muted-foreground uppercase bg-secondary/50 px-3 py-1 rounded-full">127 words</span>
                                 <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-all">
                                    <FileText className="w-4 h-4" />
                                 </button>
                             </div>
                        </div>
                        <div className="space-y-6 mt-4 max-w-2xl">
                            {MOCK_VIDEO_DATA.transcript.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-sm leading-[2] text-muted-foreground font-medium border-l-2 border-purple-500/20 pl-6 py-1">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Deep Analysis Details (Hook, Structure, Style) */}
                    <section id="hook" className="pt-8">
                         <AnalysisDetails />
                    </section>

                </div>
            </div>
        </div>
    );
}
