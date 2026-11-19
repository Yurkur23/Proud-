import React from 'react'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/server/site-url'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './styles.css'
import { CookieConsent } from './components/CookieConsent'
import { LanguageProvider, LanguageSwitcher } from './components/LanguageProvider'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['500', '600'],
  // itálico verdadeiro (antes o navegador inventava um itálico falso a partir do normal)
  style: ['normal', 'italic'],
})

const title = 'Pround — Sites com propósito'
const description =
  'Sites estratégicos, hospedagem cuidada e suporte contínuo para empresas que querem crescer.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: { title, description },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen bg-[#F7F7F3] text-[#163B43] antialiased`}
      >
        <LanguageProvider>
          <div className="topbar sticky top-0 z-[70] flex h-10 items-center justify-end px-4 sm:px-8">
            <LanguageSwitcher />
          </div>
          <div id="root" tabIndex={-1}>
            {children}
          </div>
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  )
}
