import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Só administradores resolvem chamados. O banco carimba resolved_at e notifica o dono (triggers).
export async function POST(request: Request, context: { params: Promise<{ number: string }> }) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (user.role !== 'admin') return json({ error: 'forbidden' }, 403)

  const number = Number((await context.params).number)
  if (!Number.isInteger(number) || number < 1) return json({ error: 'invalid' }, 400)

  const result = await getPool().query(`update tickets set status = 'resolved' where ticket_number = $1`, [number])
  return result.rowCount ? json({ ok: true }) : json({ error: 'not-found' }, 404)
}
