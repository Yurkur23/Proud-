'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '../components/Icon'
import { signUpWithPassword } from '@/lib/db'

export function SignupForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    const result = await signUpWithPassword({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      email: String(form.get('email') ?? ''),
      password,
    })
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
        <label htmlFor="name" className="mb-2 block text-sm font-semibold">
          Nome completo
        </label>
        <input id="name" name="name" required minLength={2} className="form-input" />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          required
          minLength={10}
          inputMode="tel"
          placeholder="(00) 00000-0000"
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          E-mail
        </label>
        <input id="email" name="email" required type="email" className="form-input" />
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
            minLength={10}
            autoComplete="new-password"
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
        <p className="mt-2 text-[11px] text-[#87979A]">
          Mínimo de 10 caracteres, com letras maiúsculas, minúsculas e números.
        </p>
      </div>
      <div>
        <label htmlFor="confirm" className="mb-2 block text-sm font-semibold">
          Confirmar senha
        </label>
        <div className="relative">
          <input
            id="confirm"
            name="confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            minLength={10}
            autoComplete="new-password"
            className="form-input pr-12"
          />
          <button
            type="button"
            aria-pressed={showConfirmPassword}
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#60757A] transition hover:bg-[#E9E9E4] hover:text-[#163B43]"
          >
            <span className="sr-only">{showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
            <Icon name={showConfirmPassword ? 'eye' : 'eyeSlash'} />
          </button>
        </div>
      </div>
      <label className="flex items-start gap-3 rounded-xl bg-[#E9E9E4] p-4">
        <input type="checkbox" required className="mt-1 accent-[#163B43]" />
        <span className="text-xs leading-5 text-[#60757A]">
          Li e concordo com os{' '}
          <Link href="/termos" className="font-semibold underline">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link href="/privacidade" className="font-semibold underline">
            Política de Privacidade
          </Link>
          , incluindo o tratamento necessário dos dados para minha conta.
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="btn btn-ink w-full px-6 py-4 disabled:translate-y-0 disabled:opacity-60"
      >
        {pending ? 'Criando sua área...' : 'Criar conta e continuar'}
        {!pending && <Icon name="arrow" />}
      </button>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Cadastro concluído. Redirecionando para a área do cliente.' : ''}
      </p>
    </form>
  )
}
