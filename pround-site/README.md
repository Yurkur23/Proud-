# Proud — site + área do cliente

Site institucional da Proud com **área do cliente** (login, sites, chamados de suporte e notificações),
formulário público "Conte sua ideia" e, para o administrador, a aba **Projetos** com todos os briefings recebidos. Next.js 16 + Tailwind 4 + **PostgreSQL** (sem Supabase).

| Peça | Tecnologia |
|---|---|
| Site e painel | Next.js (App Router), React 19, Tailwind 4 |
| Banco | PostgreSQL puro (recomendado: Neon, pela Vercel) via `pg` |
| Login | [Better Auth](https://better-auth.com): e-mail + senha (hash scrypt), recuperação de senha por e-mail, sessão em cookie `HttpOnly` |
| E-mails | [Resend](https://resend.com) por HTTPS (recuperação de senha e avisos de novo briefing/chamado para a equipe) |
| Hospedagem | Vercel (as rotas `/api/*` rodam como Vercel Functions) |

## Rodar no seu computador

Pré-requisitos: Node 22 ou 24 e um Postgres.

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
```

**Postgres local** (escolha um):
- Docker: `docker run -d --name pround-db -e POSTGRES_PASSWORD=pround -e POSTGRES_DB=pround -p 5432:5432 postgres:17`
  e use `DATABASE_URL=postgres://postgres:pround@localhost:5432/pround`
- ou um banco gratuito do [Neon](https://neon.com) só para desenvolvimento.

No `.env.local`, preencha `DATABASE_URL` e `BETTER_AUTH_SECRET`, e deixe `EMAIL_TRANSPORT=log` (os e-mails — com
os links de recuperação de senha — aparecem no terminal, sem precisar do Resend). Depois:

```bash
npm run db:migrate     # cria as tabelas (e o administrador, se ADMIN_EMAIL/ADMIN_PASSWORD estiverem no .env.local)
npm run dev            # http://localhost:3000
```

## Estrutura

```
├─ db/migrations/                # banco em SQL puro: 0001 (tabelas, regras, triggers), 0002 (aba Projetos)
├─ scripts/
│  ├─ migrate.mjs                # tabelas + admin; roda sozinho no build da Vercel
│  ├─ seed-admin.mjs             # administrador fixo (ADMIN_EMAIL/ADMIN_PASSWORD) — roda sozinho no deploy
│  ├─ promote-admin.mjs          # npm run admin:promote -- email   (promover outra conta)
│  └─ check-deploy.mjs           # npm run check:deploy (confere o ambiente antes do deploy)
├─ src/lib/server/               # só servidor: banco, login, e-mail, limites de uso
├─ src/lib/db.ts                 # navegador -> rotas /api (nenhuma chave no front-end)
└─ src/app/
   ├─ api/                       # auth, dashboard, tickets, notifications, briefs (+ briefs/[id]), account
   ├─ area-cliente/ entrar/ cadastro/ esqueci-senha/ redefinir-senha/ projeto/
   └─ privacidade/ termos/ cookies/ reembolso/
```

## Como a segurança funciona

- **Quem decide o que cada pessoa vê é o servidor.** Cada rota `/api/*` identifica o usuário pela sessão e
  filtra por dono (cliente) ou libera tudo (administrador). O navegador nunca fala direto com o banco.
- **Senhas** ficam só como hash (scrypt) no banco. Mínimo de 10 caracteres com maiúscula, minúscula e número
  (validado no servidor). Trocar a senha derruba os outros logins.
- **O e-mail do cliente é só informado, não confirmado**: quem se cadastra já entra no painel. Ele serve para
  recuperar a senha e identificar a conta. Consequências: um e-mail digitado errado não recebe a recuperação de
  senha, e alguém pode cadastrar o e-mail de outra pessoa (a vítima se protege usando "Esqueci minha senha", que
  derruba qualquer sessão aberta). Para frear robôs há limite de cadastros por IP; se aparecer abuso, o próximo
  passo é um CAPTCHA (Cloudflare Turnstile) no cadastro.
- **Administrador fixo**: definido pelas variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` (nunca no código). Ninguém vira
  administrador pela internet: o papel só muda pelo deploy/`admin:promote`, que exigem acesso ao banco/à Vercel.
- **Limites de uso** gravados no banco: login (8/min), cadastro (10/h), recuperação de senha, briefing (5/hora por IP), chamados.
  (Fora da produção os limites do briefing e dos chamados são 100x maiores, para você conseguir testar à vontade.)
- **Projetos enviados** (`GET /api/briefs`, `PATCH /api/briefs/[id]`): só administrador; visitante recebe 401 e cliente comum 403.
  O contato do briefing precisa ser um e-mail válido ou um telefone/WhatsApp com DDD (validado também no servidor).
- **CSRF**: cookies `SameSite=Lax` + checagem de `Origin` em toda rota que altera dados.
- **Cabeçalhos de segurança** (`next.config.ts`): nosniff, anti-iframe, referrer, HSTS.
- **Banco**: chaves estrangeiras, `CHECK`s, e-mail único sem diferenciar maiúsculas, dono do chamado sempre igual ao
  dono do site. Numeração (`PR-1051…`) e notificações são triggers do próprio banco.
- **Sem e-mail configurado**, "Esqueci minha senha" avisa que está indisponível (em vez de fingir que enviou).

## Antes do primeiro deploy (checklist)

As tabelas e o administrador são criados **sozinhos a cada deploy** (o build roda `scripts/migrate.mjs`). Você só
precisa preparar as contas e as variáveis:

1. **Plano da Vercel.** O plano gratuito (Hobby) é só para uso pessoal e não comercial. Um site de empresa com
   clientes reais precisa do plano **Pro** (US$ 20/mês por usuário).
2. **Banco (Neon).** Na Vercel: projeto > **Storage > Marketplace > Neon > Create**. Isso cria o banco e
   preenche `DATABASE_URL` (pooled) e `DATABASE_URL_UNPOOLED` sozinho. Planos gratuitos têm limites e janela
   curta de restauração: faça backup periódico (veja abaixo) ou use um plano pago. Se aparecer *Preview Branching*,
   pode deixar desligado.
3. **Variáveis de ambiente** (Vercel > Project Settings > Environment Variables):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | já vem do Neon |
   | `BETTER_AUTH_SECRET` | 32+ caracteres aleatórios (`openssl rand -base64 32`) |
   | `ADMIN_EMAIL` | o e-mail do seu login de administrador |
   | `ADMIN_PASSWORD` | a senha dele (10+ caracteres, maiúscula, minúscula e número). Única e longa |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.seudominio.com.br` (vazio = usa o endereço `.vercel.app`) |
   | `RESEND_API_KEY` + `EMAIL_FROM` | *recomendado*: habilita "Esqueci minha senha" e os avisos por e-mail |
   | `ADMIN_NOTIFY_EMAIL` | e-mail(s) da equipe que recebem cada novo briefing e chamado |

   Não crie `EMAIL_TRANSPORT` na Vercel. Se mudar `NEXT_PUBLIC_SITE_URL`, faça *Redeploy*.
4. **E-mail (Resend)** — recomendado antes de abrir para clientes: crie a conta, **verifique o seu domínio**
   (registros DNS SPF/DKIM que o Resend mostra; sem isso ele só entrega para o seu próprio e-mail) e gere a chave.
   Plano gratuito: 3.000 e-mails/mês e 100/dia.
5. **Conferir tudo antes de subir** (opcional, mas útil):
   ```bash
   npm run check:deploy -- --env=.env.production
   ```
   (`.env.production` = um arquivo seu, fora do Git, com as mesmas variáveis da Vercel.)
6. **Deploy** (push no repositório conectado à Vercel) e **domínio próprio**: Vercel > Settings > Domains.
   Veja no log do build as linhas `Banco: ...` e `Administrador ...: criado`.
7. **Entrar** em `/entrar` com `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Depois do primeiro deploy você pode **apagar o
   `ADMIN_PASSWORD`** da Vercel: o administrador continua existindo. Mudar a variável **não** troca a senha de quem já
   existe. Para trocar de propósito, na Vercel: mude `ADMIN_PASSWORD`, crie `ADMIN_RESET_PASSWORD=true`, faça um novo
   deploy e depois apague a `ADMIN_RESET_PASSWORD`. (Com terminal: `npm run admin:seed -- --reset-password --env=.env.production`.)
8. **Teste real no site publicado:** cadastrar uma conta de teste (entra direto?) → abrir um chamado → chegou o aviso
   na `ADMIN_NOTIFY_EMAIL`? → "Esqueci minha senha" chega no e-mail? → enviar um briefing em `/projeto`.
9. **Jurídico (obrigatório antes de divulgar):** as páginas Termos, Privacidade, Cookies e Reembolso são **modelos**.
   Um profissional precisa revisá-las e incluir a identificação da empresa (razão social, CNPJ, endereço) e o
   contato do encarregado de dados (LGPD). Depois da revisão, remova o aviso de "modelo informativo" em
   `src/app/components/LegalPage.tsx`.

## Hospedar na Discloud

O projeto inclui `discloud.config`, `.discloudignore` e o inicializador `scripts/discloud-start.mjs`. Antes do
upload:

1. A Discloud exige **Plano Platinum ou superior** para `TYPE=site` e um subdomínio registrado. O config sugere
   `ID=proudlanding`; registre esse ID na sua conta antes de enviar. Se estiver ocupado, escolha outro e atualize o
   `ID` no `discloud.config`.
2. No painel da aplicação Discloud, configure as variáveis. A Discloud exige o prefixo `BUILD_` para variáveis
   também usadas durante o build:
   - `DATABASE_URL`: URL pooled do Neon, usada em runtime.
   - `BUILD_DATABASE_URL_UNPOOLED`: URL direta do Neon, usada para aplicar migrations durante o build.
   - `NEXT_PUBLIC_SITE_URL`: URL pública usada em runtime: `https://proudlanding.discloud.dev`.
   - `BUILD_NEXT_PUBLIC_SITE_URL`: a mesma URL, usada durante o build: `https://proudlanding.discloud.dev`.
   - Se precisar criar o administrador em um banco novo durante o build, use `BUILD_ADMIN_EMAIL` e
     `BUILD_ADMIN_PASSWORD` (opcionalmente `BUILD_ADMIN_NAME`). Não configure essas variáveis se o administrador já
     existe no banco.
   - `BETTER_AUTH_SECRET`: o mesmo segredo de 32+ caracteres usado localmente.
   - `RESEND_API_KEY`, `EMAIL_FROM` e `ADMIN_NOTIFY_EMAIL`, se for usar envio real de e-mails.
3. Não configure `EMAIL_TRANSPORT=log` na Discloud. O `.discloudignore` exclui arquivos `.env` locais para não
   enviar credenciais junto com o projeto.
4. Use o mesmo banco Neon para manter as contas, os projetos e os chamados existentes. A conta administrativa
   que já existe está nesse banco; não é necessário criar outra se a Discloud apontar para ele.
5. Faça o upload da pasta do projeto. O build aplica migrations pendentes e compila o Next.js; se o artefato
   `.next/BUILD_ID` não estiver disponível quando o app iniciar, o inicializador executa `npm run build` antes
   de iniciar o servidor. O processo escuta em `0.0.0.0:8080`, como exigido pela Discloud. O config reserva 2 GB de RAM.

## Dia a dia

**Projetos enviados:** entre como administrador em `/entrar` e abra a aba **Projetos**. Cada briefing mostra serviço,
objetivo, funcionalidades, a mensagem completa do cliente, o contato (e-mail ou WhatsApp, com botão para responder),
a conta usada no site (se a pessoa estava logada) e o andamento (Novo → Contatado → Encerrado). Os avisos por
e-mail (`ADMIN_NOTIFY_EMAIL`) continuam, mas agora o briefing completo também fica no painel e no banco.

O painel ainda **não** edita os dados do site de um cliente (nome, endereço, plano, status). Para isso use o
**SQL Editor** do Neon:

```sql
-- sites dos clientes (cada conta nova ganha um site "em configuração")
select s.id, u.email, s.name, s.url, s.plan, s.status from sites s join "user" u on u.id = s.owner_id order by s.created_at desc;
update sites set name = 'Padaria da Ana', url = 'padariadaana.com.br', plan = 'Essencial', status = 'online' where id = '...';
```

**Backup** (precisa do cliente `pg_dump`): `pg_dump "$DATABASE_URL_UNPOOLED" -Fc -f backup-$(date +%F).dump`.

**Novas migrations**: crie `db/migrations/0003_nome.sql` e faça o deploy (o build aplica sozinho; cada arquivo roda
uma vez, em transação).

## Limitações conhecidas
- Os e-mails saem só em português.
- O aceite dos Termos no cadastro é exigido no formulário, mas a data do aceite não é gravada no banco.
- O e-mail do cliente não é confirmado (decisão do projeto): veja "Como a segurança funciona".
- O painel não edita os dados dos sites dos clientes (use o SQL acima).
- O assistente da área do cliente é um assistente de perguntas frequentes (respostas prontas por palavra-chave), não um modelo de IA.
- Briefings enviados por quem depois exclui a conta ficam guardados sem vínculo com a conta (o contato informado permanece).
