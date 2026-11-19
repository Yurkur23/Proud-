'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/db'

export function ResetForm() {
  const params = useSearchParams()
  const token = params.get('token')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // O link do e-mail passa pelo servidor, que confere o token e volta para cá com ?token=... (ou ?error=...)
  if (!token || params.get('error')) {
    return (
      <div className="space-y-5">
        <p role="alert" className="rounded-2xl bg-red-50 p-5 text-sm leading-6 text-red-800">
          Este link é inválido ou expirou. Peça um novo link.
        </p>
        <Link href="/esqueci-senha" className="btn btn-ink w-full px-6 py-4">
          Pedir novo link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="space-y-5">
        <p className="rounded-2xl bg-[#E5F1EC] p-5 text-sm leading-6 text-[#31634F]">
          Senha alterada! Agora você já pode entrar.
        </p>
        <Link href="/entrar" className="btn btn-ink w-full px-6 py-4">
          Ir para o login
        </Link>
      </div>
    )
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') ?? '')
    if (password !== String(form.get('confirm') ?? '')) {
      setError('As senhas não conferem.')
      setPending(false)
      return
    }
    const result = await resetPassword(token!, password)
    setPending(false)
    if (!result.ok) return setError(result.error)
    setDone(true)
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Nova senha
        </label>
        <input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" className="form-input" />
        <p className="mt-2 text-[11px] text-[#87979A]">
          Mínimo de 10 caracteres, com letras maiúsculas, minúsculas e números.
        </p>
      </div>
      <div>
        <label htmlFor="confirm" className="mb-2 block text-sm font-semibold">
          Confirmar senha
        </label>
        <input id="confirm" name="confirm" type="password" required minLength={10} autoComplete="new-password" className="form-input" />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}
      <button disabled={pending} className="btn btn-ink w-full px-6 py-4 disabled:translate-y-0 disabled:opacity-60">
        {pending ? 'Salvando...' : 'Salvar nova senha'}
      </button>
    </form>
  )
}
