"use client";

import { useAuth } from "@/lib/auth-context";
import { Mail, User as UserIcon, Camera } from "lucide-react";

export default function ProfilePage() {
    const { user, login } = useAuth();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <h2 className="text-xl font-bold">Sign in to view your profile</h2>
                <button
                    onClick={login}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground mt-2">Manage your account and preferences.</p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl">
                <div className="flex flex-col items-center sm:flex-row gap-6">
                    <div className="relative group cursor-pointer">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-background shadow-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                                <UserIcon className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">{user.name}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Email Address</label>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl">
                <h2 className="text-lg font-semibold mb-6">Connected Accounts</h2>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/20">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 rounded-lg">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium">Instagram</p>
                            <p className="text-xs text-muted-foreground">Connect to analyze your posts</p>
                        </div>
                    </div>

                    <button className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border">
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
}
