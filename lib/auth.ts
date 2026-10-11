import { cookies } from "next/headers";
import { getDB } from "./db";

const COOKIE = "sf_session";
const SESSION_MS = 7 * 24 * 3600_000;
const ITERATIONS = 100_000; // limite do PBKDF2 nos Workers

const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) => new Uint8Array(s.match(/../g)!.map((h) => parseInt(h, 16)));

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${hex(salt)}$${hex(await pbkdf2(password, salt, ITERATIONS))}`;
}

async function verifyPassword(password: string, stored: string) {
  const [scheme, iter, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iter || !salt || !hash) return false;
  const got = hex(await pbkdf2(password, unhex(salt), Number(iter)));
  let diff = got.length ^ hash.length;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ (hash.charCodeAt(i) || 0);
  return diff === 0;
}

async function sha256(s: string) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}

export async function login(email: string, password: string) {
  const db = getDB();
  const admin = await db
    .prepare("SELECT id, password_hash FROM admins WHERE email = ?")
    .bind(email.trim().toLowerCase())
    .first<{ id: number; password_hash: string }>();
  // Roda o hash mesmo sem usuário, para não revelar se o e-mail existe.
  const ok = await verifyPassword(password, admin?.password_hash ?? "pbkdf2$100000$00$00");
  if (!admin || !ok) return false;

  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = Date.now() + SESSION_MS;
  await db.prepare("INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)")
    .bind(await sha256(token), admin.id, expires).run();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MS / 1000,
  });
  return true;
}

/** Valida a sessão no servidor. Retorna o id do admin ou null. */
export async function getAdminId(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = await getDB()
    .prepare("SELECT admin_id FROM sessions WHERE token_hash = ? AND expires_at > ?")
    .bind(await sha256(token), Date.now())
    .first<{ admin_id: number }>();
  return row?.admin_id ?? null;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await getDB().prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  jar.delete(COOKIE);
}
