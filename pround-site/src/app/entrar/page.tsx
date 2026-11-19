import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Brand } from '../components/Brand'
import { Icon } from '../components/Icon'
import { DashboardPreview } from '../components/DashboardPreview'
import { LoginForm } from './LoginForm'
import { getSessionUser } from '@/lib/server/http'

export const metadata = { title: 'Entrar | Pround', robots: { index: false, follow: false } }

export default async function LoginPage() {
  if (await getSessionUser()) redirect('/area-cliente')

  return (
    <main className="grid min-h-[calc(100vh-2.5rem)] bg-[#E9E9E4] lg:grid-cols-[1.05fr_.95fr]">
      <aside className="grain relative isolate hidden flex-col justify-between overflow-hidden bg-[#163B43] p-12 text-white lg:flex">
        <div className="aurora absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-25" />
        <div className="absolute -right-32 -top-24 size-[420px] rounded-full border border-white/10" />
        <div className="relative z-10">
          <Brand light />
        </div>
        <div className="relative z-10">
          <p className="max-w-md text-4xl font-medium leading-[1.05] tracking-[-.05em]">
            Acompanhe tudo com mais tranquilidade.
          </p>
          <div className="mt-10 max-w-xl">
            <DashboardPreview />
          </div>
        </div>
      </aside>
      <section className="relative flex items-center justify-center px-6 py-16 sm:py-12">
        <div className="aurora-soft absolute inset-0 opacity-70" />
        <Brand className="absolute left-6 top-6 lg:hidden" />
        <div className="animate-pop-in relative w-full max-w-md rounded-[2rem] border border-white/70 bg-[#F7F7F3] p-7 shadow-[0_30px_100px_-30px_rgba(20,50,40,.3)] sm:p-10">
          <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] shadow-md ring-4 ring-[#C5AD87]/20">
            <Icon name="shield" />
          </span>
          <h1 className="mt-7 text-4xl font-semibold tracking-[-.05em]">
            Que bom ter você de volta.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#60757A]">
            Entre para acompanhar seus sites, chamados e manutenções.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-7 rounded-2xl bg-[#E9E9E4] px-4 py-3 text-center text-xs leading-5 text-[#60757A]">
            Ainda não possui acesso?{' '}
            <Link href="/cadastro" className="font-semibold underline">
              Crie sua conta
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
