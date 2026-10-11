"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { useLoginForm, useSignupForm, LoginFormValues, SignupFormValues } from "../forms";

export const useAuthController = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, register, user, isLoading } = useAuth();

    const initialMode = searchParams?.get("tab") === "signup" ? "signup" : "login";
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginForm = useLoginForm();
    const signupForm = useSignupForm();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/community/feed");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        setError(null);
        loginForm.reset();
        signupForm.reset();
    }, [mode]);

    const handleLoginSubmit = async (values: LoginFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await login(values.email, values.password);
            if (!result.success) {
                setError(result.error || "An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupSubmit = async (values: SignupFormValues) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await register(values.email, values.username, values.password, values.name);
            if (!result.success) {
                setError(result.error || "An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === "login" ? "signup" : "login");
    };

    return {
        mode,
        toggleMode,
        error,
        isSubmitting,
        loginForm,
        signupForm,
        handleLoginSubmit,
        handleSignupSubmit,
    };
};
