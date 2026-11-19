// Contato informado no briefing: um e-mail OU um WhatsApp/telefone.
// Módulo puro (sem dependências): usado no navegador (validação) e no servidor (validação que vale de verdade).

export type ContactKind = 'email' | 'whatsapp'

export const CONTACT_RULE_MESSAGE = 'Informe um e-mail válido ou um WhatsApp com DDD (ex.: (34) 99999-9999).'

// Conservador de propósito: sem espaços, "?", "&" ou "," para que o link mailto: nunca carregue parâmetros extras.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
const PHONE_CHARS_RE = /^\+?[0-9()\-\s.]{8,30}$/

export function classifyContact(value: unknown): ContactKind | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (text.length < 5 || text.length > 160) return null
  if (EMAIL_RE.test(text)) return 'email'
  if (PHONE_CHARS_RE.test(text)) {
    const digits = text.replace(/\D/g, '')
    if (digits.length >= 10 && digits.length <= 15) return 'whatsapp'
  }
  return null
}

// Número para o link do WhatsApp (wa.me exige só dígitos, com código do país).
// Sem "+" e com 10 ou 11 dígitos, assume Brasil (55).
export function whatsappDigits(value: string): string | null {
  const text = value.trim()
  const digits = text.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  if (!text.startsWith('+') && (digits.length === 10 || digits.length === 11)) return `55${digits}`
  return digits
}

// Link para responder ao contato (ou null se o texto não for um e-mail/telefone reconhecível).
export function contactHref(value: string): string | null {
  const kind = classifyContact(value)
  if (kind === 'email') return `mailto:${value.trim()}`
  if (kind === 'whatsapp') {
    const digits = whatsappDigits(value)
    return digits ? `https://wa.me/${digits}` : null
  }
  return null
}
