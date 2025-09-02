import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from './auth-client';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
    signOut: () => Promise<void>;
    getSession: () => Promise<any>;
    refreshSession: () => void;
    clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending, refetch, error } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [hasTimedOut, setHasTimedOut] = useState(false);
    const [localSession, setLocalSession] = useState<any>(null);

    // Check for local session on mount
    useEffect(() => {
        const checkLocalSession = async () => {
            try {
                const storedSession = await SecureStore.getItemAsync('mobile-auth-session');
                if (storedSession) {
                    setLocalSession(JSON.parse(storedSession));
                }
            } catch (error) {
                console.log('No local session found');
            }
        };

        checkLocalSession();
    }, []);

    useEffect(() => {
        // Set loading to false once we have session data (or confirmed no session)
        if (!isPending) {
            setIsLoading(false);
        }
    }, [isPending]);

    useEffect(() => {
        // Add a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            console.warn('Session check timed out, falling back to local session or no auth');
            setHasTimedOut(true);
            setIsLoading(false);
        }, 1500); // 1.5 second timeout

        return () => clearTimeout(timeout);
    }, []);

    const signOut = async () => {
        try {
            await authClient.signOut();
            // Force a session refresh after sign out
            refetch();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const getSession = async () => {
        try {
            return await authClient.getSession();
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    };

    const refreshSession = () => {
        refetch();
    };

    const clearSession = async () => {
        try {
            await authClient.signOut();
            refetch();
        } catch (error) {
            console.error('Clear session error:', error);
        }
    };

    // Use remote session if available, otherwise fall back to local session
    const currentSession = session || (hasTimedOut ? localSession : null);
    const isAuthenticated = !!currentSession?.user;

    const value = {
        isAuthenticated,
        isLoading: (isLoading || isPending) && !hasTimedOut,
        user: currentSession?.user,
        signOut,
        getSession,
        refreshSession,
        clearSession,
    };

    // Debug logging
    console.log('Auth Context Debug:', {
        session: session,
        localSession: localSession,
        currentSession: currentSession,
        isAuthenticated,
        isLoading: (isLoading || isPending) && !hasTimedOut,
        isPending,
        hasTimedOut,
        error: error?.message || null
    });

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}