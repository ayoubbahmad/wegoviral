---
name: project_architect
description: Expert in the WeGoViral architecture, providing granular guidance for both frontend and backend systems.
---

# Project Architect Skill

Use this skill to navigate and enforce the architectural standards of the WeGoViral project. This is a multi-layered skill designed to provide precise guidance based on the component or layer you are working on.

## 🗺️ Project Overview

WeGoViral is a full-stack platform consisting of a modular Next.js frontend and a feature-based Node.js backend.

### 🏛️ Architecture Tree

Select the relevant path for your task:

- **[Frontend Architecture](./frontend/OVERVIEW.md)**: 6-layer modular system and Atomic Design.
  - [Components & Atomic Design](./frontend/COMPONENTS.md): Atoms, Molecules, Organisms.
  - [Containers & Features](./frontend/CONTAINERS.md): Smart components and Feature modules.
  - [Forms & Validation](./frontend/FORMS.md): React Hook Form and Zod.
  - [Global Providers](./frontend/PROVIDERS.md): Global context and HOCs.

- **[Backend Architecture](./backend/OVERVIEW.md)**: 4-layer modular system.
  - [Feature Modularity](./backend/FEATURES.md): Routes, Controllers, Services, and Models.

## 🚀 General Principles

1. **Separation of Concerns**: Keep business logic away from the presentation layer.
2. **Feature-based Modularity**: Organize code by domain/feature rather than by technical type (e.g., all "scripts" logic together).
3. **Strict Dependency Flow**: Follow the defined layer directions (e.g., View -> Controller -> Service -> Model).
4. **Type Safety**: Ensure end-to-end type safety using TypeScript and Zod.
