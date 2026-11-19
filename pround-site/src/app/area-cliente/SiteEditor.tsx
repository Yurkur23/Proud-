'use client'

import { useState, type FormEvent } from 'react'
import type { SiteRecord } from '@/lib/db'
import { updateSite } from '@/lib/db'
import { useLanguage, type Language } from '../components/LanguageProvider'

const copy: Record<Language, {
  title: string
  name: string
  url: string
  plan: string
  status: string
  online: string
  setup: string
  save: string
  cancel: string
  close: string
  error: string
}> = {
  'pt-BR': {
    title: 'Editar site',
    name: 'Nome do site',
    url: 'Endereço do site',
    plan: 'Plano',
    status: 'Status',
    online: 'Online',
    setup: 'Em configuração',
    save: 'Salvar alterações',
    cancel: 'Cancelar',
    close: 'Fechar',
    error: 'Não foi possível salvar. Confira os campos e tente novamente.',
  },
  en: {
    title: 'Edit site',
    name: 'Site name',
    url: 'Site address',
    plan: 'Plan',
    status: 'Status',
    online: 'Online',
    setup: 'In setup',
    save: 'Save changes',
    cancel: 'Cancel',
    close: 'Close',
    error: 'Could not save. Check the fields and try again.',
  },
  es: {
    title: 'Editar sitio',
    name: 'Nombre del sitio',
    url: 'Dirección del sitio',
    plan: 'Plan',
    status: 'Estado',
    online: 'En línea',
    setup: 'En configuración',
    save: 'Guardar cambios',
    cancel: 'Cancelar',
    close: 'Cerrar',
    error: 'No se pudo guardar. Revisa los campos e inténtalo de nuevo.',
  },
}

export function SiteEditor({
  site,
  onClose,
  onSaved,
}: {
  site: SiteRecord
  onClose: () => void
  onSaved: () => void
}) {
  const { language } = useLanguage()
  const text = copy[language]
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const saved = await updateSite(site.id, {
      name: String(form.get('name') ?? ''),
      url: String(form.get('url') ?? ''),
      plan: String(form.get('plan') ?? ''),
      status: form.get('status') === 'online' ? 'online' : 'setup',
    })
    setSaving(false)
    if (!saved) {
      setError(text.error)
      return
    }
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-[#102F36]/50 p-5 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-site-title"
        className="animate-pop-in w-full max-w-lg rounded-[2rem] bg-[#F7F7F3] p-6 shadow-float sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="edit-site-title" className="text-2xl font-semibold">
            {text.title}
          </h2>
          <button
            type="button"
            aria-label={text.close}
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-[#E9E9E4]"
          >
            ×
          </button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            {text.name}
            <input
              name="name"
              required
              maxLength={120}
              defaultValue={site.name}
              className="form-input mt-2"
            />
          </label>
          <label className="block text-sm font-semibold">
            {text.url}
            <input
              name="url"
              maxLength={200}
              defaultValue={site.url}
              className="form-input mt-2"
            />
          </label>
          <label className="block text-sm font-semibold">
            {text.plan}
            <input
              name="plan"
              required
              maxLength={60}
              defaultValue={site.plan}
              className="form-input mt-2"
            />
          </label>
          <label className="block text-sm font-semibold">
            {text.status}
            <select name="status" defaultValue={site.status} className="form-input mt-2">
              <option value="online">{text.online}</option>
              <option value="setup">{text.setup}</option>
            </select>
          </label>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[#163B43]/12 px-5 py-3 text-sm font-semibold"
            >
              {text.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-ink flex-1 px-5 py-3 text-sm disabled:opacity-60"
            >
              {saving ? '…' : text.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
