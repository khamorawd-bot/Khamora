# Silvana Ferri — site + painel de leads

Next.js 15 + TypeScript + Tailwind + GSAP ScrollTrigger, rodando no Cloudflare Workers com banco **D1** (`silvana-ferri`).

## Configuração rápida
- `lib/config.ts`: WhatsApp, mensagem padrão, Instagram, endereço e botão flutuante.
- `app/layout.tsx`: bloco `PIXEL / ANALYTICS — cole aqui` no `<head>`.
- `public/`: adicione `og.jpg` (1200×630) e as fotos (`hero.jpg`, `sobre.jpg`, `galeria-1..5.jpg`). Os blocos reservados têm comentários `IMAGEM:`.

## Banco (D1)
O schema está em `migrations/0001_init.sql` e já foi aplicado ao banco `silvana-ferri`. O binding `DB` está em `wrangler.jsonc`.

### Criar o login da Silvana
1. `node scripts/hash-password.mjs "SENHA-FORTE-COM-12+"`
2. `npx wrangler d1 execute silvana-ferri --remote --command "INSERT INTO admins (email, password_hash) VALUES ('email@dela.com', '<hash>')"`

## Rodar e publicar
- Local: `npm run dev` (usa um D1 local; aplique `npx wrangler d1 migrations apply silvana-ferri --local`).
- Publicar: `npm run cf:deploy` (precisa de `wrangler login` ou `CLOUDFLARE_API_TOKEN` no ambiente).
- Depois de publicar, ative "Always Use HTTPS" no domínio e cadastre o domínio em `lib/config.ts`.

## Segurança
- Sessão: cookie `httpOnly`, `secure`, `sameSite=lax`; no banco só fica o hash SHA-256 do token. Validada no servidor a cada requisição.
- Senha: PBKDF2-SHA256 com salt. Login com limite de tentativas.
- SQL: sempre parametrizado (`bind`); colunas editáveis vêm de uma allowlist (zod).
- Formulário público: validação, honeypot, tempo mínimo e rate limit por IP (gravado no D1).
- Headers de segurança e CSP em `next.config.mjs`. Nenhum segredo no código.
