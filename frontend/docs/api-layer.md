# API Layer Guide: Tanstack Query & Axios

The API layer is responsible for all external data communication. We use **Tanstack Query** for server state management and **Axios** as the HTTP client.

## 📡 Central Client
**File**: `src/lib/api-client.ts`

We use a centralized `apiClient` (Axios instance) that handles:
- **Base URL**: Automatically derived from environment variables.
- **Interceptors**: Injects authentication headers (if available) and handles global error responses.

## 📦 Container API Layer
Each container (feature) has its own `/api` folder to keep fetching logic encapsulated.

### 1. `types.ts`
Define your interfaces here.
```typescript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface UpdateProfilePayload {
  name?: string;
}
```

### 2. `index.ts`
Define your endpoints and Tanstack Query hooks.
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { UserProfile, UpdateProfilePayload } from "./types";

export const ENDPOINTS = {
  GET_PROFILE: "/user/profile",
};

export const useGetProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => apiClient.get(ENDPOINTS.GET_PROFILE),
  });
};
```

## 💡 Best Practices
- **Never export `apiClient` directly to Containers**: Always wrap API calls in custom hooks within the `/api` folder.
- **Key Factories**: For complex queries, use query key factories to maintain consistency.
- **Types First**: Always define response and payload types in `types.ts` before implementing hooks.
