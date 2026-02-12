# Feature Modularity (Backend)

The backend is organized around **Features**. Each feature represents a specific domain of the application and encapsulates all its technical requirements.

## 🏗️ Folder Structure Example

```text
backend/src/features/
  └── [feature_name]/
      ├── routes.ts      # Endpoint definitions
      ├── controller.ts  # Request/Response handling
      ├── service.ts     # Business logic
      └── model.ts       # Types & Interfaces
```

## 🚀 Rules for Layers

### 1. Routes (`routes.ts`)

- Use the Express `Router`.
- Apply validation middleware (using Zod) and authentication middleware (`protect`).
- Keep the route definitions clean and declarative.

### 2. Controller (`controller.ts`)

- Extract data from `req.body`, `req.params`, and `req.query`.
- Call the appropriate method in the Service layer.
- Handle HTTP status codes (200, 201, 400, etc.) and format the JSON response.

### 3. Service (`service.ts`)

- Implement the "Smart" logic of the feature.
- Use the Prisma client for data persistence.
- Services should return data or throw errors; they should not be aware of HTTP.

### 4. Model (`model.ts`)

- Use Zod to define input/output schemas.
- Export TypeScript types using `z.infer`.
- Define any feature-specific interfaces or constants here.
