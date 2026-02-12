# Feature Containers (Smart Components)

Containers are the "brains" of each feature module. They reside in `src/containers` and manage the interaction between the UI (Components) and the logic (Controllers).

## 🏗️ Structure of a Container

Each container is a self-contained module in its own directory:

- **`index.tsx`**: The main "Smart Component" that orchestrates the feature view.
- **`controller/`**: Sub-hooks that manage internal state and coordinate logic.
- **`api/`**: (optional: if the feature has its own API) Data fetching logic, hooks, and type definitions.
- **`forms/`**: (optional: if the feature is a forms) React Hook Form logic and Zod schemas.
- **`components/`**: (optional: if the feature has its own components) Local components composed of atoms and molecules that are specific to this feature and not reusable globally (e.g., `Navbar`, `Sidebar`, `VideoCard`).
- **`types.ts`**: Type definitions for the container.
- **`utils.ts`**: (optional: if the feature has its own utils) Utility functions for the container and not reusable globally.
- **`constants.ts`**: (optional: if the feature has its own constants) Constants for the container and not reusable globally.

## 🚀 Rules for Containers

- **Encapsulation**: Keep all feature-specific logic within the container directory.
- **Decoupling**: Containers should communicate with the rest of the app via global stores.
- **Single Responsibility**: Each container should represent one distinct feature or screen section.
- **Controller-Centric**: Business logic should be handled by a custom hook in the `controller/` directory.
