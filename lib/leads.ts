import { z } from "zod";

export const SUBJECTS = {
  casamento: "Casamento",
  quinze_anos: "Festa de 15 anos",
  outros: "Outros eventos",
  duvidas: "Dúvidas",
} as const;

export const STATUSES = {
  novo: "Novo",
  em_conversa: "Em conversa",
  orcamento_enviado: "Orçamento enviado",
  fechado: "Fechado",
  perdido: "Perdido",
} as const;

export type Subject = keyof typeof SUBJECTS;
export type Status = keyof typeof STATUSES;

const subjectKeys = Object.keys(SUBJECTS) as [Subject, ...Subject[]];
const statusKeys = Object.keys(STATUSES) as [Status, ...Status[]];

// Allowlist de campos aceitos do formulário público.
export const publicLeadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20).regex(/^[0-9()+\-\s]+$/),
  subject: z.enum(subjectKeys),
  event_date: z.string().trim().max(10).optional().or(z.literal("")),
  message: z.string().trim().max(600).optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot
  t: z.number().optional(), // tempo de preenchimento (ms)
});

// Allowlist de campos que o admin pode editar.
export const adminLeadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(statusKeys).optional(),
  subject: z.enum(subjectKeys).optional(),
  quote_value: z.number().min(0).max(10_000_000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type Lead = {
  id: string;
  name: string;
  phone: string;
  subject: Subject;
  event_date: string | null;
  message: string | null;
  status: Status;
  quote_value: number | null;
  notes: string | null;
  created_at: string;
};
