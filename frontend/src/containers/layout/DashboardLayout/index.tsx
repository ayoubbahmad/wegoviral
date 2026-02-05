import { Sidebar } from "@/containers/layout/Sidebar";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useUIStore();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className={cn(
                "min-h-screen transition-all duration-300 ease-in-out",
                sidebarCollapsed ? "pl-20" : "pl-64"
            )}>
                <div className="container mx-auto p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
