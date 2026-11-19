import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Marca como lidas as notificações da pessoa (e as dos admins, se for admin).
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  await getPool().query(
    `update notifications set read = true where not read and (user_id = $1 or (for_admin and $2))`,
    [user.id, user.role === 'admin'],
  )
  return json({ ok: true })
}
