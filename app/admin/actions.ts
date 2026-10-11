"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminLeadUpdateSchema } from "@/lib/leads";

export async function updateLead(input: unknown) {
  const parsed = adminLeadUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { id, ...fields } = parsed.data; // somente campos da allowlist
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false };
  const { error } = await supabase.from("leads").update(fields).eq("id", id); // RLS valida o admin
  if (error) return { ok: false };
  revalidatePath("/admin");
  return { ok: true };
}

export async function signOut() {
  await createClient().auth.signOut();
  revalidatePath("/admin");
}
