import { NextResponse } from "next/server";
import { getDB, rateLimited } from "@/lib/db";
import { publicLeadSchema } from "@/lib/leads";

export async function POST(req: Request) {
  const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
  try {
    if (await rateLimited(`lead:${ip}`, 5, 10 * 60_000)) return NextResponse.json({ ok: false }, { status: 429 });

    let body: unknown;
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

    const parsed = publicLeadSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const d = parsed.data;

    // Bot: honeypot preenchido ou envio rápido demais. Responde ok sem salvar.
    if (d.website || (d.t !== undefined && d.t < 2500)) return NextResponse.json({ ok: true });

    await getDB()
      .prepare("INSERT INTO leads (id, name, phone, subject, event_date, message) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), d.name, d.phone, d.subject, d.event_date || null, d.message || null)
      .run();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 }); // sem detalhes internos
  }
}
