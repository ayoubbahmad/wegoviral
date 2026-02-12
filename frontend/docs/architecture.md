# Architecture Guide: Feature-Based & Atomic Design

To ensure scalability and maintainability, CreatorOS follows a **Feature-Based** modular architecture combined with **Atomic Design** principles.

## 🧱 Atomic Design (Dumb Components)

**Folder**: `src/components`

We organize our reusable UI elements following [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/):

- **Atoms**: Basic building blocks (e.g., `Button`, `Input`, `Label`).
- **Molecules**: Groups of atoms bonded together (e.g., `SearchBar`, `FormField`).
- **Organisms**: Complex UI components composed of molecules and/or atoms (e.g., `Navbar`, `Sidebar`, `VideoCard`).

**Rule**: These components are pure, logic-agnostic, and reusable across different "mini-applications".

## 🏗️ Feature-Based Modularity (Smart Containers)

**Folder**: `src/containers`

Each container is treated as a **self-contained "mini-application"** (Feature Module). Each module encapsulates its own UI, business logic, API communication, and form management.

## 🗺️ The 6-Layer System

1.  **Route Layer (`src/app`)**: Next.js App Router entry points. Minimal logic, strictly for routing and SEO.
2.  **Composition Layer (`src/views`)**: High-level orchestrators. They put together one or more containers to form a complete page view.
3.  **Feature Layer (`src/containers`)**: "Smart" modules representing specific features (e.g., `Scripts`, `Home`).
4.  **Provider Layer (`src/providers`)**: Global High-Order Components (HOCs) that provide context (e.g., `Auth`, `Theme`, `Toast`).
5.  **Logic Layer**: Encapsulated within Containers, and Providers:
    - `controller/`: Sub-hooks that manage the internal state and bridge the View to Data/Forms.
    - `api/`: Centralized API hooks, constants, and types using Tanstack Query.
    - `forms/`: Centralized React Hook Form logic, Zod schemas, and validation types.
    - `slice/`: Feature-owned Zustand state and actions (e.g., `src/containers/[Feature]/slice/index.ts`).
6.  **Component Layer (`src/components`)**: Pure UI components following **Atomic Design**.
    - **Independent**: Components should not know about the specific application logic.
    - **Dumb**: They should only handle presentation and simple UI state (e.g., "is open", "hovered").
    - **Prop-Driven**: They receive all data and callbacks (e.g., `onClick`, `onSubmit`) via props.
    - **NO Global State**: Must not import from the store, `@/providers`, or business-logic hooks.

### 🏙️ View (Container)

**File**: `src/containers/.../index.tsx`

The Container is a **Smart Component**.

- **Responsibility**: Composing multiple "atomic" components together and linking them to the feature-specific logic (the Controller).
- **Rule**: Acts as the orchestrator of a specific feature.

## 🕹️ The 4-Layer Feature Pattern

Within each feature module in `src/containers`, we follow a strict dependency flow:
**File**: `controller/index.ts`

The Controller is a custom hook that orchestrates the logic for a container.

- **Responsibility**: Managing local state, coordinating data from the API layer, and preparing data/handlers for the View.
- **Rule**: Consumes hooks from the `api` and `forms` folders.

## 🔌 3. API Layer

**Folder**: `/api`
**Files**: `index.ts`, `types.d.ts`

Encapsulates everything related to data fetching for the container.

- **`types.d.ts`**: Defines request payload and response interfaces.
- **`index.ts`**: Contains endpoint constants and Tanstack Query hooks (`useQuery`, `useMutation`) that wrap the global `apiClient`.
- **Rule**: Keeps types and data-fetching logic close to where they are used.

## 📝 4. Form Layer

**Folder**: `/forms`
**Files**: `index.ts`, `types.d.ts`

Encapsulates form validation and state management using React Hook Form and Zod.

- **`types.d.ts`**: Defines inferred TypeScript types.
- **`index.ts`**: Custom hooks (e.g., `use[FeatureName]Form`) that initialize `useForm` with resolvers.
- **`schemas.ts`**: Zod schemas for form validation.
- **Rule**: Validation logic never leaks into the UI or Controller.

## 🧱 Standard Dashboard Patterns

To maintain a premium and consistent feel across the platform, all dashboard sub-pages (Scripts, Videos, Automations, etc.) should follow the same layout pattern.

### 1. Page Wrapper

Always wrap the container content in a `PageContainer`. This ensures consistent padding, max-width, and responsive behavior across the entire dashboard.

### 2. Header & Actions

Use the `PageHeader` component at the top of every page.

- **Title**: Clear, concise page name.
- **Description**: Brief explanation of what the user can do.
- **Actions**: Primary actions (like "Create New") should be passed to the `actions` prop as a `Button`.

### 3. Controls Bar

Directly below the header, include a controls bar for list management:

- **Search**: Use `SearchInput` on the left.
- **View Switching**: Use `ViewToggle` to switch between `grid` and `table` modes.
- **Filters/Sort**: Add secondary `Button` components (variant="outline") for additional controls.

### 4. Empty States

When no data is available, use the `EmptyState` component instead of basic text.

---

## Folder Structure Example

```text
src/containers/FeatureName/
├── index.tsx              # View (Container) - Uses PageContainer & PageHeader
├── constants.ts           # View Constants
├── controller/
│   ├── constants.ts       # Controller Constants
│   └── index.ts           # Controller Hook
├── api/
│   ├── index.ts           # API Hooks & Endpoints
│   ├── constants.ts       # API Constants
│   └── types.d.ts         # Response/Payload Types
└── forms/
    ├── index.ts           # Form Hooks
    ├── constants.ts       # Form Constants
    ├── schemas.ts         # Zod Schemas
    └── types.d.ts         # Types
```
