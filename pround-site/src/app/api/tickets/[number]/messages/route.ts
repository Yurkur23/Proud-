import { z } from 'zod'
import { getPool } from '@/lib/server/db'
import { getSessionUser, isSameOrigin, json } from '@/lib/server/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function findTicket(number: number) {
  const result = await getPool().query(
    `select id, owner_id, status from tickets where ticket_number = $1`,
    [number],
  )
  return result.rows[0] as
    | { id: string; owner_id: string; status: 'open' | 'in-progress' | 'resolved' }
    | undefined
}

export async function GET(_request: Request, context: { params: Promise<{ number: string }> }) {
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const number = Number((await context.params).number)
  if (!Number.isInteger(number) || number < 1) return json({ error: 'invalid' }, 400)
  const ticket = await findTicket(number)
  if (!ticket || (user.role !== 'admin' && ticket.owner_id !== user.id)) {
    return json({ error: 'not-found' }, 404)
  }

  const result = await getPool().query(
    `select m.id, m.body, m.author_id as "authorId", u.name as "authorName",
            u.role as "authorRole", m.created_at as "createdAt"
       from ticket_messages m
       join "user" u on u.id = m.author_id
      where m.ticket_id = $1
      order by m.created_at, m.id`,
    [ticket.id],
  )
  return json({ messages: result.rows })
}

export async function POST(request: Request, context: { params: Promise<{ number: string }> }) {
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403)
  const user = await getSessionUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const number = Number((await context.params).number)
  const body = z.object({ body: z.string().trim().min(1).max(4000) }).safeParse(
    await request.json().catch(() => null),
  )
  if (!Number.isInteger(number) || number < 1 || !body.success) {
    return json({ error: 'invalid' }, 400)
  }

  const ticket = await findTicket(number)
  if (!ticket || (user.role !== 'admin' && ticket.owner_id !== user.id)) {
    return json({ error: 'not-found' }, 404)
  }
  if (ticket.status === 'resolved') return json({ error: 'resolved' }, 409)

  const client = await getPool().connect()
  try {
    await client.query('begin')
    const lockedTicket = await client.query(
      `select status from tickets where id = $1 for update`,
      [ticket.id],
    )
    if (!lockedTicket.rowCount) {
      await client.query('rollback')
      return json({ error: 'not-found' }, 404)
    }
    if (lockedTicket.rows[0].status === 'resolved') {
      await client.query('rollback')
      return json({ error: 'resolved' }, 409)
    }

    const inserted = await client.query(
      `insert into ticket_messages (ticket_id, author_id, body)
       values ($1, $2, $3)
       returning id, body, author_id as "authorId", created_at as "createdAt"`,
      [ticket.id, user.id, body.data.body],
    )

    if (user.role === 'admin') {
      await client.query(
        `insert into notifications (user_id, title, message)
         values ($1, 'Nova resposta no chamado', $2)`,
        [ticket.owner_id, `O administrador respondeu ao chamado PR-${number}.`],
      )
    } else {
      await client.query(
        `insert into notifications (for_admin, title, message)
         values (true, 'Resposta do cliente', $1)`,
        [`Um cliente respondeu ao chamado PR-${number}.`],
      )
    }

    await client.query('commit')
    return json(
      {
        message: {
          ...inserted.rows[0],
          authorName: user.name,
          authorRole: user.role,
        },
      },
      201,
    )
  } catch (error) {
    try {
      await client.query('rollback')
    } catch (rollbackError) {
      console.error(
        '[ticket-messages] falha ao reverter transacao:',
        rollbackError instanceof Error ? rollbackError.message : rollbackError,
      )
    }
    console.error('[ticket-messages] falha ao salvar resposta:', error instanceof Error ? error.message : error)
    return json({ error: 'server' }, 500)
  } finally {
    client.release()
  }
}
