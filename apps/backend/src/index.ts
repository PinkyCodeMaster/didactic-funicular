import { serve } from '@hono/node-server'
import { auth } from './lib/auth.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import env from '@repo/env'

const app = new Hono()

// Add CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000'], // Allow requests from Next.js dev server
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  return auth.handler(c.req.raw)
})

serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
