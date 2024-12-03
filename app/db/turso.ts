// /lib/turso.ts

import { Client, createClient } from '@libsql/client';

// Creamos una única instancia del cliente para reutilizarla.
const url = process.env.TURSO_DATABASE_URL?.replace(/[\r\n]+/g, '').trim();
if (!url) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

const authToken = process.env.TURSO_AUTH_TOKEN?.replace(/[\r\n]+/g, '').trim();
if (!authToken && !url.includes('file:')) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

export const tursoClient: Client = createClient({
  url: url,
  authToken: authToken,
});
