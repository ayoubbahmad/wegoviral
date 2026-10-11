# WeGoViral - Frontend Documentation

Welcome to the WeGoViral frontend!

## 🚀 Core Technologies

- **Framework**: [Next.js](https://nextjs.org/)
- **State & Data Fetching**: [Tanstack Query (React Query)](https://tanstack.com/query/latest) & [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Styling**: Tailwind CSS + Framer Motion
- **API Client**: Axios with centralized configuration
- **Package Manager**: [Yarn](https://yarnpkg.com/)

## 🏗️ Architectural Pattern: 6-Layer Modular System

We follow a 6-layer modular architecture designed for scalability and maintainability.

1.  **Route (App)**: `src/app/.../page.tsx` - Next.js App Router entry points.
2.  **View (Page)**: `src/views/.../index.tsx` - **High-level Composition**. Orchestrates one or more containers.
3.  **View (Container)**: `src/containers/.../index.tsx` - **Smart Feature Modules**. Links UI to logic.
4.  **View & Logic (Provider)**: `src/providers/.../index.tsx` - **Global HOCs**. Manages global context (Auth, Theme, etc.).
5.  **Logic Layers**: `.../controller/`, `.../api/`, `.../forms/`, and `.../slice/` - Encapsulated reasoning for Containers, Providers, and Stores.
    - **Note**: `slice/` folders are specifically for complex state encapsulated within a Feature (Container).
6.  **Components**: `src/components/...` - **Atomic Design**. Reusable **Presentation Components** (Dumb).
    - **Rule**: Must be independent of application state.
    - **Rule**: NO imports from the zustand store, and no API calls.
    - **Rule**: Logic or data must be passed via props.

### 📂 Import Organization (Priority-Based)

To maintain clean and readable files, imports must be organized by **edit priority** and **contextual proximity**. This helps focus on what's most likely to change.

1. **External Modules**: (Least frequent changes) Node modules, libraries, and framework imports (e.g., `react`, `lucide-react`, `next/navigation`).
2. **Global/Shared Project Files**: (Medium frequency) Components, hooks, or utilities from `@/components`, `@/lib`, etc., that are not part of the current feature.
3. **Local Feature Files**: (Most frequent changes) Files belonging to the same component/container (e.g., `controller`, `api`, `constants`, `types`, `styles`, `views`).

**Example**:

```tsx
// 1. External
import { useState } from 'react';
import { Folder } from 'lucide-react';

// 2. Shared/Project-wide
import { Button } from '@/components/Button';
import { apiClient } from '@/lib/api-client';

// 3. Local Feature-specific
import { useLocalController } from './controller';
import { ProjectType } from './constants';
```

### Components vs. Containers

- **`src/components`**: **Atomic Design**. Contains "Dumb Components" (Atoms, Molecules, Organisms) that are reusable across different features.
- **`src/containers`**: **Feature Modules**. Smart compositions that represent established features, encapsulating their own logic and data.

## 📚 Detailed Documentation

Explore the guides in the `/docs` folder for in-depth patterns:

- [Architecture Guide](./docs/architecture.md) - Deep dive into our 4-layer pattern.
- [API Layer Guide](./docs/api-layer.md) - Data fetching, Tanstack Query, and type safety.
- [Forms & Validation](./docs/forms.md) - React Hook Form + Zod integration.
- [Design System](./docs/design-system.md) - UI components and styling guidelines.
