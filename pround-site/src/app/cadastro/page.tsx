import Link from 'next/link'
import { Brand } from '../components/Brand'
import { SignupForm } from './SignupForm'

export const metadata = { title: 'Criar conta | Proud', robots: { index: false, follow: false } }

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#E9E9E4] px-6 py-10 text-[#163B43]">
      <div className="aurora-soft absolute inset-0 opacity-70" />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between">
        <Brand />
        <Link href="/" className="text-xs font-semibold">
          Voltar ao site
        </Link>
      </header>
      <div className="animate-pop-in relative mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] bg-[#F7F7F3] shadow-[0_40px_110px_-30px_rgba(22,59,67,.35)] lg:grid-cols-[.85fr_1.15fr]">
        <aside className="grain relative isolate hidden overflow-hidden bg-[#163B43] p-10 text-white lg:block">
          <div className="aurora absolute inset-0" />
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full border border-white/10" />
          <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#C5AD87]">
            Sua área Proud
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-.055em]">
            Acompanhe tudo com mais tranquilidade.
          </h1>
          <p className="mt-6 text-sm leading-7 text-white/55">
            Sites, suporte, manutenções e novas ideias organizados em uma experiência simples.
          </p>
          </div>
        </aside>
        <section className="p-7 sm:p-10">
          <p className="eyebrow">Cadastro gratuito</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Crie sua conta.</h2>
          <p className="mt-3 text-sm text-[#60757A]">Precisamos apenas dos dados essenciais.</p>
          <div className="mt-8">
            <SignupForm />
          </div>
        </section>
      </div>
    </main>
  )
}
