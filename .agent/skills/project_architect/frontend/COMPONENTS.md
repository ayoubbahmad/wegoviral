# Atomic Design & Components

All reusable UI elements in `src/components` must follow **Atomic Design** principles. This ensures a consistent, high-quality design system.

## 🧱 The Atomic Hierarchy

- **Atoms**: Basic building blocks (e.g., `Button`, `Input`, `Label`).
- **Molecules**: Groups of atoms bonded together (e.g., `SearchBar`, `FormField`).

## 🚀 Rules for Components

- **Logic-Agnostic**: Components must be pure and "dumb". They should not know about business logic or API endpoints.
- **Independent**: Components should be reusable across different features and modules.
- **Prop-Driven**: Data and user interactions must be handled via props (e.g., `data`, `onClick`, `onChange`).
- **NO Global State**: Components must never import from Zustand stores, Global Context/Providers, or business-logic hooks.
- **Self-Contained Styling**: Use Tailwind CSS and ensure responsive behavior within the component itself.
