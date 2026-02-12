# Backend Architecture Overview

The CreatorOS backend is built with **Node.js**, **Express**, and **Prisma**. It follows a **4-Layer Modular Architecture** designed for scalability and clean separation of business logic from data access.

## 🏗️ The 4-Layer System

Each feature (e.g., `scripts`, `auth`) is encapsulated within its own directory in `src/features/` and consists of:

1.  **Routes Layer (`routes.ts`)**: Defines endpoints and applies middleware.
2.  **Controller Layer (`controller.ts`)**: Entry point for requests, handles parsing and response formatting.
3.  **Service Layer (`service.ts`)**: Contains all business logic and orchestration.
4.  **Model Layer (`model.ts`)**: Defines types, interfaces, and Zod schemas.

## 🚀 Core Rules

- **Layer Isolation**: Controllers must not interact with the database directly; they must use Services.
- **Portability**: Keep all domain-specific logic within the feature directory.
- **Strict Typing**: Use Zod for request body validation and TypeScript interfaces for all data structures.
- **Centralized Database**: All data access must go through the centralized Prisma client in `backend/src/lib/prisma.ts`.
