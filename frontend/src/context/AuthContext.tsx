import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import api from '../services/api';

// 1. The Shape of our Context
// This defines what data the "Radio Station" broadcasts.
interface AuthContextType {
    user: User | null;         // Who is logged in? (null if nobody)
    token: string | null;      // The JWT Access Key
    isAuthenticated: boolean;  // A quick check: True/False
    isLoading: boolean;        // Are we still checking local storage?
    login: (token: string, user: User) => void; // Function to log in
    logout: () => void;                         // Function to log out
}

// Create the Context with a default empty state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. The Provider (The Actual Radio Tower)
// This component wraps your entire app.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // Startup Logic: Check if we have a token saved
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false); // We are done checking
    }, []);

    // Login Action
    const login = (newToken: string, newUser: User) => {
        // 1. Save to State (React memory)
        setToken(newToken);
        setUser(newUser);
        
        // 2. Save to Storage (Browser memory - persists after refresh)
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    // Logout Action
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated: !!token, // Converts string to boolean (true if token exists)
            isLoading, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. The Custom Hook (The Receiver)
// This is a shortcut so we don't have to write "useContext(AuthContext)" every time.
// We just write "useAuth()".
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};