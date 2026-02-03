"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const MOCK_USER: User = {
    id: "mock-user-1",
    name: "Demo Creator",
    email: "creator@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
};

const defaultContext: AuthContextType = {
    user: null,
    isLoading: false,
    login: () => { },
    logout: () => { }
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem("mock_auth_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = () => {
        setUser(MOCK_USER);
        localStorage.setItem("mock_auth_user", JSON.stringify(MOCK_USER));
        router.push("/");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("mock_auth_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
