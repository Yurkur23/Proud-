import Link from 'next/link'
import { Brand } from './components/Brand'
import { Icon } from './components/Icon'

export const metadata = { title: 'Página não encontrada | Proud' }

export default function NotFound() {
  return (
    <main className="grain relative isolate grid min-h-[calc(100vh-2.5rem)] place-items-center overflow-hidden bg-[#163B43] px-6 py-16 text-center text-white">
      <div className="aurora absolute inset-0" />
      <div className="hero-grid absolute inset-0 opacity-30" />
      <div className="absolute -right-32 top-20 size-[420px] rounded-full border border-white/10" />
      <div className="absolute -left-24 bottom-10 size-[300px] rounded-full border border-[#C5AD87]/25" />
      <Brand light className="absolute left-6 top-6 z-10 lg:left-10 lg:top-9" />
      <div className="relative z-10 max-w-2xl">
        <p
          aria-hidden="true"
          className="serif text-gradient-sand text-[clamp(7rem,24vw,15rem)] italic leading-[.8]"
        >
          404
        </p>
        <h1 className="mt-8 text-4xl font-medium tracking-[-.05em] md:text-5xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/65">
          O endereço que você tentou abrir não existe ou foi movido.
        </p>
        <Link href="/" className="group btn btn-sand mt-9 px-7 py-4">
          Voltar para o início{' '}
          <Icon name="arrow" className="size-5 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  )
}
