import { Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from '@/i18n/provider';

interface VideoPlayerProps {
    thumbnailUrl: string;
    videoUrl?: string;
}

export function VideoPlayer({ thumbnailUrl, videoUrl }: VideoPlayerProps) {
    const t = useT();
    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black border border-border shadow-2xl">
                <img
                    src={thumbnailUrl}
                    alt={t('creator.video.thumbnail')}
                    className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                        <Play className="h-8 w-8 text-white fill-white ms-1" />
                    </div>
                </div>
                
                {/* Overlay Text from screenshot check - usually title overlay is on the video itself in TikTok/Shorts, 
                    but here we just show the thumbnail. */}
            </div>
            
            <a 
                href={videoUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
                <Play className="w-4 h-4" />
                <span>{t('creator.video.playNewTab')}</span>
            </a>
        </div>
    );
}
