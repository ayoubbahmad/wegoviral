# Frontend Architecture Overview

CreatorOS follows a modular feature-based architecture combined with **Atomic Design** principles. This structure ensures that features are self-contained, portable, and easy to maintain.

## 🏗️ The 6-Layer System

1.  **Route Layer (`src/app`)**: Next.js App Router entry points. Minimal logic, strictly for routing and SEO.
2.  **Composition Layer (`src/views`)**: High-level orchestrators. They put together one or multiple containers to form a complete page view.
3.  **Feature Layer (`src/containers`)**: "Smart" modules representing specific features (e.g., `ScriptsList`, `AddCompetitorForm`, `CompetitorDetail`).
4.  **Provider Layer (`src/providers`)**: Global High-Order Components (HOCs) that provide context (e.g., `Auth`, `Theme`, `Toast`).
5.  **Logic Layer**: Encapsulated within Containers and Providers:
    - `controller/`: Sub-hooks managing internal state and bridging View to Data/Forms.
    - `api/`: Tanstack Query hooks, constants, and types.
    - `forms/`: React Hook Form logic, Zod schemas, and validation.
    - `slice/`: Feature-owned Zustand state.
6.  **Component Layer (`src/components`)**: Pure UI components following **Atomic Design**.

## 🚀 Core Rules

- **No Global Leakage**: Containers should not leak their internal logic to other containers.
- **Portability**: Each container in `src/containers` should be a self-contained "mini-application".
- **Clean Orchestration**: Views should only manage the layout.
