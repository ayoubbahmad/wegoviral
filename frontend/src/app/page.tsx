"use client";

import Link from "next/link";
import {
    Zap,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    MessagesSquare,
    CalendarDays,
    GraduationCap,
    Trophy,
    Award,
    PenLine,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { useT } from "@/i18n/provider";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";

const FEATURES = [
    { id: "community", icon: MessagesSquare },
    { id: "events", icon: CalendarDays },
    { id: "courses", icon: GraduationCap },
    { id: "challenges", icon: Trophy },
    { id: "points", icon: Award },
    { id: "tools", icon: PenLine },
] as const;

const STEPS = ["apply", "guide", "post"] as const;
const CTA_POINTS = ["feedback", "learn", "friends"] as const;

export default function LandingPage() {
    const t = useT();
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/community/feed");
        }
    }, [user, isLoading, router]);

    if (isLoading) return null;
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-md">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">WeGoViral</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">{t("landing.nav.features")}</a>
                        <a href="#join" className="hover:text-foreground transition-colors">{t("landing.nav.join")}</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher compact className="hidden sm:flex" />
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                            {t("landing.logIn")}
                        </Link>
                        <Link
                            href="/login?tab=signup"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                        >
                            {t("landing.join")}
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
                                <span>{t("landing.eyebrow")}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                                {t("landing.titleStart")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r rtl:bg-gradient-to-l from-primary to-purple-400">{t("landing.titleHighlight")}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                {t("landing.intro")}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login?tab=signup"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/25"
                                >
                                    {t("landing.apply")}
                                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold text-lg border border-border hover:bg-secondary/80 transition-all"
                                >
                                    {t("landing.seeFeatures")}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-6 bg-secondary/30">
                    <div className="container mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("landing.featuresTitle")}</h2>
                            <p className="text-muted-foreground">{t("landing.featuresBody")}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {FEATURES.map((feature) => (
                                <motion.div
                                    key={feature.id}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-card border border-border shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{t(`landing.features.${feature.id}.title`)}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{t(`landing.features.${feature.id}.body`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How to join */}
                <section id="join" className="py-20 px-6">
                    <div className="container mx-auto max-w-5xl">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("landing.joinTitle")}</h2>
                            <p className="text-muted-foreground">{t("landing.joinBody")}</p>
                        </div>
                        <ol className="grid md:grid-cols-3 gap-6">
                            {STEPS.map((step, index) => (
                                <li key={step} className="p-6 rounded-2xl border border-border bg-card">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-4">{index + 1}</span>
                                    <h3 className="text-lg font-bold mb-2">{t(`landing.steps.${step}.title`)}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.steps.${step}.body`)}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="container mx-auto max-w-5xl">
                        <div className="p-12 md:p-20 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
                            <div className="absolute top-0 end-0 -me-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t("landing.ctaTitle")}</h2>
                                    <ul className="space-y-4 mb-10">
                                        {CTA_POINTS.map((point) => (
                                            <li key={point} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-white/80" />
                                                <span className="font-medium">{t(`landing.ctaPoints.${point}`)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-center md:justify-end">
                                    <Link
                                        href="/login?tab=signup"
                                        className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform"
                                    >
                                        {t("landing.apply")}
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
                        <span className="font-bold">WeGoViral</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("landing.rights", { year: new Date().getFullYear() })}</p>
                    <LanguageSwitcher />
                </div>
            </footer>
        </div>
    );
}
