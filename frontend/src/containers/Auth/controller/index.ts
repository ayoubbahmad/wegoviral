"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { authApi } from "@/providers/Auth/api";
import {
    useLoginForm,
    useSignupForm,
    useForgotPasswordForm,
    LoginFormValues,
    SignupFormValues,
    ForgotPasswordFormValues,
} from "../forms";
import { useT } from "@/i18n/provider";

export type AuthMode = "login" | "signup" | "forgot";

/** Shown instead of the form once an email has been sent */
export interface EmailSentNotice {
    title: string;
    message: string;
}

export const useAuthController = () => {
    const t = useT();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, register, loginWithGoogle, requestPasswordReset, user, isLoading } = useAuth();

    const initialMode = searchParams?.get("tab") === "signup" ? "signup" : "login";
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [emailSent, setEmailSent] = useState<EmailSentNotice | null>(null);

    const loginForm = useLoginForm();
    const signupForm = useSignupForm();
    const forgotForm = useForgotPasswordForm();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/community/feed");
        }
    }, [user, isLoading, router]);

    const changeMode = (next: AuthMode) => {
        setMode(next);
        setError(null);
        setEmailSent(null);
        loginForm.reset();
        signupForm.reset();
        forgotForm.reset();
    };

    const handleLoginSubmit = async (values: LoginFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await login(values.email, values.password);
            if (!result.success) {
                setError(result.error || t("auth.unexpected"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupSubmit = async (values: SignupFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const username = values.username.toLowerCase();
            const { available, reason } = await authApi.checkUsername(username);
            if (!available) {
                signupForm.setError("username", { message: reason || t("auth.usernameTaken") });
                return;
            }

            const result = await register(values.email, username, values.password, values.name);
            if (!result.success) {
                setError(result.error || t("auth.unexpected"));
            } else if (result.needsConfirmation) {
                setEmailSent({
                    title: t("auth.confirmTitle"),
                    message: t("auth.confirmBody", { email: values.email }),
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t("auth.unexpected"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotSubmit = async (values: ForgotPasswordFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await requestPasswordReset(values.email);
            if (!result.success) {
                setError(result.error || t("auth.unexpected"));
            } else {
                setEmailSent({
                    title: t("auth.inboxTitle"),
                    message: t("auth.inboxBody", { email: values.email }),
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsGoogleLoading(true);
        const result = await loginWithGoogle();
        // On success the browser is already navigating to Google
        if (!result.success) {
            setError(result.error || t("auth.errors.googleFailed"));
            setIsGoogleLoading(false);
        }
    };

    return {
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
    };
};
