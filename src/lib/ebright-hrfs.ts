import "server-only";
import { Pool, type QueryResult, type QueryResultRow } from "pg";

type PoolCacheEntry = { signature: string; pool: Pool };
const globalForPool = globalThis as unknown as {
  __ebright_hrfs_pool?: PoolCacheEntry;
};

function configSignature(): string {
  return process.env.HRFS_DATABASE_URL ?? "";
}

function makePool(): Pool {
  const connectionString = process.env.HRFS_DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "HRFS_DATABASE_URL env var missing. Restart dev server after editing .env.",
    );
  }
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

function getPool(): Pool {
  const signature = configSignature();
  const cached = globalForPool.__ebright_hrfs_pool;
  if (cached && cached.signature === signature) {
    return cached.pool;
  }
  if (cached) {
    cached.pool.end().catch(() => {});
  }
  const pool = makePool();
  if (process.env.NODE_ENV !== "production") {
    globalForPool.__ebright_hrfs_pool = { signature, pool };
  }
  return pool;
}

export async function queryEbrightHrfs<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  try {
    return (await getPool().query(sql, params as never)) as QueryResult<T>;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[ebright_hrfs] Query error:", msg);
    throw new Error(`Failed to query ebright_hrfs: ${msg}`);
  }
}
