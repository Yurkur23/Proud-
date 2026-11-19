// Promove (ou rebaixa) uma conta já cadastrada a administrador.
// 1) a pessoa cria a conta normalmente em /cadastro
// 2) rode:  npm run admin:promote -- email@dominio.com        (promover)
//           npm run admin:promote -- email@dominio.com --revoke (voltar a cliente)
// Nenhuma senha passa por este script.
import pg from 'pg'
import { loadEnv } from './_env.mjs'

const [email, flag] = loadEnv()
if (!email || !process.env.DATABASE_URL) {
  console.error('Uso: npm run admin:promote -- email@dominio.com [--revoke] [--env=.env.production]  (precisa de DATABASE_URL)')
  process.exit(1)
}
const role = flag === '--revoke' ? 'client' : 'admin'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL })
await client.connect()
try {
  const { rows } = await client.query(
    `update "user" set "role" = $2, "updatedAt" = now()
      where lower("email") = lower($1)
      returning "email", "name", "role"`,
    [email.trim(), role],
  )
  if (!rows.length) {
    console.error(`Nenhuma conta com o e-mail ${email}. Cadastre-se primeiro em /cadastro.`)
    process.exitCode = 1
  } else {
    const u = rows[0]
    console.log(`OK: ${u.name} <${u.email}> agora é "${u.role}".`)
  }
} finally {
  await client.end()
}
