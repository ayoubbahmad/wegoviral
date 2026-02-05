"use client";

import { Zap, Mail, Lock, User, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthController } from "./controller";

export function AuthContainer() {
    const { 
        mode, 
        toggleMode, 
        error, 
        isSubmitting, 
        loginForm, 
        signupForm, 
        handleLoginSubmit, 
        handleSignupSubmit 
    } = useAuthController();

    return (
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

                <form 
                    onSubmit={mode === "login" 
                        ? loginForm.handleSubmit(handleLoginSubmit) 
                        : signupForm.handleSubmit(handleSignupSubmit)
                    } 
                    className="space-y-5"
                >
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
                                                {...signupForm.register("name")}
                                                placeholder="John Doe"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        {signupForm.formState.errors.name && (
                                            <p className="text-xs text-destructive ml-1">{signupForm.formState.errors.name.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1">Username</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                                            <input
                                                type="text"
                                                {...signupForm.register("username")}
                                                placeholder="johndoe"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        {signupForm.formState.errors.username && (
                                            <p className="text-xs text-destructive ml-1">{signupForm.formState.errors.username.message}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        {...(mode === "login" ? loginForm.register("email") : signupForm.register("email"))}
                                        placeholder="name@company.com"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                {mode === "login" ? (
                                    loginForm.formState.errors.email && (
                                        <p className="text-xs text-destructive ml-1">{loginForm.formState.errors.email.message}</p>
                                    )
                                ) : (
                                    signupForm.formState.errors.email && (
                                        <p className="text-xs text-destructive ml-1">{signupForm.formState.errors.email.message}</p>
                                    )
                                )}
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
                                        {...(mode === "login" ? loginForm.register("password") : signupForm.register("password"))}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                {mode === "login" ? (
                                    loginForm.formState.errors.password && (
                                        <p className="text-xs text-destructive ml-1">{loginForm.formState.errors.password.message}</p>
                                    )
                                ) : (
                                    signupForm.formState.errors.password && (
                                        <p className="text-xs text-destructive ml-1">{signupForm.formState.errors.password.message}</p>
                                    )
                                )}
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
                        onClick={toggleMode}
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
    );
}
