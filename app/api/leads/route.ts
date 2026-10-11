import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publicLeadSchema } from "@/lib/leads";

// Rate limit simples em memória (por instância). Em produção, preferir Upstash/Vercel KV.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = publicLeadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const d = parsed.data;
  // Bot: honeypot preenchido ou formulário enviado rápido demais. Responde ok sem salvar.
  if (d.website || (d.t !== undefined && d.t < 2500)) return NextResponse.json({ ok: true });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ ok: true });

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    name: d.name,
    phone: d.phone,
    subject: d.subject,
    event_date: d.event_date || null,
    message: d.message || null,
  });
  if (error) return NextResponse.json({ ok: false }, { status: 500 }); // sem detalhes internos
  return NextResponse.json({ ok: true });
}
