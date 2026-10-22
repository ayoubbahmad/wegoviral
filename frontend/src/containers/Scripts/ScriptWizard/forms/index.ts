import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useT } from "@/i18n/provider";
import { 
    scriptTopicSchema, 
    scriptRefinementSchema, 
    ScriptTopicValues, 
    ScriptRefinementValues 
} from "./types";

export * from "./types";

export const useScriptTopicForm = () => {
  const t = useT();
  return useForm<ScriptTopicValues>({
    resolver: zodResolver(scriptTopicSchema(t)),
    defaultValues: {
      topic: "",
    },
  });
};

export const useScriptRefinementForm = () => {
  const t = useT();
  return useForm<ScriptRefinementValues>({
    resolver: zodResolver(scriptRefinementSchema(t)),
    defaultValues: {
      refinement: "",
    },
  });
};
