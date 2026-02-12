# Global Providers & Context

Providers in `src/providers` are High-Order Components (HOCs) that manage global state and provide context to the entire application.

## 🏗️ Common Providers

- **`AuthProvider`**: Manages user session and authentication state.
- **`ThemeProvider`**: Handles visual themes and styling tokens.
- **`ToastProvider`**: Manages global notification systems.
- **`QueryProvider`**: Sets up Tanstack Query for data fetching.

## 🚀 Rules for Providers

- **Minimal Exposure**: Only expose the data and functions that are truly global.
- **Lazy Loading**: Avoid heavy computations inside the provider's render cycle.
- **Atomic Hooks**: Provide small, focused hooks (e.g., `useAuth`) to consume individual parts of the context.
- **Centralized Wrapper**: Ensure all providers are wrapped in a single root layout or a centralized `Providers` component.
- **Boundary Control**: Use Providers to handle cross-cutting concerns like global error boundaries or loading states.
