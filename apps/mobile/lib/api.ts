import { authClient } from './auth-client';
import { config } from './config';

const API_BASE_URL = config.apiBaseUrl;

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
}

/**
 * Make authenticated API requests with automatic cookie handling
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<{ data?: T; error?: string }> {
    try {
        const { method = 'GET', body, headers = {} } = options;

        // Get authentication cookies
        const cookies = authClient.getCookie();

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers,
        };

        // Add cookies if available
        if (cookies) {
            requestHeaders['Cookie'] = cookies;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { error: errorText || `HTTP ${response.status}` };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error('API request error:', error);
        return { error: 'Network error occurred' };
    }
}

/**
 * Get current user session from the server
 */
export async function getCurrentSession() {
    return apiRequest('/api/auth/get-session');
}

/**
 * Example: Get user profile data
 */
export async function getUserProfile() {
    return apiRequest('/api/user/profile');
}

/**
 * Example: Update user profile
 */
export async function updateUserProfile(data: { name?: string; email?: string }) {
    return apiRequest('/api/user/profile', {
        method: 'PUT',
        body: data,
    });
}