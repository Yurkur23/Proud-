import { headers } from 'next/headers'
import { getAuth } from './auth'
import { getPool } from './db'

export type SessionUser = { id: string; name: string; email: string; phone: string; role: 'client' | 'admin' }

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

// Usuário logado (ou null). O papel é lido do banco a cada requisição: promover/rebaixar vale na hora.
export async function getSessionUser(): Promise<SessionUser | null> {
  const requestHeaders = await headers()
  const session = await getAuth().api.getSession({ headers: requestHeaders })
  if (!session?.user) return null
  const { rows } = await getPool().query(
    `select id, name, email, phone, role from "user" where id = $1`,
    [session.user.id],
  )
  return (rows[0] as SessionUser | undefined) ?? null
}

// Proteção extra contra CSRF nas rotas que alteram dados: o Origin tem que ser o próprio site.
export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

// Em desenvolvimento local não há cabeçalho de IP (todos caem no mesmo contador): limites bem mais folgados para testar.
export const limitFor = (production: number) => (process.env.NODE_ENV === 'production' ? production : production * 100)

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown'
}

// Contador por janela de tempo, atômico no Postgres. Retorna true se ainda está dentro do limite.
export async function withinLimit(key: string, limit: number, windowSeconds: number) {
  const pool = getPool()
  const { rows } = await pool.query(
    `insert into rate_limits (key, count, window_start) values ($1, 1, now())
     on conflict (key) do update set
       count = case when rate_limits.window_start < now() - make_interval(secs => $2) then 1 else rate_limits.count + 1 end,
       window_start = case when rate_limits.window_start < now() - make_interval(secs => $2) then now() else rate_limits.window_start end
     returning count`,
    [key, windowSeconds],
  )
  if (Math.random() < 0.02) {
    pool.query(`delete from rate_limits where window_start < now() - interval '2 days'`).catch(() => {})
  }
  return (rows[0].count as number) <= limit
}
