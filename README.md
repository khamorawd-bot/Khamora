# Silvana Ferri — site + painel de leads

Next.js 14 + TypeScript + Tailwind + GSAP ScrollTrigger + Supabase.

## Configuração rápida
- `lib/config.ts`: WhatsApp, mensagem padrão, Instagram, endereço e botão flutuante.
- `app/layout.tsx`: bloco `PIXEL / ANALYTICS — cole aqui` no `<head>`.
- `public/`: adicione `og.jpg` (1200×630) e as fotos (`hero.jpg`, `sobre.jpg`, `galeria-1..5.jpg`). Os blocos reservados têm comentários `IMAGEM:`.

## Painel (/admin)
1. Crie um projeto no Supabase e aplique `supabase/migrations/0001_init.sql`.
2. Copie `.env.example` para `.env.local` e preencha URL + chave anon/publishable. **Nunca use service_role no front.**
3. Em Authentication, crie o usuário da Silvana e rode: `insert into public.admins (user_id) values ('<uuid do usuário>');`
4. Desative o cadastro público (Auth > Providers > Email > "Allow new users to sign up" off).
5. Auditoria de RLS (deve retornar 0 linhas): `select tablename from pg_tables where schemaname='public' and not rowsecurity;`

## Segurança
RLS em todas as tabelas; visitante só insere lead (sem ler); admin validado no servidor; allowlist de campos (zod); headers de segurança e CSP em `next.config.mjs`; honeypot + rate limit na rota `/api/leads`.

## Comandos
`npm run dev` · `npm run build` · `npm run lint`
