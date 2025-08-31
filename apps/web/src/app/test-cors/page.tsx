'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestCorsPage() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testCors = async () => {
        setLoading(true);
        setResult('');

        try {
            const response = await fetch('http://localhost:9000/api/test', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResult(`✅ CORS working! Response: ${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setResult(`❌ CORS Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const testAuth = async () => {
        setLoading(true);
        setResult('');

        try {
            const response = await fetch('http://localhost:9000/api/auth/get-session', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResult(`✅ Auth endpoint working! Response: ${JSON.stringify(data, null, 2)}`);
            } else {
                setResult(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setResult(`❌ Auth CORS Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>CORS Test</CardTitle>
                        <CardDescription>
                            Test CORS configuration between frontend and backend
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Button onClick={testCors} disabled={loading}>
                                {loading ? 'Testing...' : 'Test CORS'}
                            </Button>
                            <Button onClick={testAuth} disabled={loading} variant="outline">
                                {loading ? 'Testing...' : 'Test Auth Endpoint'}
                            </Button>
                        </div>

                        {result && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                            </div>
                        )}

                        <div className="mt-6 text-sm text-gray-600">
                            <p><strong>Expected behavior:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Test CORS should return a success message</li>
                                <li>Test Auth Endpoint should return session data or null</li>
                                <li>No CORS errors should appear in the console</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}