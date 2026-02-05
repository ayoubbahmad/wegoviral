# State Management Guide

In CreatorOS, we use three distinct patterns for managing state, each suited for different types of data.

---

## 1. Server State (Tanstack Query)
**Where to use**: `src/containers/[Feature]/api/`

Tanstack Query is our primary tool for managing state that comes from the server.

- **Use for**: API responses, caching, synchronization with the backend.
- **Benefits**: Automatic caching, fresh/stale logic, loading/error states, and background refetching.
- **Pattern**: Define custom hooks in the feature's `api/` folder.

```tsx
// Example usage in Container/Controller
const { data: projects, isLoading } = useGetProjects();
```

---

## 2. State management (Zustand)
**Where to use**: `src/containers/[Feature]/slice`

Zustand is used for lightweight, high-performance global state that doesn't necessarily need to be in a bulky Context provider.

- **Use for**: Persistent UI preferences (sidebar collapse), global modals, complex client-side workflows that span multiple pages.
- **Benefits**: Minimal boilerplate, extremely fast, persistent by default (via middleware).
- **Pattern**: 
    - **Feature Modular**: `src/containers/[Feature]/slice/index.ts`
```tsx
// Example usage (Feature Modular)
const { sidebarCollapsed, toggleSidebar } = useSidebarStore();
// Note: imported from @containers/Sidebar/slice
```

---

## 3. Dependency Injection & Static Context (React Context)
**Where to use**: `src/providers/`

We use React Context primarily for architectural "Pillars" that need to wrap the component tree.

- **Use for**: Authentication (Auth), Theme (Theming), Toast notifications.
- **Benefits**: Deeply integrated with React's lifecycle for top-level HOCs.
- **Pattern**: Modular providers in `src/providers/[Name]/index.tsx`.

---

## Decision Matrix

| State Type | Solution | Location |
| :--- | :--- | :--- |
| **Server Data** | Tanstack Query | `src/containers/api/` |
| **Auth / Theme** | Context | `src/providers/` |
| **Local Feature Logic** | Controller Hook | `src/containers/controller/` |
| **Form State** | React Hook Form | `src/containers/forms/` |
