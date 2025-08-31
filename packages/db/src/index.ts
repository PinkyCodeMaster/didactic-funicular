import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import env from '@repo/env';
import * as schema from './schema';

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql, logger: true, schema });

export { db }; 