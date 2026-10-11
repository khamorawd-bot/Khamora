"use server";
import { revalidatePath } from "next/cache";
import { getDB, rateLimited } from "@/lib/db";
import { getAdminId, login, logout } from "@/lib/auth";
import { adminLeadUpdateSchema } from "@/lib/leads";
import { headers } from "next/headers";

export async function signIn(email: string, password: string) {
  const ip = (await headers()).get("cf-connecting-ip") ?? "unknown";
  if (await rateLimited(`login:${ip}`, 8, 15 * 60_000)) return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." };
  const ok = await login(String(email).slice(0, 200), String(password).slice(0, 200));
  return ok ? { ok: true } : { ok: false, error: "E-mail ou senha incorretos." };
}

export async function signOut() {
  await logout();
  revalidatePath("/admin");
}

export async function updateLead(input: unknown) {
  if (!(await getAdminId())) return { ok: false };
  const parsed = adminLeadUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { id, ...fields } = parsed.data; // somente campos da allowlist
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return { ok: false };
  // Nomes de coluna vêm do schema (allowlist); valores sempre via bind.
  const sql = `UPDATE leads SET ${entries.map(([k]) => `${k} = ?`).join(", ")} WHERE id = ?`;
  await getDB().prepare(sql).bind(...entries.map(([, v]) => v), id).run();
  revalidatePath("/admin");
  return { ok: true };
}
