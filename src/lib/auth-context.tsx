"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    instagramConnected?: boolean;
    connectInstagram?: () => void;
    disconnectInstagram?: () => void;
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
    logout: () => { },
    instagramConnected: false,
    connectInstagram: () => { },
    disconnectInstagram: () => { }
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [instagramConnected, setInstagramConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem("mock_auth_user");
        const storedInsta = localStorage.getItem("mock_insta_connected");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedInsta === "true") {
            setInstagramConnected(true);
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
        setInstagramConnected(false);
        localStorage.removeItem("mock_auth_user");
        localStorage.removeItem("mock_insta_connected");
        router.push("/login");
    };

    const connectInstagram = () => {
        setInstagramConnected(true);
        localStorage.setItem("mock_insta_connected", "true");
    };

    const disconnectInstagram = () => {
        setInstagramConnected(false);
        localStorage.setItem("mock_insta_connected", "false");
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            instagramConnected,
            connectInstagram,
            disconnectInstagram
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
