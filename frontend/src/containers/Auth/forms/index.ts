import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useT } from "@/i18n/provider";
import { 
    loginSchema, 
    signupSchema, 
    forgotPasswordSchema,
    LoginFormValues, 
    SignupFormValues,
    ForgotPasswordFormValues
} from "./types";

export * from "./types";

export const useLoginForm = () => {
  const t = useT();
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });
};

export const useSignupForm = () => {
  const t = useT();
  return useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema(t)),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
};

export const useForgotPasswordForm = () => {
  const t = useT();
  return useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: {
      email: "",
    },
  });
};
