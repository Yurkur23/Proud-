'use client'

import Link from 'next/link'
import { Brand } from './components/Brand'

// Tela de erro inesperado (em vez da página branca padrão). Usa o mesmo visual da página 404.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grain relative isolate grid min-h-[calc(100vh-2.5rem)] place-items-center overflow-hidden bg-[#163B43] px-6 py-16 text-center text-white">
      <div className="aurora absolute inset-0" />
      <Brand light className="absolute left-6 top-6 z-10 lg:left-10 lg:top-9" />
      <div className="relative z-10 max-w-xl">
        <h1 className="text-4xl font-medium tracking-[-.05em] md:text-5xl">Algo saiu do esperado</h1>
        <p className="mx-auto mt-4 max-w-md text-white/65">
          Não foi possível carregar esta página agora. Tente novamente; se continuar, volte ao início.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-sand px-7 py-4">
            Tentar de novo
          </button>
          <Link href="/" className="btn btn-ghost-light px-7 py-4 font-medium">
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  )
}
