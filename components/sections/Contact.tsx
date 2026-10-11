"use client";
import { useRef, useState } from "react";
import { SITE, waLink } from "@/lib/config";
import { SUBJECTS } from "@/lib/leads";

export default function Contact() {
  const started = useRef(Date.now());
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const subject = get("subject");
    const payload = {
      name: get("name"), phone: get("phone"), subject,
      event_date: get("event_date"), message: get("message"),
      website: get("website"), t: Date.now() - started.current,
    };

    const text = [
      SITE.defaultMessage,
      `Nome: ${payload.name}`,
      `Evento: ${SUBJECTS[subject as keyof typeof SUBJECTS] ?? subject}`,
      payload.event_date && `Data prevista: ${payload.event_date}`,
      payload.message && `Detalhes: ${payload.message}`,
    ].filter(Boolean).join("\n");

    // Abre o WhatsApp de forma síncrona (evita bloqueio de popup) e registra o lead em seguida.
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    setBusy(true);
    try {
      await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch { /* o WhatsApp já foi aberto; o registro no painel é secundário */ }
    setBusy(false);
  }

  return (
    <section id="contato" className="section">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="caption" data-reveal>Orçamento</p>
          <h2 className="h2 mt-4" data-reveal>Conte a data e o tipo da sua festa.</h2>
          <p className="mt-5 text-soft" data-reveal>A Silvana responde pessoalmente. Ao enviar, o WhatsApp abre com a sua mensagem pronta.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn mt-8" data-reveal>Chamar no WhatsApp</a>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 md:col-span-7" data-reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">Seu nome
              <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="field mt-1" />
            </label>
            <label className="block text-sm">Seu WhatsApp
              <input name="phone" required type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="(19) 99999-9999" className="field mt-1" />
            </label>
            <label className="block text-sm">Tipo de evento
              <select name="subject" required defaultValue="casamento" className="field mt-1">
                {Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block text-sm">Data prevista
              <input name="event_date" type="date" className="field mt-1" />
            </label>
          </div>
          <label className="block text-sm">Detalhes (opcional)
            <textarea name="message" rows={4} maxLength={600} className="field mt-1" />
          </label>
          {/* Honeypot: invisível para pessoas */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={busy} className="btn w-full md:w-auto">Enviar pelo WhatsApp</button>
        </form>
      </div>
    </section>
  );
}
