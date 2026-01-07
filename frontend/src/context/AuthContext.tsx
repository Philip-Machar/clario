import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

// 1. The Shape of our Context
interface AuthContextType {
    user: User | null;         
    token: string | null;      
    isAuthenticated: boolean;  
    isLoading: boolean;        
    login: (token: string, user: User) => void; 
    logout: () => void;                         
}

// Create the Context with a default empty state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. The Provider 
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
            isAuthenticated: !!token, 
            isLoading, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. The Custom Hook
// This is a shortcut so we don't have to write "useContext(AuthContext)" every time.
// We just write "useAuth()".
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};