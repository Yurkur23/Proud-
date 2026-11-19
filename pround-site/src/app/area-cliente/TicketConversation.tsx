'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  loadTicketMessages,
  sendTicketMessage,
  type Account,
  type TicketMessage,
  type TicketRecord,
} from '@/lib/db'
import { useLanguage, type Language } from '../components/LanguageProvider'

const copy: Record<Language, {
  title: string
  description: string
  loading: string
  empty: string
  placeholder: string
  send: string
  resolved: string
  retry: string
  close: string
  client: string
  admin: string
  open: string
  inProgress: string
  resolvedStatus: string
}> = {
  'pt-BR': {
    title: 'Conversa do chamado',
    description: 'Descrição inicial',
    loading: 'Carregando conversa...',
    empty: 'Ainda não há respostas neste chamado.',
    placeholder: 'Escreva sua resposta...',
    send: 'Enviar resposta',
    resolved: 'Este chamado foi resolvido e não aceita novas respostas.',
    retry: 'Tentar novamente',
    close: 'Fechar conversa',
    client: 'Cliente',
    admin: 'Equipe Proud',
    open: 'Aberto',
    inProgress: 'Em andamento',
    resolvedStatus: 'Resolvido',
  },
  en: {
    title: 'Ticket conversation',
    description: 'Original description',
    loading: 'Loading conversation...',
    empty: 'There are no replies in this ticket yet.',
    placeholder: 'Write your reply...',
    send: 'Send reply',
    resolved: 'This ticket is resolved and no longer accepts replies.',
    retry: 'Try again',
    close: 'Close conversation',
    client: 'Client',
    admin: 'Proud team',
    open: 'Open',
    inProgress: 'In progress',
    resolvedStatus: 'Resolved',
  },
  es: {
    title: 'Conversación del ticket',
    description: 'Descripción inicial',
    loading: 'Cargando conversación...',
    empty: 'Aún no hay respuestas en este ticket.',
    placeholder: 'Escribe tu respuesta...',
    send: 'Enviar respuesta',
    resolved: 'Este ticket está resuelto y ya no acepta respuestas.',
    retry: 'Reintentar',
    close: 'Cerrar conversación',
    client: 'Cliente',
    admin: 'Equipo Proud',
    open: 'Abierto',
    inProgress: 'En curso',
    resolvedStatus: 'Resuelto',
  },
}

export function TicketConversation({
  ticket,
  account,
  onClose,
}: {
  ticket: TicketRecord
  account: Account
  onClose: () => void
}) {
  const { language } = useLanguage()
  const text = copy[language]
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)

  const refreshMessages = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setMessages(await loadTicketMessages(ticket.id))
      setLoadFailed(false)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : text.retry)
      setLoadFailed(true)
    } finally {
      setLoading(false)
    }
  }, [ticket.id, text.retry])

  useEffect(() => {
    void refreshMessages()
  }, [refreshMessages])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setError('')
    try {
      const saved = await sendTicketMessage(ticket.id, body)
      setMessages((current) => [...current, saved])
      setDraft('')
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : text.retry)
    } finally {
      setSending(false)
    }
  }

  const statusLabel =
    ticket.status === 'resolved'
      ? text.resolvedStatus
      : ticket.status === 'in-progress'
        ? text.inProgress
        : text.open

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-end bg-[#102F36]/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-conversation-title"
        className="animate-pop-in flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-[#F7F7F3] shadow-float sm:rounded-[2rem]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#163B43]/8 p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#9B7F57]">
              {ticket.id} · {statusLabel}
            </p>
            <h2 id="ticket-conversation-title" className="mt-1 text-xl font-semibold">
              {ticket.subject}
            </h2>
            <p className="mt-1 text-xs text-[#87979A]">
              {ticket.siteName} · {ticket.ownerEmail}
            </p>
          </div>
          <button
            type="button"
            aria-label={text.close}
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E9E9E4]"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="rounded-2xl bg-[#F0ECE4] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#9B7F57]">
              {text.description}
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
              {ticket.description || '—'}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="py-6 text-center text-sm text-[#667A7F]">{text.loading}</p>
            ) : messages.length ? (
              messages.map((message) => {
                const ownMessage = message.authorId === account.id
                return (
                  <article
                    key={message.id}
                    className={`flex ${ownMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                        ownMessage ? 'bg-[#163B43] text-white' : 'bg-white text-[#163B43]'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wide opacity-65">
                        {message.authorRole === 'admin' ? text.admin : text.client} ·{' '}
                        {message.authorName}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
                        {message.body}
                      </p>
                      <time className="mt-2 block text-right text-[10px] opacity-60">
                        {new Date(message.createdAt).toLocaleString(language)}
                      </time>
                    </div>
                  </article>
                )
              })
            ) : (
              <p className="py-6 text-center text-sm text-[#667A7F]">{text.empty}</p>
            )}
          </div>

          {error && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3">
              <p role="alert" className="text-xs text-red-800">{error}</p>
              {loadFailed && (
                <button
                  type="button"
                  onClick={() => void refreshMessages()}
                  className="text-xs font-semibold text-red-900 underline"
                >
                  {text.retry}
                </button>
              )}
            </div>
          )}
        </div>

        {ticket.status === 'resolved' ? (
          <p className="border-t border-[#163B43]/8 px-5 py-4 text-center text-xs text-[#667A7F]">
            {text.resolved}
          </p>
        ) : (
          <form onSubmit={submit} className="border-t border-[#163B43]/8 p-4 sm:p-5">
            <label htmlFor="ticket-reply" className="sr-only">
              {text.placeholder}
            </label>
            <textarea
              id="ticket-reply"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              required
              maxLength={4000}
              rows={3}
              placeholder={text.placeholder}
              className="form-input resize-y"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[10px] text-[#87979A]">{draft.length}/4000</span>
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="btn btn-ink px-5 py-2.5 text-xs disabled:opacity-50"
              >
                {sending ? '…' : text.send}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
