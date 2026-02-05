# Forms & Validation: React Hook Form + Zod

Forms in CreatorOS are managed using **React Hook Form** for performance and **Zod** for schema-based validation.

## 📝 Layer Structure
Each container with forms has a dedicated `/forms` folder.


### 1. `schemas.ts`
Define your schemas and inferred types here.
```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Too short"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### 2. `index.ts`
Create custom hooks to initialize the form.
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "./schemas";

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
};
```

## 🏗️ View Integration (UI)
In your `index.tsx`, use the spread operator to register inputs.
```tsx
const { register, formState: { errors } } = loginForm;

<input {...register("email")} />
{errors.email && <span>{errors.email.message}</span>}
```

## 🎮 Controller Integration (Logic)
The controller handles the submission logic.
```typescript
const handleLoginSubmit = async (values: LoginFormValues) => {
  // logic here
};

return { loginForm, handleLoginSubmit };
```

## 💡 Best Practices
- **Custom Components**: Wrap raw inputs in styled components for consistency.
- **Validation Timing**: Use `mode: "onBlur"` or `mode: "onChange"` in `useForm` if real-time feedback is needed.
- **Separate Schemas**: If a container has multiple forms, define separate schemas and hooks (e.g., `loginSchema`, `signupSchema`).
