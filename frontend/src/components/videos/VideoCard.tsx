import { Play, TrendingUp, Eye, FolderPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddToProjectModal } from "@/components/projects/AddToProjectModal";

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  channelAvatarUrl: string;
  publishedAt: string;
  views: string;
  likes: string;
  comments?: string;
  platform: "youtube" | "tiktok" | "instagram";
  metrics: {
    outlierScore?: string;
    views: string;
    engagementRate?: string;
  };
}

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group block relative">
        <Link href={`/video/${video.id}`}>
          <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-muted">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2">
               {video.platform === "youtube" && <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">YT</div>}
               {video.platform === "tiktok" && <div className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded font-bold">TT</div>}
               {video.platform === "instagram" && <div className="bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">IG</div>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white fill-white opacity-80" />
            </div>
          </div>
        </Link>

        {/* Save to Project Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="absolute top-2 left-2 p-2 rounded-lg bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:scale-110 z-10"
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        <div className="mt-3 space-y-2">
          <Link href={`/video/${video.id}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <img
              src={video.channelAvatarUrl}
              alt={video.channelName}
              className="h-5 w-5 rounded-full"
            />
            <span className="text-xs text-muted-foreground truncate">{video.channelName}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{video.publishedAt}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
              {video.metrics.outlierScore && (
                  <div className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-1.5 py-1 text-xs font-medium text-green-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>{video.metrics.outlierScore}</span>
                  </div>
              )}
               <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-1.5 py-1 text-xs font-medium text-blue-500">
                  <Eye className="w-3 h-3" />
                  <span>{video.metrics.views}</span>
              </div>
               {video.metrics.engagementRate && (
                  <div className="flex items-center gap-1.5 rounded-md bg-orange-500/10 px-1.5 py-1 text-xs font-medium text-orange-500">
                      <TrendingUp className="w-3 h-3 rotate-180" />
                      <span>{video.metrics.engagementRate}</span>
                  </div>
               )}
          </div>
        </div>
      </div>

      <AddToProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoTitle={video.title}
      />
    </>
  );
}
