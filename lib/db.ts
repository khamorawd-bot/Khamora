import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB(): D1Database {
  return getCloudflareContext().env.DB;
}

/** true se excedeu `max` eventos de `key` na janela. Registra o evento. */
export async function rateLimited(key: string, max: number, windowMs: number) {
  const db = getDB();
  const now = Date.now();
  await db.prepare("DELETE FROM rate_limits WHERE at < ?").bind(now - 24 * 3600_000).run();
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM rate_limits WHERE key = ? AND at > ?")
    .bind(key, now - windowMs)
    .first<{ n: number }>();
  await db.prepare("INSERT INTO rate_limits (key, at) VALUES (?, ?)").bind(key, now).run();
  return (row?.n ?? 0) >= max;
}
