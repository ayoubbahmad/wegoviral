import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    scriptTopicSchema, 
    scriptRefinementSchema, 
    ScriptTopicValues, 
    ScriptRefinementValues 
} from "./types";

export * from "./types";

export const useScriptTopicForm = () => {
  return useForm<ScriptTopicValues>({
    resolver: zodResolver(scriptTopicSchema),
    defaultValues: {
      topic: "",
    },
  });
};

export const useScriptRefinementForm = () => {
  return useForm<ScriptRefinementValues>({
    resolver: zodResolver(scriptRefinementSchema),
    defaultValues: {
      refinement: "",
    },
  });
};
