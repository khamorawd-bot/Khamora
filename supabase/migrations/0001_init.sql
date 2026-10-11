-- Silvana Ferri: leads e administradores
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;
create policy "admin lê a si mesmo" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create type public.lead_subject as enum ('casamento','quinze_anos','outros','duvidas');
create type public.lead_status as enum ('novo','em_conversa','orcamento_enviado','fechado','perdido');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 8 and 20),
  subject public.lead_subject not null,
  event_date date,
  message text check (char_length(message) <= 600),
  status public.lead_status not null default 'novo',
  quote_value numeric(12,2) check (quote_value >= 0),
  notes text check (char_length(notes) <= 2000),
  source text not null default 'site',
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;

-- Visitante anônimo só INSERE, e só campos básicos. Não lê nem edita.
create policy "site cria lead" on public.leads
  for insert to anon, authenticated
  with check (status = 'novo' and quote_value is null and notes is null and source = 'site');

-- Somente administradores listam e editam.
create policy "admin lê leads" on public.leads
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admin edita leads" on public.leads
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admin apaga leads" on public.leads
  for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create index leads_subject_status_idx on public.leads (subject, status, created_at desc);

-- Auditoria de RLS (deve retornar 0 linhas):
-- select schemaname, tablename from pg_tables where schemaname='public' and not rowsecurity;
