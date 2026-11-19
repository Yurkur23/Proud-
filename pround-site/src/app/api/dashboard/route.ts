import { getPool } from '@/lib/server/db'
import { getSessionUser, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Tudo que o painel mostra, já filtrado pelo servidor: cliente vê só o que é dele; admin vê tudo.
export async function GET() {
  const user = await getSessionUser()
  if (!user) return json({ account: null, sites: [], tickets: [], notifications: [], newBriefs: 0 }, 401)

  const admin = user.role === 'admin'
  const pool = getPool()
  const [sites, tickets, notifications, newBriefs] = await Promise.all([
    pool.query(
      `select s.id, s.name, s.url, s.plan, s.status, u.email as "ownerEmail"
         from sites s join "user" u on u.id = s.owner_id
        where ($2 or s.owner_id = $1)
        order by s.created_at asc`,
      [user.id, admin],
    ),
    pool.query(
      `select t.ticket_number, t.subject, t.description, t.type, t.impact, t.status,
              t.created_at, t.resolved_at, t.site_id, s.name as "siteName", u.email as "ownerEmail"
         from tickets t
         join sites s on s.id = t.site_id
         join "user" u on u.id = t.owner_id
        where ($2 or t.owner_id = $1)
        order by t.created_at desc`,
      [user.id, admin],
    ),
    pool.query(
      `select id, title, message, read, created_at, for_admin
         from notifications
        where user_id = $1 or (for_admin and $2)
        order by created_at desc
        limit 50`,
      [user.id, admin],
    ),
    // só o administrador vê (e só ele precisa) quantos projetos novos aguardam contato
    admin
      ? pool.query(`select count(*)::int as n from project_briefs where status = 'new'`)
      : Promise.resolve({ rows: [{ n: 0 }] }),
  ])

  return json({
    account: user,
    newBriefs: newBriefs.rows[0].n as number,
    sites: sites.rows,
    tickets: tickets.rows.map((row) => ({
      id: `PR-${row.ticket_number}`,
      subject: row.subject,
      description: row.description,
      siteId: row.site_id,
      siteName: row.siteName,
      ownerEmail: row.ownerEmail,
      type: row.type,
      impact: row.impact,
      status: row.status,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at ?? undefined,
    })),
    notifications: notifications.rows.map((row) => ({
      id: row.id,
      ownerEmail: row.for_admin ? 'admin' : user.email,
      title: row.title,
      message: row.message,
      createdAt: row.created_at,
      read: row.read,
    })),
  })
}
