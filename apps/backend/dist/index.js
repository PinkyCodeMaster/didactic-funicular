import { serve } from '@hono/node-server';
import { auth } from './lib/auth.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import env from '@repo/env';
const app = new Hono();
// Add CORS middleware - simplified for development
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    credentials: true,
}));
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
// Add a test endpoint to verify CORS
app.get('/api/test', (c) => {
    return c.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});
// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
    console.log(`Auth request: ${c.req.method} ${c.req.url}`);
    console.log('Origin:', c.req.header('origin'));
    console.log('Cookie:', c.req.header('cookie'));
    return auth.handler(c.req.raw);
});
serve({
    fetch: app.fetch,
    port: env.PORT,
    hostname: '0.0.0.0', // Listen on all network interfaces
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Network access: http://192.168.0.28:${info.port}`);
});
