import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({ status: z.enum(['in-progress', 'resolved']) })

export async function PATCH(request: Request, context: { params: Promise<{ number: string }> }) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (user.role !== 'admin') return json({ error: 'forbidden' }, 403)

  const number = Number((await context.params).number)
  const body = schema.safeParse(await request.json().catch(() => null))
  if (!Number.isInteger(number) || number < 1 || !body.success) {
    return json({ error: 'invalid' }, 400)
  }

  const result = await getPool().query(
    `update tickets set status = $2 where ticket_number = $1`,
    [number, body.data.status],
  )
  return result.rowCount ? json({ ok: true }) : json({ error: 'not-found' }, 404)
}
