"use client";

import { Trophy, Zap, Star, Target, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ChallengesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative p-6 bg-card border border-border rounded-2xl shadow-2xl">
                    <Trophy className="w-16 h-16 text-primary" />
                </div>
            </div>

            <div className="max-w-md space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Challenges</h1>
                <p className="text-muted-foreground text-lg">
                    Level up your content game with gamified sprints and consistency milestones.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
                {[
                    { icon: Zap, label: "Custom Challenges", desc: "Design your own rules, duration, and goals." },
                    { icon: Users, label: "Invite Friends", desc: "Compete with other creators and sync progress." },
                    { icon: Target, label: "Flexible Wins", desc: "Win solo, lead a group, or be the one and only winner." },
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm space-y-2">
                        <item.icon className="w-5 h-5 text-primary mx-auto" />
                        <h3 className="font-semibold text-sm">{item.label}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="pt-8">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                    Coming Soon
                </span>
            </div>
        </div>
    );
}
