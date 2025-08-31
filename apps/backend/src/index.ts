import { serve } from '@hono/node-server'
import { auth } from './lib/auth.js'
import { Hono } from 'hono'
import env from '@repo/env'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
