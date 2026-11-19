import { after } from 'next/server'
import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { notifyAdmins } from '@/lib/server/email'
import { clientIp, getSessionUser, isSameOrigin, json, limitFor, withinLimit } from '@/lib/server/http'
import { toBriefRecord, type BriefRow } from '@/lib/briefs'
import { classifyContact } from '@/lib/contact'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({
  contact: z.string().trim().min(5).max(160).refine((value) => classifyContact(value) !== null, 'invalid-contact'),
  service: z.string().trim().min(1).max(120),
  objective: z.string().trim().min(1).max(120),
  features: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  idea: z.string().trim().min(10).max(4000),
})

// Formulário público "Conte sua ideia": qualquer visitante pode enviar (com limite por IP).
// O briefing completo é gravado no banco; o aviso por e-mail é só um complemento.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const ip = clientIp(request)
  if (
    !(await withinLimit(`brief:hour:${ip}`, limitFor(5), 3600)) ||
    !(await withinLimit(`brief:day:${ip}`, limitFor(15), 86400))
  ) {
    return json({ error: 'rate-limited' }, 429)
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    const contactProblem = parsed.error.issues.some((issue) => issue.path[0] === 'contact')
    return json({ error: contactProblem ? 'invalid-contact' : 'invalid' }, 400)
  }
  const brief = parsed.data
  // Visitante sem login também pode enviar: um problema ao ler a sessão nunca derruba o envio.
  const user = await getSessionUser().catch(() => null)

  try {
    await getPool().query(
      `insert into project_briefs (user_id, contact, service, objective, features, idea, privacy_accepted)
       values ($1, $2, $3, $4, $5, $6, true)`,
      [user?.id ?? null, brief.contact, brief.service, brief.objective, brief.features, brief.idea],
    )
  } catch (error) {
    console.error('[briefs] falha ao gravar:', error instanceof Error ? error.message : error)
    return json({ error: 'server' }, 500)
  }

  after(() =>
    notifyAdmins('Novo briefing de projeto', [
      ['Contato', brief.contact],
      ['Serviço', brief.service],
      ['Objetivo', brief.objective],
      ['Recursos', brief.features.join(', ') || '—'],
      ['Ideia', brief.idea],
      ['Conta no site', user ? `${user.name} <${user.email}>` : 'visitante (sem login)'],
    ]),
  )
  return json({ ok: true }, 201)
}

// Administradores veem a lista completa; clientes veem somente briefings vinculados à própria conta.
export async function GET() {
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const limit = 500
  const pool = getPool()
  const isAdmin = user.role === 'admin'
  const [list, total] = isAdmin
    ? await Promise.all([
        pool.query(
          `select b.id, b.status, b.created_at, b.updated_at, b.service, b.objective, b.features, b.idea, b.contact,
                  u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
             from project_briefs b
             left join "user" u on u.id = b.user_id
            order by b.created_at desc
            limit $1`,
          [limit],
        ),
        pool.query(`select count(*)::int as n from project_briefs`),
      ])
    : await Promise.all([
        pool.query(
          `select b.id, b.status, b.created_at, b.updated_at, b.service, b.objective, b.features, b.idea, b.contact,
                  u.id as user_id, u.name as user_name, u.email as user_email, u.phone as user_phone
             from project_briefs b
             left join "user" u on u.id = b.user_id
            where b.user_id = $2
            order by b.created_at desc
            limit $1`,
          [limit, user.id],
        ),
        pool.query(`select count(*)::int as n from project_briefs where user_id = $1`, [user.id]),
      ])
  return json({ briefs: (list.rows as BriefRow[]).map(toBriefRecord), total: total.rows[0].n as number })
}
