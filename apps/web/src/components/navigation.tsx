'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

export function Navigation() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: session } = await authClient.getSession();
                setUser(session?.user || null);
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    if (loading) {
        return (
            <nav className="flex items-center justify-between p-4 bg-white border-b">
                <Link href="/" className="text-xl font-bold">
                    Your App
                </Link>
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </nav>
        );
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-white border-b">
            <Link href="/" className="text-xl font-bold">
                Your App
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link href="/account">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Account
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <Button variant="outline" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}