import { after } from 'next/server'
import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { notifyAdmins } from '@/lib/server/email'
import { getSessionUser, isSameOrigin, json, withinLimit } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({
  siteId: z.uuid(),
  subject: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000).default(''),
  type: z.string().trim().min(1).max(60),
  impact: z.string().trim().min(1).max(60),
})

// Abrir chamado. O dono do chamado é SEMPRE o dono do site (o cliente não escolhe).
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (!(await withinLimit(`ticket:${user.id}`, 20, 3600))) return json({ error: 'rate-limited' }, 429)

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return json({ error: 'invalid' }, 400)
  const input = parsed.data

  const pool = getPool()
  const site = (await pool.query(`select id, owner_id, name from sites where id = $1`, [input.siteId])).rows[0]
  if (!site || (user.role !== 'admin' && site.owner_id !== user.id)) return json({ error: 'not-found' }, 404)

  const { rows } = await pool.query(
    `insert into tickets (owner_id, site_id, subject, description, type, impact)
     values ($1, $2, $3, $4, $5, $6) returning ticket_number`,
    [site.owner_id, site.id, input.subject, input.description, input.type, input.impact],
  )
  const code = `PR-${rows[0].ticket_number}`

  after(() =>
    notifyAdmins(`Novo chamado ${code}`, [
      ['Chamado', code],
      ['Site', site.name],
      ['Aberto por', `${user.name} <${user.email}>`],
      ['Assunto', input.subject],
      ['Tipo / impacto', `${input.type} / ${input.impact}`],
      ['Descrição', input.description || '—'],
    ]),
  )
  return json({ id: code, siteName: site.name }, 201)
}
