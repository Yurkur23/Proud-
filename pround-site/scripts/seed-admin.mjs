// Garante o administrador fixo a partir de ADMIN_EMAIL + ADMIN_PASSWORD (variáveis de ambiente).
// Roda sozinho a cada deploy (dentro de scripts/migrate.mjs) e é seguro repetir:
//  - conta não existe  -> cria (já confirmada, papel admin, sem o site "em configuração" padrão)
//  - conta já existe   -> só garante papel admin; NÃO mexe na senha atual
// Trocar a senha de propósito (sem terminal): na Vercel, mude ADMIN_PASSWORD, crie ADMIN_RESET_PASSWORD=true e
// faça um novo deploy; depois apague o ADMIN_RESET_PASSWORD. Com terminal:  npm run admin:seed -- --reset-password
import { randomBytes } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { hashPassword } from 'better-auth/crypto'
import pg from 'pg'
import { loadEnv } from './_env.mjs'

const strong = (p) =>
  typeof p === 'string' && p.length >= 10 && p.length <= 128 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p)

export async function ensureAdmin(client, { resetPassword = process.env.ADMIN_RESET_PASSWORD === 'true' } = {}) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || undefined
  const password = process.env.ADMIN_PASSWORD || undefined
  if (!email && !password) return { skipped: true }
  if (!email || !password) throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD juntos.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ADMIN_EMAIL não parece um e-mail válido.')
  if (!strong(password)) throw new Error('ADMIN_PASSWORD fraca: use 10+ caracteres com maiúsculas, minúsculas e números.')

  const name = process.env.ADMIN_NAME?.trim() || 'Administrador'
  await client.query('begin')
  try {
    let user = (await client.query(`select id from "user" where lower("email") = $1`, [email])).rows[0]
    let created = false
    if (!user) {
      user = { id: randomBytes(16).toString('hex') }
      await client.query(
        `insert into "user" ("id", "name", "email", "emailVerified", "role") values ($1, $2, $3, true, 'admin')`,
        [user.id, name, email],
      )
      // o trigger cria um site "em configuração" para toda conta nova; o administrador não precisa dele
      await client.query(`delete from sites where owner_id = $1`, [user.id])
      created = true
    } else {
      await client.query(`update "user" set "role" = 'admin', "emailVerified" = true, "updatedAt" = now() where "id" = $1`, [user.id])
    }

    const credential = (await client.query(`select 1 from "account" where "userId" = $1 and "providerId" = 'credential'`, [user.id])).rowCount
    let passwordSet = false
    if (!credential) {
      await client.query(
        `insert into "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
         values ($1, $2, 'credential', $2, $3, now(), now())`,
        [randomBytes(16).toString('hex'), user.id, await hashPassword(password)],
      )
      passwordSet = true
    } else if (resetPassword) {
      await client.query(`update "account" set "password" = $2, "updatedAt" = now() where "userId" = $1 and "providerId" = 'credential'`, [user.id, await hashPassword(password)])
      await client.query(`delete from "session" where "userId" = $1`, [user.id]) // derruba logins antigos
      passwordSet = true
    }
    await client.query('commit')
    return { email, created, passwordSet }
  } catch (error) {
    await client.query('rollback')
    throw error
  }
}

// uso direto:  npm run admin:seed
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = loadEnv()
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!url) { console.error('Defina DATABASE_URL.'); process.exit(1) }
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    const r = await ensureAdmin(client, { resetPassword: args.includes('--reset-password') })
    if (r.skipped) console.log('ADMIN_EMAIL/ADMIN_PASSWORD não definidos: nada a fazer.')
    else console.log(`Administrador ${r.email}: ${r.created ? 'criado' : 'já existia (papel garantido)'}${r.passwordSet ? ', senha definida' : ', senha mantida'}.`)
  } catch (error) {
    console.error('Falha:', error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}
