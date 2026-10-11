"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/providers/Auth";
import { useToast } from "@/providers/Toast";

const MIN_PASSWORD_LENGTH = 6;

/** Opened from the password reset email; the link signs the user in first. */
export function ResetPasswordContainer() {
    const router = useRouter();
    const { user, isLoading, updatePassword } = useAuth();
    const { showToast } = useToast();
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return <Loader2 className="w-10 h-10 animate-spin text-primary" />;
    }

    if (!user) {
        return (
            <div className="max-w-sm text-center space-y-4">
                <h1 className="text-xl font-bold">Reset link expired</h1>
                <p className="text-sm text-muted-foreground">Request a new link from the login page.</p>
                <Link href="/login" className="inline-block text-sm font-bold text-primary hover:underline">
                    Back to log in
                </Link>
            </div>
        );
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        if (password !== confirmation) {
            setError("Passwords don't match");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        const result = await updatePassword(password);
        setIsSubmitting(false);
        if (!result.success) {
            setError(result.error || "Could not update the password");
            return;
        }
        showToast("Password updated");
        router.replace("/community/feed");
    };

    const inputClass =
        "w-full pl-11 pr-4 py-3.5 rounded-2xl border border-input bg-muted/30 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-[440px] p-8 md:p-10 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-6"
        >
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Choose a new password</h1>
                <p className="text-muted-foreground mt-2">For {user.email}</p>
            </div>
            {[
                { label: "New password", value: password, onChange: setPassword },
                { label: "Confirm password", value: confirmation, onChange: setConfirmation },
            ].map((field) => (
                <div key={field.label} className="space-y-2">
                    <label className="text-sm font-semibold ml-1">{field.label}</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="password"
                            autoComplete="new-password"
                            value={field.value}
                            onChange={(event) => field.onChange(event.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>
            ))}
            {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/25 disabled:opacity-70 flex items-center justify-center"
            >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update password"}
            </button>
        </form>
    );
}
