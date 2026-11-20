import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

if (typeof DATABASE_URL !== 'string' || DATABASE_URL.length === 0) {
  throw new Error('DATABASE_URL is required to initialize the database.');
}

const client = createClient({ url: DATABASE_URL });

export const db = drizzle(client, { schema });
