import { beforeAll, afterAll, afterEach } from 'vitest';
import { db } from '@/app/server/db';
import { sql } from 'drizzle-orm';

beforeAll(async () => {
  // Ensure test database is clean
  await db.execute(sql`
    DO $$ 
    BEGIN
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(quote_ident(tablename), ', ') || ' CASCADE'
        FROM pg_tables
        WHERE schemaname = 'public'
      );
    END $$;
  `);
});

afterEach(async () => {
  // Clean up after each test
  await db.execute(sql`
    DO $$ 
    BEGIN
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(quote_ident(tablename), ', ') || ' CASCADE'
        FROM pg_tables
        WHERE schemaname = 'public'
      );
    END $$;
  `);
});

afterAll(async () => {
  // Close database connection
  await db.execute(sql`SELECT pg_terminate_backend(pg_backend_pid())`);
});
