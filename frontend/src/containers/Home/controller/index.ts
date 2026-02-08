import { useGetHomeSummary } from "../api";
import { 
  Users, 
  Activity, 
  Eye, 
  ArrowUpRight,
  Globe,
  Flame,
  Trophy
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
    Users,
    Activity,
    Eye,
    ArrowUpRight,
    Globe,
    Flame,
    Trophy
};

export const useHomeController = () => {
    const { data: summary, isLoading } = useGetHomeSummary();

    const stats = (summary?.stats || []).map(stat => ({
        ...stat,
        icon: ICON_MAP[stat.icon] || Globe
    }));

    return {
        stats,
        isLoading,
        videos: summary?.videos || [],
        scripts: summary?.scripts || [],
        projects: summary?.projects || [],
        challenges: summary?.challenges || []
    };
};
