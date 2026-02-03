"use client";

import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-analysis/VideoPlayer";
import { VideoMetrics } from "@/components/video-analysis/VideoMetrics";
import { AnalysisActions } from "@/components/video-analysis/AnalysisActions";
import { FileText, AlignLeft, Info, BarChart2, Hash, Type } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the specific video
const MOCK_VIDEO_DATA = {
    id: "1",
    title: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and...",
    fullTitle: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and optimizes your body for peak health.",
    channelName: "@zack.chug",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zack",
    publishedAt: "11mo ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80", // Using a workout/health like image
    description: "Fast for 30 Days during Ramadan ? Fasting isn't just about skipping meals—it rewires your metabolism, burns fat, and optimizes your body for peak health. Here's what happens when you fast daily for 12 hours over 30 days: ⏳ First Few Days (Days 1-3): 🔹 Blood sugar stabilizes – No more energy crashes. 🔹 Glycogen stores deplete – Your body starts burning stored energy. 🔹 Insulin drops – Fat becomes more accessible as a fuel source. 🔹 Hunger hormones adjust ...",
    transcript: "It happens when you fast for 30 days during Ramadan.\n\nThe changes are shocking but beneficial.\n\nIn the first few days your blood sugar drops because there's no more glucose spike and this lowers your insulin and makes fat more accessible to be burned.\n\nNow after one week, autophagy kicks in where damaged cells are repaired and removed.",
    hashtags: ["#shorts", "#ramadan", "#fasting", "#health"]
};

// Jump links configuration
const JUMP_LINKS = [
    { label: "Actions", id: "actions", icon: ZapIcon },
    { label: "Metrics", id: "metrics", icon: BarChart2 },
    { label: "Description", id: "description", icon: AlignLeft },
    { label: "Transcript", id: "transcript", icon: FileText },
    { label: "Hook", id: "hook", icon: Hash }, // Placeholder icon
    { label: "Structure", id: "structure", icon: Type }, // Placeholder
    { label: "Style", id: "style", icon: Info }, // Placeholder
];

function ZapIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}


export default function VideoAnalysisPage() {
    const params = useParams();
    // In a real app, fetch data based on params.id

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header / Title Section */}
            <div>
                 <h1 className="text-xl font-bold leading-tight">{MOCK_VIDEO_DATA.title}</h1>
                 <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-muted-foreground">{MOCK_VIDEO_DATA.channelName}</span>
                    <img src={MOCK_VIDEO_DATA.channelAvatar} alt="Channel" className="w-5 h-5 rounded-full" />
                    <span className="text-sm text-muted-foreground ml-auto">{MOCK_VIDEO_DATA.publishedAt}</span>
                 </div>
            </div>

            <div className="grid lg:grid-cols-[350px_1fr] gap-8">
                {/* Left Column: Video Player */}
                <div className="w-full">
                    <VideoPlayer thumbnailUrl={MOCK_VIDEO_DATA.thumbnailUrl} />
                </div>

                {/* Right Column: Analysis Content */}
                <div className="space-y-8">
                    {/* Jump Links */}
                    <div className="flex flex-wrap gap-2 border-b border-border pb-4">
                        <span className="text-sm text-muted-foreground mr-2 py-1">Jump to:</span>
                        {JUMP_LINKS.map(link => (
                            <button key={link.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/30 hover:bg-secondary text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
                                <link.icon className="w-3 h-3" />
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* Actions Section */}
                    <div id="actions">
                        <AnalysisActions />
                    </div>

                    {/* Metrics Section */}
                    <div id="metrics" className="space-y-3">
                        <div className="flex items-center gap-2">
                             <BarChart2 className="w-5 h-5 text-blue-500" />
                             <h3 className="font-semibold text-lg text-blue-500">Metrics</h3>
                        </div>
                        <VideoMetrics />
                    </div>

                    {/* Description Section */}
                    <div id="description" className="p-4 rounded-xl border border-border bg-card space-y-3">
                         <div className="flex items-center gap-2">
                             <AlignLeft className="w-5 h-5 text-blue-500" />
                             <h3 className="font-semibold text-lg text-blue-500">Description</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{MOCK_VIDEO_DATA.description}</p>
                        <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 mt-2">
                            Show more
                        </button>
                    </div>
                    
                     {/* Transcript Section */}
                    <div id="transcript" className="p-4 rounded-xl border border-border bg-card space-y-3">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <h3 className="font-semibold text-lg text-blue-500">Transcript</h3>
                             </div>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                 <span className="text-xs">127 words</span>
                             </div>
                        </div>
                        <div className="space-y-4 mt-2">
                            {MOCK_VIDEO_DATA.transcript.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
