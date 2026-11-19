import { classifyContact, type ContactKind } from './contact'

// Formato dos briefings (projetos enviados em /projeto) entre servidor e painel do administrador.
// Módulo puro: sem acesso a banco nem a APIs do navegador.

export type BriefStatus = 'new' | 'contacted' | 'closed'
export const BRIEF_STATUSES: readonly BriefStatus[] = ['new', 'contacted', 'closed']

export type BriefRecord = {
  id: string
  status: BriefStatus
  createdAt: string
  updatedAt: string
  service: string
  objective: string
  features: string[]
  idea: string
  contact: string
  contactKind: ContactKind | 'other'
  // Conta usada no site quando o briefing foi enviado (null = visitante sem login)
  account: { id: string; name: string; email: string; phone: string } | null
}

export type BriefRow = {
  id: string
  status: string
  created_at: Date | string
  updated_at: Date | string
  service: string
  objective: string
  features: string[] | null
  idea: string
  contact: string
  user_id: string | null
  user_name: string | null
  user_email: string | null
  user_phone: string | null
}

const iso = (value: Date | string) => (value instanceof Date ? value : new Date(value)).toISOString()

export function toBriefRecord(row: BriefRow): BriefRecord {
  return {
    id: row.id,
    status: (BRIEF_STATUSES as readonly string[]).includes(row.status) ? (row.status as BriefStatus) : 'new',
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    service: row.service,
    objective: row.objective,
    features: row.features ?? [],
    idea: row.idea,
    contact: row.contact,
    contactKind: classifyContact(row.contact) ?? 'other',
    account: row.user_id
      ? { id: row.user_id, name: row.user_name ?? '', email: row.user_email ?? '', phone: row.user_phone ?? '' }
      : null,
  }
}
