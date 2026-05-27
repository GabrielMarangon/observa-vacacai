import pg from "pg";

const { Pool } = pg;

// O pool fica pronto para Postgres local, Render ou Supabase.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase")
    ? { rejectUnauthorized: false }
    : false,
});
