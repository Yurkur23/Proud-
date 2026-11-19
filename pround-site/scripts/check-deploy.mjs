// Confere, ANTES do deploy, se o ambiente de produção está pronto.
//   npm run check:deploy -- --env=.env.production      (arquivo com as variáveis de produção)
// Sai com erro (código 1) se algo obrigatório estiver faltando.
import { readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { loadEnv } from './_env.mjs'

loadEnv()
const env = process.env
let failures = 0
const ok = (m) => console.log(`  ✓ ${m}`)
const warn = (m) => console.log(`  ! ${m}`)
const fail = (m) => { failures++; console.log(`  ✗ ${m}`) }

console.log('\nVariáveis de ambiente')
const secret = env.BETTER_AUTH_SECRET ?? ''
if (secret.length >= 32 && !/troque-por|e2e-secret|change-?me/i.test(secret)) ok('BETTER_AUTH_SECRET definido (32+ caracteres)')
else fail('BETTER_AUTH_SECRET ausente, curto (<32) ou ainda é o valor de exemplo')

const site = env.NEXT_PUBLIC_SITE_URL
if (!site) warn('NEXT_PUBLIC_SITE_URL vazio: ok se você usa só o endereço .vercel.app; com domínio próprio, preencha (https://...)')
else if (!/^https:\/\//.test(site) || /localhost|127\.0\.0\.1/.test(site)) fail(`NEXT_PUBLIC_SITE_URL precisa ser o endereço público com https (está "${site}")`)
else ok(`NEXT_PUBLIC_SITE_URL = ${site}`)

if (env.EMAIL_TRANSPORT === 'log') fail('EMAIL_TRANSPORT=log não pode existir em produção (os e-mails não seriam enviados)')
if (env.RESEND_API_KEY && env.EMAIL_FROM) {
  ok('RESEND_API_KEY e EMAIL_FROM definidos')
  try {
    const r = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` }, signal: AbortSignal.timeout(8000) })
    if (r.status === 401 || r.status === 403) fail('Resend recusou a chave (RESEND_API_KEY inválida ou sem permissão)')
    else if (r.ok) {
      const { data = [] } = await r.json()
      const from = (env.EMAIL_FROM.match(/@([^>\s]+)/) ?? [])[1]?.toLowerCase()
      const dom = data.find((d) => d.name?.toLowerCase() === from)
      if (!dom) fail(`o domínio "${from}" (de EMAIL_FROM) não está cadastrado no Resend`)
      else if (dom.status !== 'verified') fail(`o domínio "${from}" ainda não está verificado no Resend (status: ${dom.status}) — sem isso a recuperação de senha só chega para você`)
      else ok(`domínio de envio "${from}" verificado no Resend`)
    } else warn(`não consegui consultar o Resend (HTTP ${r.status})`)
  } catch {
    warn('não consegui falar com o Resend daqui (sem internet?) — confira o domínio no painel do Resend')
  }
} else warn('RESEND_API_KEY/EMAIL_FROM ausentes: o cadastro funciona, mas "Esqueci minha senha" fica indisponível e você não recebe avisos por e-mail')
if (env.ADMIN_NOTIFY_EMAIL) ok(`ADMIN_NOTIFY_EMAIL = ${env.ADMIN_NOTIFY_EMAIL}`)
else warn('ADMIN_NOTIFY_EMAIL vazio: você não será avisado por e-mail de novos briefings e chamados')

console.log('\nAdministrador')
const adminEnvOk = !!env.ADMIN_EMAIL && !!env.ADMIN_PASSWORD
if (!env.ADMIN_EMAIL && !env.ADMIN_PASSWORD) warn('ADMIN_EMAIL/ADMIN_PASSWORD não definidos (ok só se já existe um administrador no banco)')
else if (!adminEnvOk) fail('defina ADMIN_EMAIL e ADMIN_PASSWORD juntos')
else if (!(env.ADMIN_PASSWORD.length >= 10 && /[a-z]/.test(env.ADMIN_PASSWORD) && /[A-Z]/.test(env.ADMIN_PASSWORD) && /\d/.test(env.ADMIN_PASSWORD))) fail('ADMIN_PASSWORD fraca: 10+ caracteres com maiúscula, minúscula e número')
else ok(`administrador fixo: ${env.ADMIN_EMAIL} (criado automaticamente no deploy)`)

console.log('\nBanco de dados')
const url = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL
if (!url) fail('DATABASE_URL ausente')
else {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10000 })
  try {
    await client.connect()
    const host = new URL(url).host
    ok(`conectou em ${host}`)
    if (/localhost|127\.0\.0\.1/.test(host)) fail('o banco é local (localhost): na Vercel isso não existe — use o banco de produção (Neon)')
    const files = (await readdir(join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations'))).filter((f) => f.endsWith('.sql')).sort()
    const applied = await client.query('select name from schema_migrations').then((r) => r.rows.map((x) => x.name)).catch(() => null)
    if (applied === null) warn('tabelas ainda não criadas: o deploy cria sozinho (ou rode  npm run db:migrate)')
    else {
      const missing = files.filter((f) => !applied.includes(f))
      missing.length ? warn(`migrations pendentes (${missing.join(', ')}): o deploy aplica sozinho (ou rode  npm run db:migrate)`) : ok(`migrations em dia (${files.length})`)
      const admins = (await client.query(`select count(*)::int as n from "user" where role = 'admin'`)).rows[0].n
      if (admins) ok(`${admins} administrador(es) no banco`)
      else if (!adminEnvOk) fail('nenhum administrador no banco e ADMIN_EMAIL/ADMIN_PASSWORD não definidos: ninguém conseguiria operar o painel')
    }
  } catch (error) {
    fail(`não consegui conectar no banco: ${error.message}`)
  } finally {
    await client.end().catch(() => {})
  }
}

console.log(failures ? `\n${failures} problema(s) para resolver antes de abrir para clientes.\n` : '\nTudo certo para o deploy.\n')
process.exit(failures ? 1 : 0)
