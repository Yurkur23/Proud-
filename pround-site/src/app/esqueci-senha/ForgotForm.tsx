'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/db'

export function ForgotForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const result = await requestPasswordReset(String(form.get('email') ?? ''))
    setPending(false)
    if (!result.ok) return setError(result.error)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <p className="rounded-2xl bg-[#E5F1EC] p-5 text-sm leading-6 text-[#31634F]">
          Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. Confira
          também a caixa de spam.
        </p>
        <Link href="/entrar" className="block text-center text-sm font-semibold underline">
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seuemail@empresa.com.br"
          className="form-input"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}
      <button disabled={pending} className="btn btn-ink w-full px-6 py-4 disabled:translate-y-0 disabled:opacity-60">
        {pending ? 'Enviando...' : 'Enviar link'}
      </button>
      <Link href="/entrar" className="block text-center text-sm font-semibold underline">
        Voltar para o login
      </Link>
    </form>
  )
}
