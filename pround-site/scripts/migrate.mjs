// Aplica as migrations de db/migrations/*.sql que ainda não rodaram (em ordem, cada uma numa transação)
// e garante o administrador (ADMIN_EMAIL/ADMIN_PASSWORD). Roda sozinho no build da Vercel.
//   npm run db:migrate                            (lê o .env.local)
//   npm run db:migrate -- --env=.env.production   (outro arquivo de variáveis)
import { readdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { loadEnv } from './_env.mjs'
import { ensureAdmin } from './seed-admin.mjs'

const args = loadEnv()
// Neon: a URL "unpooled" (direta) é a indicada para migrations
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!url) {
  // build local sem banco: segue em frente. Na Vercel, sem banco o build tem que falhar.
  if (args.includes('--if-configured') && !process.env.VERCEL) {
    console.log('DATABASE_URL não definida: pulando migrations (build local).')
    process.exit(0)
  }
  console.error('Defina DATABASE_URL (veja .env.example).')
  process.exit(1)
}

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations')
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()

const client = new pg.Client({ connectionString: url })
await client.connect()
try {
  await client.query('select pg_advisory_lock(7272741)') // dois deploys ao mesmo tempo não se atropelam
  await client.query(
    'create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())',
  )
  const done = new Set((await client.query('select name from schema_migrations')).rows.map((r) => r.name))
  let applied = 0
  for (const file of files) {
    if (done.has(file)) continue
    console.log(`> aplicando ${file}`)
    await client.query('begin')
    try {
      await client.query(await readFile(join(dir, file), 'utf8'))
      await client.query('insert into schema_migrations (name) values ($1)', [file])
      await client.query('commit')
      applied++
    } catch (error) {
      await client.query('rollback')
      throw error
    }
  }
  console.log(applied ? `Banco: ${applied} migration(s) aplicada(s).` : 'Banco: já está atualizado.')

  const admin = await ensureAdmin(client)
  if (admin.skipped) console.log('Administrador: ADMIN_EMAIL/ADMIN_PASSWORD não definidos (nada a fazer).')
  else console.log(`Administrador ${admin.email}: ${admin.created ? 'criado' : 'já existia'}${admin.passwordSet ? ' (senha definida)' : ''}.`)
} catch (error) {
  console.error('Falha:', error.message)
  process.exitCode = 1
} finally {
  await client.query('select pg_advisory_unlock(7272741)').catch(() => {})
  await client.end()
}
