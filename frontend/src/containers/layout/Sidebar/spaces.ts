import {
    LayoutDashboard,
    BarChart2,
    Users,
    Users2,
    Target,
    Library,
    Trophy,
    Zap,
    Video,
    FileText,
    FolderOpen,
    Paintbrush,
    MessageSquare,
    CalendarDays,
    Medal,
    GraduationCap,
    type LucideIcon,
} from "lucide-react";

export type SpaceId = "community" | "creator";

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export interface Space {
    id: SpaceId;
    label: string;
    description: string;
    icon: LucideIcon;
    basePath: string;
    defaultHref: string;
    navItems: NavItem[];
}

export const SPACES: Record<SpaceId, Space> = {
    community: {
        id: "community",
        label: "Community",
        description: "Timeline, events, courses and more",
        icon: Users2,
        basePath: "/community",
        defaultHref: "/community/feed",
        navItems: [
            { name: "Timeline", href: "/community/feed", icon: MessageSquare },
            { name: "Events", href: "/community/events", icon: CalendarDays },
            { name: "Leaderboard", href: "/community/leaderboard", icon: Medal },
            { name: "Courses", href: "/community/courses", icon: GraduationCap },
            { name: "Members", href: "/community/members", icon: Users2 },
            { name: "Challenges", href: "/community/challenges", icon: Trophy },
        ],
    },
    creator: {
        id: "creator",
        label: "Creator Space",
        description: "Your personal creator tools",
        icon: Zap,
        basePath: "/creator",
        defaultHref: "/creator/home",
        navItems: [
            { name: "Home", href: "/creator/home", icon: LayoutDashboard },
            { name: "Videos", href: "/creator/videos", icon: Video },
            { name: "Scripts", href: "/creator/scripts", icon: FileText },
            { name: "Projects", href: "/creator/projects", icon: FolderOpen },
            { name: "Performance", href: "/creator/performance", icon: BarChart2 },
            { name: "Followers", href: "/creator/followers", icon: Users },
            { name: "Automations", href: "/creator/automations", icon: Zap },
            { name: "Competitors", href: "/creator/competitors", icon: Target },
            // { name: "Channels", href: "/creator/channels", icon: Target },
            { name: "Library", href: "/creator/library", icon: Library },
            { name: "Design System", href: "/creator/design-system", icon: Paintbrush },
        ],
    },
};

export const SPACE_LIST = Object.values(SPACES);

export const getSpaceFromPath = (pathname: string): SpaceId | null =>
    SPACE_LIST.find(
        (space) => pathname === space.basePath || pathname.startsWith(`${space.basePath}/`)
    )?.id ?? null;
