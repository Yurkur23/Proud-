import { toNextJsHandler } from 'better-auth/next-js'
import { getAuth } from '@/lib/server/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Login, cadastro, confirmação de e-mail, recuperação de senha e sair (Better Auth).
export const GET = (request: Request) => toNextJsHandler(getAuth()).GET(request)
export const POST = (request: Request) => toNextJsHandler(getAuth()).POST(request)
