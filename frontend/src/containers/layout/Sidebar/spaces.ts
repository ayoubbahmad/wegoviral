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
    ClipboardCheck,
    CalendarDays,
    Medal,
    GraduationCap,
    Shield,
    Gauge,
    History,
    UserCheck,
    BookOpenCheck,
    Link2,
    Flag,
    LayoutGrid,
    Gem,
    type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/roles";
import type { User } from "@/providers/Auth/types";

export type SpaceId = "community" | "creator" | "admin";

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    /** Hidden unless the user has this permission */
    requires?: Permission;
    /** Extra visibility rule that isn't a permission */
    visibleWhen?: (user: User) => boolean;
}

export interface Space {
    id: SpaceId;
    label: string;
    description: string;
    icon: LucideIcon;
    basePath: string;
    defaultHref: string;
    navItems: NavItem[];
    /** Hidden from the switcher unless the user has this permission */
    requires?: Permission;
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
            {
                name: "Review posts",
                href: "/community/reviews",
                icon: ClipboardCheck,
                visibleWhen: (user) => user.onboarding.canReviewPosts,
            },
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
    admin: {
        id: "admin",
        label: "Admin",
        description: "Manage members and the community",
        icon: Shield,
        basePath: "/admin",
        defaultHref: "/admin/overview",
        requires: "admin.access",
        navItems: [
            { name: "Overview", href: "/admin/overview", icon: Gauge },
            { name: "Approvals", href: "/admin/approvals", icon: UserCheck, requires: "members.approve" },
            { name: "Members", href: "/admin/members", icon: Users },
            { name: "Moderation", href: "/admin/moderation", icon: Flag, requires: "community.moderate" },
            { name: "Spaces", href: "/admin/spaces", icon: LayoutGrid, requires: "spaces.manage" },
            { name: "Tiers", href: "/admin/tiers", icon: Gem, requires: "tiers.manage" },
            { name: "Onboarding", href: "/admin/onboarding", icon: BookOpenCheck, requires: "community.settings" },
            { name: "Invite links", href: "/admin/invites", icon: Link2, requires: "invites.manage" },
            { name: "Activity log", href: "/admin/activity", icon: History },
        ],
    },
};

export const SPACE_LIST = Object.values(SPACES);

export const getSpaceFromPath = (pathname: string): SpaceId | null =>
    SPACE_LIST.find(
        (space) => pathname === space.basePath || pathname.startsWith(`${space.basePath}/`)
    )?.id ?? null;
