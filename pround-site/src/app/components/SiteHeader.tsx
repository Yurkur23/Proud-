'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Brand } from './Brand'
import { Icon } from './Icon'

const links = [
  ['/#servicos', 'Serviços'],
  ['/#processo', 'Como fazemos'],
  ['/#planos', 'Planos'],
  ['/area-cliente', 'Área do cliente'],
] as const

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-10 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? 'border-white/10 bg-[#0F2B31]/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between px-6 transition-[height] duration-500 lg:px-10 ${
          scrolled ? 'h-16' : 'h-24'
        }`}
      >
        <Brand light />
        <nav className="hidden items-center gap-8 text-sm text-white/75 md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="relative py-1 transition hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#C5AD87] after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/entrar"
            className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Entrar
          </Link>
          <Link href="/projeto" className="btn btn-sand px-5 py-3 text-sm">
            Começar projeto
          </Link>
        </div>
        <div className="relative md:hidden">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15"
          >
            <Icon name="menu" />
          </button>
          {open && (
            <div className="animate-pop-in absolute right-0 mt-3 flex w-64 flex-col gap-1 rounded-2xl border border-[#163B43]/10 bg-[#F7F7F3] p-3 text-[#163B43] shadow-2xl">
              {links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 transition hover:bg-[#E9E9E4]"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/entrar"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 transition hover:bg-[#E9E9E4]"
              >
                Entrar
              </Link>
              <Link
                href="/projeto"
                onClick={() => setOpen(false)}
                className="btn btn-ink mt-2 rounded-xl px-4 py-3 text-center"
              >
                Começar projeto
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
