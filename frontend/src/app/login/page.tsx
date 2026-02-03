"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Zap, Mail, Lock, User, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, register, user, isLoading } = useAuth();

    const initialMode = searchParams.get("tab") === "signup" ? "signup" : "login";

    const [mode, setMode] = useState<"login" | "signup">(initialMode);

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/overview");
        }
    }, [user, isLoading, router]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setError(null);
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            let result;
            if (mode === "login") {
                result = await login(email, password);
            } else {
                result = await register(email, username, password, name);
            }

            if (!result.success) {
                setError(result.error || "An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="w-full max-w-[440px] z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <div className="p-8 md:p-10 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary mb-6 shadow-xl shadow-primary/20">
                            <Zap className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {mode === "login"
                                ? "Enter your details to access your dashboard"
                                : "Start your journey with Creator OS today"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {mode === "signup" && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold ml-1">Username</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                                                <input
                                                    type="text"
                                                    required
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="johndoe"
                                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-semibold">Password</label>
                                        {mode === "login" && (
                                            <button type="button" className="text-xs text-primary font-bold hover:underline">
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 px-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/25 disabled:opacity-70 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                mode === "login" ? "Sign In" : "Create Free Account"
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {mode === "login"
                                ? "New here? "
                                : "Already have an account? "}
                            <span className="text-primary font-bold">
                                {mode === "login" ? "Create an account" : "Log in"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
