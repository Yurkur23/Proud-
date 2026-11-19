'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Consent = { essential: true; analytics: boolean }

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    setVisible(!window.localStorage.getItem('pround-cookie-consent'))
    function reopen() {
      setVisible(true)
      setCustomizing(true)
    }
    window.addEventListener('pround-open-cookie-settings', reopen)
    return () => window.removeEventListener('pround-open-cookie-settings', reopen)
  }, [])

  function save(consent: Consent) {
    window.localStorage.setItem('pround-cookie-consent', JSON.stringify(consent))
    setVisible(false)
    setCustomizing(false)
  }

  if (!visible) return null

  return (
    <div className="animate-pop-in fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-4xl rounded-[1.5rem] border border-white/12 bg-[#0F2B31]/92 p-5 text-white shadow-float backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold">Sua privacidade importa</p>
          <p className="mt-2 text-xs leading-5 text-white/60">
            Usamos cookies essenciais para o funcionamento do site e da área do cliente. Cookies de análise só serão
            ativados com sua autorização. Consulte nossa{' '}
            <Link href="/cookies" className="font-semibold text-[#C5AD87] underline">
              Política de Cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => save({ essential: true, analytics: false })}
            className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold"
          >
            Somente essenciais
          </button>
          <button
            onClick={() => setCustomizing(true)}
            className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold"
          >
            Personalizar
          </button>
          <button
            onClick={() => save({ essential: true, analytics: true })}
            className="btn btn-sand px-4 py-2.5 text-xs"
          >
            Aceitar todos
          </button>
        </div>
      </div>
      {customizing && (
        <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
          <label className="rounded-xl bg-white/[.05] p-4 text-xs">
            <span className="flex justify-between font-semibold">
              Essenciais <input type="checkbox" checked disabled />
            </span>
            <span className="mt-2 block text-white/45">Necessários para preferências básicas.</span>
          </label>
          <label className="rounded-xl bg-white/[.05] p-4 text-xs">
            <span className="flex justify-between font-semibold">
              Análise
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="accent-[#C5AD87]"
              />
            </span>
            <span className="mt-2 block text-white/45">
              Medição anônima de uso. Nenhuma ferramenta está ativa no momento.
            </span>
          </label>
          <button
            onClick={() => save({ essential: true, analytics })}
            className="rounded-full bg-[#C5AD87] px-4 py-2.5 text-xs font-semibold text-[#163B43] sm:col-span-2 sm:justify-self-end"
          >
            Salvar preferências
          </button>
        </div>
      )}
    </div>
  )
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('pround-open-cookie-settings'))}
      className="text-left transition hover:text-white"
    >
      Preferências de cookies
    </button>
  )
}
