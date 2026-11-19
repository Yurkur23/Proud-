import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({ status: z.enum(['new', 'contacted', 'closed']) })

// Muda o andamento de um briefing (novo -> contatado -> encerrado). SÓ administradores.
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (user.role !== 'admin') return json({ error: 'forbidden' }, 403)

  const id = z.uuid().safeParse((await context.params).id)
  const body = schema.safeParse(await request.json().catch(() => null))
  if (!id.success || !body.success) return json({ error: 'invalid' }, 400)

  const result = await getPool().query(`update project_briefs set status = $2 where id = $1`, [id.data, body.data.status])
  return result.rowCount ? json({ ok: true }) : json({ error: 'not-found' }, 404)
}
