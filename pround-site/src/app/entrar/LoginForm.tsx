'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '../components/Icon'
import { signInWithPassword } from '@/lib/db'

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const result = await signInWithPassword(
      String(form.get('email') ?? ''),
      String(form.get('password') ?? ''),
    )
    if (!result.ok) {
      setError(result.error)
      setPending(false)
      return
    }
    router.push('/area-cliente')
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
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            className="form-input pr-12"
          />
          <button
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#60757A] transition hover:bg-[#E9E9E4] hover:text-[#163B43]"
          >
            <span className="sr-only">{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
            <Icon name={showPassword ? 'eye' : 'eyeSlash'} />
          </button>
        </div>
        <Link
          href="/esqueci-senha"
          className="mt-2 inline-block text-xs font-semibold text-[#60757A] underline transition hover:text-[#163B43]"
        >
          Esqueci minha senha
        </Link>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="btn btn-ink w-full px-6 py-4 disabled:translate-y-0 disabled:opacity-60"
      >
        {pending ? 'Abrindo sua área...' : 'Entrar na área do cliente'}{' '}
        {!pending && <Icon name="arrow" />}
      </button>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Login concluído. Redirecionando para a área do cliente.' : ''}
      </p>
    </form>
  )
}
