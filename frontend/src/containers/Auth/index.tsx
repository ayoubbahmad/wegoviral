"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Zap, Mail, Lock, User, AlertCircle, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthController, AuthMode } from "./controller";
import { useT } from '@/i18n/provider';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';

export function AuthContainer() {
    const t = useT();
    const {
        mode,
        changeMode,
        error,
        isSubmitting,
        isGoogleLoading,
        emailSent,
        loginForm,
        signupForm,
        forgotForm,
        handleLoginSubmit,
        handleSignupSubmit,
        handleForgotSubmit,
        handleGoogleLogin,
    } = useAuthController();

    const onSubmit =
        mode === "login"
            ? loginForm.handleSubmit(handleLoginSubmit)
            : mode === "signup"
              ? signupForm.handleSubmit(handleSignupSubmit)
              : forgotForm.handleSubmit(handleForgotSubmit);

    const emailField =
        mode === "login"
            ? { props: loginForm.register("email"), error: loginForm.formState.errors.email?.message }
            : mode === "signup"
              ? { props: signupForm.register("email"), error: signupForm.formState.errors.email?.message }
              : { props: forgotForm.register("email"), error: forgotForm.formState.errors.email?.message };

    const passwordField =
        mode === "login"
            ? { props: loginForm.register("password"), error: loginForm.formState.errors.password?.message }
            : { props: signupForm.register("password"), error: signupForm.formState.errors.password?.message };

    return (
        <div className="w-full max-w-[440px] z-10">
            <div className="mb-8 flex items-center justify-between gap-3">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                    {t("auth.backHome")}
                </Link>
                <LanguageSwitcher />
            </div>

            <div className="p-8 md:p-10 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary mb-6 shadow-xl shadow-primary/20">
                        <Zap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{t(`auth.headings.${mode}.title`)}</h1>
                    <p className="text-muted-foreground mt-2">{t(`auth.headings.${mode}.subtitle`)}</p>
                </div>

                {emailSent ? (
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary">
                            <MailCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-lg font-bold">{emailSent.title}</h2>
                        <p className="text-sm text-muted-foreground">{emailSent.message}</p>
                        <button
                            type="button"
                            onClick={() => changeMode("login")}
                            className="text-sm font-bold text-primary hover:underline"
                        >
                            {t("auth.backToLogin")}
                        </button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={onSubmit} className="space-y-5">
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
                                            <Field
                                                label={t("auth.fullName")}
                                                icon={<User className="w-4 h-4" />}
                                                error={signupForm.formState.errors.name?.message}
                                                type="text"
                                                autoComplete="name"
                                                placeholder={t("auth.namePlaceholder")}
                                                {...signupForm.register("name")}
                                            />
                                            <Field
                                                label={t("auth.username")}
                                                icon={<span className="font-medium">@</span>}
                                                error={signupForm.formState.errors.username?.message}
                                                type="text"
                                                autoComplete="username"
                                                placeholder={t("auth.usernamePlaceholder")}
                                                {...signupForm.register("username")}
                                            />
                                        </>
                                    )}

                                    <Field
                                        label={t("auth.email")}
                                        icon={<Mail className="w-4 h-4" />}
                                        error={emailField.error}
                                        type="email"
                                        autoComplete="email"
                                        placeholder={t("auth.emailPlaceholder")}
                                        {...emailField.props}
                                    />

                                    {mode !== "forgot" && (
                                        <Field
                                            label={t("auth.password")}
                                            labelAction={
                                                mode === "login" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => changeMode("forgot")}
                                                        className="text-xs text-primary font-bold hover:underline"
                                                    >
                                                        {t("auth.forgot")}
                                                    </button>
                                                )
                                            }
                                            icon={<Lock className="w-4 h-4" />}
                                            error={passwordField.error}
                                            type="password"
                                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                                            placeholder="••••••••"
                                            {...passwordField.props}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
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
                                ) : mode === "login" ? (
                                    t("auth.signIn")
                                ) : mode === "signup" ? (
                                    t("auth.createAccount")
                                ) : (
                                    t("auth.sendReset")
                                )}
                            </button>
                        </form>

                        {mode !== "forgot" && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground font-bold">{t("auth.orContinue")}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isGoogleLoading}
                                    className="w-full py-3.5 px-4 flex items-center justify-center gap-3 rounded-2xl border border-border bg-background font-semibold hover:bg-secondary/50 transition-colors disabled:opacity-70"
                                >
                                    {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                                    {t("auth.google")}
                                </button>
                            </>
                        )}

                        <div className="text-center">
                            {mode === "forgot" ? (
                                <button
                                    type="button"
                                    onClick={() => changeMode("login")}
                                    className="text-sm font-bold text-primary hover:underline"
                                >
                                    {t("auth.backToLogin")}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => changeMode(mode === "login" ? "signup" : "login")}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {mode === "login" ? t("auth.newHere") : t("auth.haveAccount")}
                                    <span className="text-primary font-bold">
                                        {mode === "login" ? t("auth.createLink") : t("auth.logIn")}
                                    </span>
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: ReactNode;
    error?: string;
    labelAction?: ReactNode;
}

// Emails, usernames and passwords are always written left to right, even in Arabic
const isLatinField = (props: InputHTMLAttributes<HTMLInputElement>) =>
    props.type === "email" || props.type === "password" || props.autoComplete === "username";

const Field = forwardRef<HTMLInputElement, FieldProps>(({ label, icon, error, labelAction, ...inputProps }, ref) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center ms-1">
            <label className="text-sm font-semibold">{label}</label>
            {labelAction}
        </div>
        <div className="relative">
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
            <input
                ref={ref}
                {...inputProps}
                dir={isLatinField(inputProps) ? "ltr" : undefined}
                className="w-full px-11 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
        </div>
        {error && <p className="text-xs text-destructive ms-1">{error}</p>}
    </div>
));
Field.displayName = "Field";

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
);
