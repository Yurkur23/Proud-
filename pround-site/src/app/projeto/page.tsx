import Link from 'next/link'
import { Brand } from '../components/Brand'
import { ProjectBriefForm } from './ProjectBriefForm'

export const metadata = {
  title: 'Conte sua ideia | Proud',
  description: 'Compartilhe sua ideia de projeto com a Proud em poucos passos.',
}

export default function ProjectPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#E9E9E4] px-5 pb-14 pt-6 text-[#163B43] sm:px-8">
      <div className="aurora-soft absolute inset-0 opacity-70" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between py-3">
        <Brand />
        <Link
          href="/"
          className="rounded-full border border-[#163B43]/12 bg-white/50 px-4 py-2 text-xs font-semibold transition hover:bg-white"
        >
          Sair do briefing
        </Link>
      </header>
      <div className="relative mx-auto mt-8 max-w-6xl">
        <ProjectBriefForm />
      </div>
    </main>
  )
}
