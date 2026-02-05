import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// --- Script Topic Schema & Types ---
export const scriptTopicSchema = z.object({
  topic: z.string().min(10, "Topic must be at least 10 characters long to get a good result.").max(1000),
});

export type ScriptTopicValues = z.infer<typeof scriptTopicSchema>;

export const useScriptTopicForm = () => {
  return useForm<ScriptTopicValues>({
    resolver: zodResolver(scriptTopicSchema),
    defaultValues: {
      topic: "",
    },
  });
};

// --- Script Refinement Schema & Types ---
export const scriptRefinementSchema = z.object({
  refinement: z.string().min(2, "Refinement query is too short.").max(500),
});

export type ScriptRefinementValues = z.infer<typeof scriptRefinementSchema>;

export const useScriptRefinementForm = () => {
  return useForm<ScriptRefinementValues>({
    resolver: zodResolver(scriptRefinementSchema),
    defaultValues: {
      refinement: "",
    },
  });
};
