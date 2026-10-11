import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpaceId } from "../spaces";

interface SidebarState {
    sidebarCollapsed: boolean;
    lastSpace: SpaceId;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setLastSpace: (space: SpaceId) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            lastSpace: "community",
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            setLastSpace: (space) => set({ lastSpace: space }),
        }),
        {
            name: "sidebar-storage",
        }
    )
);
