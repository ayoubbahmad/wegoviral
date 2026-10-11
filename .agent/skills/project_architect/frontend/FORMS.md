# Forms & Validation

WeGoViral uses a standardized approach to form management using **React Hook Form** and **Zod** for validation.

## 🏗️ The Form Layer Structure

Within a container's `forms/` directory:

- **`schemas.ts`**: Zod schemas that define the validation rules.
- **`index.ts`**: Exports a custom hook (use[Feature]Form) that initializes `useForm` with the Zod resolver and schemas and handles the form state and submission.
- **`constants.ts`**: (optional: if the feature has its own constants) Constants for the form and not reusable globally.
- **`types.ts`**: (optional: if the feature has its own types) Type definitions for the form and not reusable globally.
- **`utils.ts`**: (optional: if the feature has its own utils) Utility functions for the form and not reusable globally.

## 🚀 Rules for Forms

- **Strict Typing**: All form values must be inferred from Zod schemas (`z.infer<typeof Schema>`).
- **Server-Side Compatibility**: Use `'use client'` for all form components and hooks.
- **Clear Defaults**: Always provide sensible `defaultValues` when initializing a form.
- **Validation-First**: Ensure all user inputs are validated before submission.
- **Reuse Schemas**: Use shared Zod schemas for common data structures (e.g., URL validation).
