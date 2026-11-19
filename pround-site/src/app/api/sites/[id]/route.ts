import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  url: z.string().trim().max(200),
  plan: z.string().trim().min(1).max(60),
  status: z.enum(['online', 'setup']),
})

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (user.role !== 'admin') return json({ error: 'forbidden' }, 403)

  const id = z.uuid().safeParse((await context.params).id)
  const body = schema.safeParse(await request.json().catch(() => null))
  if (!id.success || !body.success) return json({ error: 'invalid' }, 400)

  const result = await getPool().query(
    `update sites set name = $2, url = $3, plan = $4, status = $5 where id = $1`,
    [id.data, body.data.name, body.data.url, body.data.plan, body.data.status],
  )
  return result.rowCount ? json({ ok: true }) : json({ error: 'not-found' }, 404)
}
