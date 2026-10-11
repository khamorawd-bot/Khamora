"use client";
import { useState, useTransition } from "react";
import { updateLead } from "./actions";
import { STATUSES, SUBJECTS, type Lead, type Status, type Subject } from "@/lib/leads";

function waFor(lead: Lead) {
  const digits = lead.phone.replace(/\D/g, "");
  const num = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(`Olá, ${lead.name}! Aqui é a Silvana Ferri, sobre o seu evento.`)}`;
}

export default function LeadBoard({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Subject | "todos">("todos");
  const [pending, start] = useTransition();
  const shown = filter === "todos" ? leads : leads.filter((l) => l.subject === filter);

  const save = (id: string, fields: Record<string, unknown>) => start(async () => { await updateLead({ id, ...fields }); });

  return (
    <div>
      <div role="tablist" aria-label="Assunto" className="mb-6 flex flex-wrap gap-2">
        {(["todos", ...Object.keys(SUBJECTS)] as (Subject | "todos")[]).map((k) => {
          const count = k === "todos" ? leads.length : leads.filter((l) => l.subject === k).length;
          return (
            <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
              className={`min-h-[44px] border px-4 text-sm transition ${filter === k ? "border-primary bg-primary text-ink" : "border-line text-soft hover:border-primary"}`}>
              {k === "todos" ? "Todos" : SUBJECTS[k]} ({count})
            </button>
          );
        })}
      </div>

      {pending && <p className="mb-3 text-sm text-soft" aria-live="polite">Salvando…</p>}
      {shown.length === 0 && <p className="text-soft">Nenhum lead neste assunto ainda.</p>}

      <ul className="space-y-4">
        {shown.map((l) => (
          <li key={l.id} className="border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{l.name}</p>
                <p className="text-sm text-soft">
                  {SUBJECTS[l.subject]} · {l.event_date ? new Date(l.event_date + "T12:00").toLocaleDateString("pt-BR") : "sem data"} · recebido em {new Date(l.created_at).toLocaleDateString("pt-BR")}
                </p>
                {l.message && <p className="mt-2 text-base">{l.message}</p>}
              </div>
              <a href={waFor(l)} target="_blank" rel="noopener noreferrer" className="btn !min-h-[44px] text-sm">Abrir WhatsApp</a>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <label className="text-sm">Status
                <select className="field mt-1" defaultValue={l.status} onChange={(e) => save(l.id, { status: e.target.value as Status })}>
                  {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label className="text-sm">Assunto
                <select className="field mt-1" defaultValue={l.subject} onChange={(e) => save(l.id, { subject: e.target.value as Subject })}>
                  {Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label className="text-sm">Orçamento (R$)
                <input type="number" min={0} step="0.01" className="field mt-1" defaultValue={l.quote_value ?? ""}
                  onBlur={(e) => save(l.id, { quote_value: e.target.value === "" ? null : Number(e.target.value) })} />
              </label>
              <label className="text-sm md:col-span-4">Anotações
                <textarea rows={2} maxLength={2000} className="field mt-1" defaultValue={l.notes ?? ""}
                  onBlur={(e) => save(l.id, { notes: e.target.value || null })} />
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
