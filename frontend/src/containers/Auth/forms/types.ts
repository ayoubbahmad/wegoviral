import { z } from "zod";
import type { MessageKey } from "@/i18n/messages";

type Translate = (key: MessageKey) => string;

// Built with the app's language so field errors read naturally

// --- Login Schema & Types ---
export const loginSchema = (t: Translate) =>
  z.object({
    email: z.string().email(t("auth.validation.email")),
    password: z.string().min(6, t("auth.validation.password")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;

// --- Signup Schema & Types ---
export const signupSchema = (t: Translate) =>
  z.object({
    name: z.string().min(2, t("auth.validation.name")),
    username: z
      .string()
      .min(3, t("auth.validation.usernameMin"))
      .max(30, t("auth.validation.usernameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("auth.validation.usernameChars")),
    email: z.string().email(t("auth.validation.email")),
    password: z.string().min(6, t("auth.validation.password")),
  });

export type SignupFormValues = z.infer<ReturnType<typeof signupSchema>>;

// --- Forgot Password Schema & Types ---
export const forgotPasswordSchema = (t: Translate) =>
  z.object({
    email: z.string().email(t("auth.validation.email")),
  });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;
