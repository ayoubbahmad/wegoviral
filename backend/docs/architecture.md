# WeGoViral - Backend Architecture Guide

Welcome to the WeGoViral backend! This document outlines our 4-layer modular architecture, designed for scalability, maintainability, and clean separation of concerns.

## 🏗️ Architectural Pattern: 4-Layer Modular System

We follow a feature-based structure where each capability (e.g., `scripts`, `auth`) is encapsulated within its own directory in `src/features/`.

Each feature is organized into four distinct layers:

1.  **Routes Layer (`routes.ts`)**:
    *   Defines the API endpoints for the feature.
    *   Responsible for applying middleware (Auth, Validation, etc.).
    *   Maps HTTP methods to Controller functions.

2.  **Controller Layer (`controller.ts`)**:
    *   **Entry point** for business logic.
    *   Handles request parsing (params, body, query).
    *   Orchestrates one or more **Services**.
    *   Formats and sends the HTTP response.
    *   **Rule**: Controllers should NOT interact with the database directly.

3.  **Service Layer (`service.ts`)**:
    *   Contains the **Business Logic**.
    *   Performs data processing, heavy computations, and orchestration.
    *   Interacts with the **Prisma Client** or other external APIs.
    *   **Rule**: Services should be reusable across different controllers or even other services.

4.  **Model Layer (`model.ts`)**:
    *   Defines **Data Interfaces** and **Types**.
    *   Includes DTOs (Data Transfer Objects) and Zod validation schemas.
    *   Contains thin data-access helpers or specific domain logic linked to the data structure.

## 📁 Directory Structure

```
backend/src/features/
  └── [feature_name]/
      ├── routes.ts      # Endpoint definitions
      ├── controller.ts  # Request/Response handling
      ├── service.ts     # Business logic
      └── model.ts       # Types & Interfaces
```

## 🚀 Best Practices

*   **Dependency Injection**: Controllers should import services. Services should import the Prisma client.
*   **Centralized Database Client**: Use `backend/src/lib/prisma.ts` for a single Prisma instance.
*   **Authentication**: Secure features using the `protect` middleware from `backend/src/middleware/auth.middleware`.
*   **Error Handling**: Use consistent try-catch blocks in controllers and format errors for the frontend.
