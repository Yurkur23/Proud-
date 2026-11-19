'use client'

import { authClient } from './auth-client'
import { PASSWORD_RULE_MESSAGE } from './password-policy'
import { CONTACT_RULE_MESSAGE } from './contact'
import type { BriefRecord, BriefStatus } from './briefs'

export type { BriefRecord, BriefStatus }

// Camada de dados do navegador: conversa só com as rotas /api/* do próprio site.
// Quem decide o que cada pessoa pode ver/alterar é o servidor (src/app/api), nunca o navegador.

export type Account = {
  id: string
  name: string
  email: string
  phone: string
  role: 'client' | 'admin'
}
export type SiteRecord = {
  id: string
  name: string
  url: string
  plan: string
  ownerEmail: string
  status: 'online' | 'setup'
}
export type TicketRecord = {
  id: string // "PR-1051"
  subject: string
  description: string
  siteId: string
  siteName: string
  ownerEmail: string
  type: string
  impact: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  resolvedAt?: string
}
export type TicketMessage = {
  id: string
  body: string
  authorId: string
  authorName: string
  authorRole: 'client' | 'admin'
  createdAt: string
}
export type NotificationRecord = {
  id: string
  ownerEmail: string // e-mail do dono ou 'admin'
  title: string
  message: string
  createdAt: string
  read: boolean
}

function notifyChange() {
  window.dispatchEvent(new Event('pround-data-change'))
}

async function api(path: string, init?: RequestInit & { json?: unknown }) {
  const { json, ...rest } = init ?? {}
  return fetch(path, {
    ...rest,
    headers: { ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...rest.headers },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    cache: 'no-store',
  })
}

// ---------- Autenticação ----------

type AuthError = { code?: string; status?: number; message?: string }

export function authErrorMessage(error: AuthError) {
  if (error.status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  switch (error.code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
      return 'E-mail ou senha incorretos.'
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return 'Este e-mail já possui uma conta. Tente entrar.'
    case 'WEAK_PASSWORD':
    case 'PASSWORD_TOO_SHORT':
    case 'PASSWORD_TOO_LONG':
      return PASSWORD_RULE_MESSAGE
    case 'INVALID_NAME':
      return 'Informe seu nome completo.'
    case 'INVALID_PHONE':
      return 'Informe um telefone válido.'
    case 'INVALID_TOKEN':
      return 'Link inválido ou expirado. Peça um novo.'
    default:
      return 'Não foi possível concluir. Tente novamente em instantes.'
  }
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await authClient.signIn.email({
    email: email.trim().toLowerCase(),
    password,
  })
  return error ? { ok: false as const, error: authErrorMessage(error) } : { ok: true as const }
}

export async function signUpWithPassword(input: {
  name: string
  phone: string
  email: string
  password: string
}) {
  const { error } = await authClient.signUp.email({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    name: input.name.trim(),
    phone: input.phone.trim(),
  })
  if (error) return { ok: false as const, error: authErrorMessage(error) }
  return { ok: true as const } // o cadastro já deixa a pessoa logada
}

export async function requestPasswordReset(email: string) {
  const { error } = await authClient.requestPasswordReset({
    email: email.trim().toLowerCase(),
    redirectTo: '/redefinir-senha',
  })
  // Resposta igual exista a conta ou não (não revela quem tem cadastro). Só avisa de erro "de sistema":
  // limite de tentativas ou e-mail do site não configurado.
  return error && (error.status === 429 || error.status === 503)
    ? { ok: false as const, error: authErrorMessage(error) }
    : { ok: true as const }
}

export async function resetPassword(token: string, newPassword: string) {
  const { error } = await authClient.resetPassword({ token, newPassword })
  return error ? { ok: false as const, error: authErrorMessage(error) } : { ok: true as const }
}

export async function signOutUser() {
  await authClient.signOut()
  notifyChange()
}

export async function deleteMyAccount() {
  const response = await api('/api/account', { method: 'DELETE' })
  if (!response.ok) return false
  notifyChange()
  return true
}

// ---------- Dados do painel (o servidor filtra: cliente vê o dele, admin vê tudo) ----------

export async function loadDashboard(): Promise<{
  account: Account | null
  sites: SiteRecord[]
  tickets: TicketRecord[]
  notifications: NotificationRecord[]
  newBriefs: number
}> {
  const empty = { account: null, sites: [], tickets: [], notifications: [], newBriefs: 0 }
  try {
    const response = await api('/api/dashboard')
    if (!response.ok) return empty
    return await response.json()
  } catch {
    return empty
  }
}

export async function createTicket(input: {
  siteId: string
  subject: string
  description: string
  type: string
  impact: string
}) {
  const response = await api('/api/tickets', { method: 'POST', json: input })
  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
        : 'Falha ao criar o chamado.',
    )
  }
  notifyChange()
  return (await response.json()) as { id: string; siteName: string }
}

