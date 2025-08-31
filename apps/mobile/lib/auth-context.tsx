import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from './auth-client';

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
    const { data: session, isPending, refetch } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set loading to false once we have session data (or confirmed no session)
        if (!isPending) {
            setIsLoading(false);
        }
    }, [isPending]);

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

    const value = {
        isAuthenticated: !!session?.user,
        isLoading: isLoading || isPending,
        user: session?.user,
        signOut,
        getSession,
        refreshSession,
        clearSession,
    };

    // Debug logging
    console.log('Auth Context Debug:', {
        session: session,
        isAuthenticated: !!session?.user,
        isLoading: isLoading || isPending,
        isPending
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