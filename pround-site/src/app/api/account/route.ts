import { getAuth } from '@/lib/server/auth'
import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Exclui a PRÓPRIA conta (direito de exclusão da LGPD). Apaga sites, chamados, notificações e logins
// em cascata; os briefings enviados ficam sem vínculo com a conta. Administradores não se excluem por aqui.
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  if (user.role === 'admin') return json({ error: 'forbidden' }, 403)

  // encerra a sessão primeiro para devolver os cookies já limpos
  const signOut = await getAuth().api.signOut({ headers: await headers(), asResponse: true })
  await getPool().query(`delete from "user" where id = $1 and role = 'client'`, [user.id])

  const response = json({ ok: true })
  for (const cookie of signOut.headers.getSetCookie()) response.headers.append('set-cookie', cookie)
  return response
}
