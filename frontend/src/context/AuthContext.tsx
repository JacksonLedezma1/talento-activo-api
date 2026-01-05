import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../types';
import { Role } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isGestor: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('accessToken');
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = (user: User, accessToken: string) => {
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    };

    const isAuthenticated = !!token;
    const isGestor = user?.role === Role.GESTOR || user?.role === Role.ADMIN;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isGestor, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