function ticketNumberFromId(id: string) {
  const number = Number(id.replace(/^PR-/, ''))
  return Number.isInteger(number) && number > 0 ? number : null
}

export async function updateTicketStatus(id: string, status: 'in-progress' | 'resolved') {
  const number = ticketNumberFromId(id)
  if (!number) return false
  try {
    const response = await api(`/api/tickets/${number}/status`, {
      method: 'PATCH',
      json: { status },
    })
    if (!response.ok) return false
    notifyChange()
    return true
  } catch {
    return false
  }
}

export async function loadTicketMessages(id: string): Promise<TicketMessage[]> {
  const number = ticketNumberFromId(id)
  if (!number) throw new Error('Protocolo de chamado inválido.')
  const response = await api(`/api/tickets/${number}/messages`)
  if (!response.ok) throw new Error('Não foi possível carregar as respostas do chamado.')
  const data = (await response.json()) as { messages: TicketMessage[] }
  return data.messages
}

export async function sendTicketMessage(id: string, body: string): Promise<TicketMessage> {
  const number = ticketNumberFromId(id)
  if (!number) throw new Error('Protocolo de chamado inválido.')
  const response = await api(`/api/tickets/${number}/messages`, {
    method: 'POST',
    json: { body },
  })
  if (!response.ok) {
    throw new Error(
      response.status === 409
        ? 'Este chamado já foi resolvido.'
        : 'Não foi possível enviar a resposta. Tente novamente.',
    )
  }
  notifyChange()
  const data = (await response.json()) as { message: TicketMessage }
  return data.message
}

export async function updateSite(
  id: string,
  changes: Pick<SiteRecord, 'name' | 'url' | 'plan' | 'status'>,
) {
  try {
    const response = await api(`/api/sites/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      json: changes,
    })
    if (!response.ok) return false
    notifyChange()
    return true
  } catch {
    return false
  }
}

export async function markNotificationsRead() {
  await api('/api/notifications/read', { method: 'POST' })
  notifyChange()
}

// ---------- Briefing de projeto (formulário público) ----------

export async function submitProjectBrief(input: {
  contact: string
  service: string
  objective: string
  features: string[]
  idea: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await api('/api/briefs', { method: 'POST', json: input })
    if (response.ok) return { ok: true }
    if (response.status === 429) return { ok: false, error: 'Muitos envios em pouco tempo. Aguarde um pouco e tente de novo.' }
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    if (body?.error === 'invalid-contact') return { ok: false, error: CONTACT_RULE_MESSAGE }
  } catch {
    // sem conexão: cai na mensagem genérica abaixo
  }
  return { ok: false, error: 'Não foi possível enviar agora. Tente novamente em instantes.' }
}

// ---------- Projetos enviados (administrador vê todos; cliente vê apenas os próprios) ----------

export async function loadBriefs(): Promise<{ briefs: BriefRecord[]; total: number } | null> {
  try {
    const response = await api('/api/briefs')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function updateBriefStatus(id: string, status: BriefStatus) {
  try {
    const response = await api(`/api/briefs/${encodeURIComponent(id)}`, { method: 'PATCH', json: { status } })
    if (!response.ok) return false
    notifyChange()
    return true
  } catch {
    return false
  }
}
