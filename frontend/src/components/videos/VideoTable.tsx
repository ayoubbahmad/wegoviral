import { TrendingUp, Eye, ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { Video } from "./VideoCard";

interface VideoTableProps {
  videos: Video[];
}

export function VideoTable({ videos }: VideoTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Video</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center text-green-500">Outlier</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Platform</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Views</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Engagement</th>
              <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr 
                key={video.id} 
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors group cursor-pointer"
              >
                <td className="p-4">
                  <Link href={`/video/${video.id}`} className="flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 max-w-[300px]">
                      <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">{video.channelName}</div>
                      <div className="text-xs text-muted-foreground truncate">{video.title}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-black">
                    <TrendingUp className="w-3 h-3" />
                    {video.metrics.outlierScore || "1x"}
                  </div>
                </td>
                <td className="p-4">
                    {video.platform === "youtube" && <span className="text-[10px] font-bold text-red-500 uppercase">YouTube</span>}
                    {video.platform === "tiktok" && <span className="text-[10px] font-bold text-foreground uppercase">TikTok</span>}
                    {video.platform === "instagram" && <span className="text-[10px] font-bold text-pink-500 uppercase">Instagram</span>}
                </td>
                <td className="p-4 text-sm font-semibold tabular-nums">{video.metrics.views}</td>
                <td className="p-4 text-sm font-semibold text-blue-500 tabular-nums">{video.metrics.engagementRate || "N/A"}</td>
                <td className="p-4 text-xs text-muted-foreground">{video.publishedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
