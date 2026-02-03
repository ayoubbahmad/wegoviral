"use client";

import Link from "next/link";
import {
    Zap,
    Shield,
    BarChart3,
    Users2,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/overview");
        }
    }, [user, isLoading, router]);

    if (isLoading) return null;
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-md">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Creator OS</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
                        <a href="#about" className="hover:text-foreground transition-colors">About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/login?tab=signup"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                    </div>

                    <div className="container mx-auto text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>The all-in-one OS for modern creators</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                                Dominate Social Media with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Intelligence.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                Track competitors, manage your content library, and analyze performance across all platforms. Built for the next generation of digital storytellers.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login?tab=signup"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/25"
                                >
                                    Start Your 14-Day Free Trial
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold text-lg border border-border hover:bg-secondary/80 transition-all"
                                >
                                    View Features
                                </Link>
                            </div>
                        </motion.div>

                        {/* App Screenshot Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-16 md:mt-24 relative"
                        >
                            <div className="rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden glassmorphism transform perspective-1000 rotate-x-5">
                                <div className="h-10 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                                </div>
                                <div className="p-4 md:p-8 bg-background">
                                    <div className="grid grid-cols-4 gap-4 mb-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-24 rounded-xl bg-card border border-border/50 animate-pulse" />
                                        ))}
                                    </div>
                                    <div className="h-64 rounded-xl bg-card border border-border/50 animate-pulse" />
                                </div>
                            </div>
                            <div className="absolute -inset-4 -z-10 bg-primary/20 blur-3xl opacity-20" />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-6 bg-secondary/30">
                    <div className="container mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
                            <p className="text-muted-foreground">Powerful tools designed specifically for creators who take their business seriously.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: BarChart3,
                                    title: "Deep Analytics",
                                    desc: "Understand exactly what drives engagement. No vanity metrics, just pure growth data."
                                },
                                {
                                    icon: Target,
                                    title: "Competitor Tracking",
                                    desc: "Monitor your competition without switching tabs. See what works for them and improve on it."
                                },
                                {
                                    icon: Library,
                                    title: "Content Library",
                                    desc: "Store your best hooks, scripts, and templates in one place. Never run out of ideas again."
                                },
                                {
                                    icon: Users2,
                                    title: "Community Intelligence",
                                    desc: "Identify your superfans and engage with your most loyal followers effectively."
                                },
                                {
                                    icon: Shield,
                                    title: "Enterprise Security",
                                    desc: "Your data is yours. Secure, encrypted, and backed up in real-time."
                                },
                                {
                                    icon: LayoutDashboard,
                                    title: "Unified Workflow",
                                    desc: "Stop jumping between 10 apps. Manage your entire social career from one dashboard."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-card border border-border shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="container mx-auto max-w-5xl">
                        <div className="p-12 md:p-20 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to scale your influence?</h2>
                                    <ul className="space-y-4 mb-10">
                                        {["Unlock viral growth patterns", "Save 10+ hours on content planning", "Data-driven decision making"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-white/80" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-center md:justify-end">
                                    <Link
                                        href="/login?tab=signup"
                                        className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform"
                                    >
                                        Get Creator OS Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 px-6 border-t border-border">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="font-bold">Creator OS</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2024 Creator OS. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-muted-foreground font-medium">
                        <a href="#" className="hover:text-foreground">Privacy</a>
                        <a href="#" className="hover:text-foreground">Terms</a>
                        <a href="#" className="hover:text-foreground">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const Target = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
)

const Library = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />
    </svg>
)
