import { z } from "zod";
import type { MessageKey } from "@/i18n/messages";

type Translate = (key: MessageKey) => string;

// Built with the app's language so field errors read naturally

// --- Script Topic Schema & Types ---
export const scriptTopicSchema = (t: Translate) =>
  z.object({
    topic: z.string().min(10, t("creator.wizard.errors.topic")).max(1000),
  });

export type ScriptTopicValues = z.infer<ReturnType<typeof scriptTopicSchema>>;

// --- Script Refinement Schema & Types ---
export const scriptRefinementSchema = (t: Translate) =>
  z.object({
    refinement: z.string().min(2, t("creator.wizard.errors.refinement")).max(500),
  });

export type ScriptRefinementValues = z.infer<ReturnType<typeof scriptRefinementSchema>>;
