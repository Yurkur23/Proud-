'use client'

import Link from 'next/link'
import { Brand } from './Brand'
import { useLanguage } from './LanguageProvider'

export type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

const legalTitles: Record<string, { en: string; es: string }> = {
  'Política de Privacidade': { en: 'Privacy Policy', es: 'Política de Privacidad' },
  'Termos de Uso': { en: 'Terms of Use', es: 'Términos de Uso' },
  'Política de Consentimento de Cookies': {
    en: 'Cookie Consent Policy',
    es: 'Política de Consentimiento de Cookies',
  },
  'Política de Reembolso': { en: 'Refund Policy', es: 'Política de Reembolso' },
}

const sectionTitles: Record<string, { en: string; es: string }> = {
  'Quem controla os dados': { en: 'Who controls the data', es: 'Quién controla los datos' },
  'Dados que poderemos tratar': { en: 'Data we may process', es: 'Datos que podemos tratar' },
  'Finalidades e bases legais': {
    en: 'Purposes and legal bases',
    es: 'Finalidades y bases legales',
  },
  'Compartilhamento, transferências e segurança': {
    en: 'Sharing, transfers and security',
    es: 'Intercambio, transferencias y seguridad',
  },
  'Retenção e exclusão': { en: 'Retention and deletion', es: 'Retención y eliminación' },
  'Direitos do titular': { en: 'Data subject rights', es: 'Derechos del titular' },
  Atualizações: { en: 'Updates', es: 'Actualizaciones' },
  'Aceite e escopo': { en: 'Acceptance and scope', es: 'Aceptación y alcance' },
  'Uso adequado': { en: 'Acceptable use', es: 'Uso adecuado' },
  'Contas e acesso': { en: 'Accounts and access', es: 'Cuentas y acceso' },
  'Propostas e serviços': { en: 'Proposals and services', es: 'Propuestas y servicios' },
  'Propriedade intelectual': { en: 'Intellectual property', es: 'Propiedad intelectual' },
  'Disponibilidade e responsabilidade': {
    en: 'Availability and liability',
    es: 'Disponibilidad y responsabilidad',
  },
  'Lei aplicável e contato': { en: 'Applicable law and contact', es: 'Ley aplicable y contacto' },
  'O que são cookies': { en: 'What cookies are', es: 'Qué son las cookies' },
  'Categorias utilizadas': { en: 'Categories used', es: 'Categorías utilizadas' },
  Consentimento: { en: 'Consent', es: 'Consentimiento' },
  'Como alterar sua escolha': { en: 'How to change your choice', es: 'Cómo cambiar tu elección' },
  'Cookies de terceiros e prazos': {
    en: 'Third-party cookies and retention',
    es: 'Cookies de terceros y plazos',
  },
  'Privacidade e direitos': { en: 'Privacy and rights', es: 'Privacidad y derechos' },
  'Serviços personalizados': { en: 'Custom services', es: 'Servicios personalizados' },
  'Cancelamento antes do início': {
    en: 'Cancellation before work starts',
    es: 'Cancelación antes del inicio',
  },
  'Cancelamento após o início': {
    en: 'Cancellation after work starts',
    es: 'Cancelación después del inicio',
  },
  'Direito de arrependimento': { en: 'Right of withdrawal', es: 'Derecho de arrepentimiento' },
  'Falha na entrega': { en: 'Delivery failure', es: 'Falla en la entrega' },
  'Hospedagem, licenças e terceiros': {
    en: 'Hosting, licenses and third parties',
    es: 'Alojamiento, licencias y terceros',
  },
  'Como solicitar': { en: 'How to request', es: 'Cómo solicitar' },
}

export function LegalPage({
  title,
  summary,
  sections,
}: {
  title: string
  summary: string
  sections: LegalSection[]
}) {
  const { language } = useLanguage()
  const translatedTitle = language === 'pt-BR' ? title : (legalTitles[title]?.[language] ?? title)
  const isEnglish = language === 'en'
  const policies = [
    [
      '/privacidade',
      language === 'en' ? 'Privacy' : language === 'es' ? 'Privacidad' : 'Privacidade',
    ],
    [
      '/termos',
      language === 'en' ? 'Terms of Use' : language === 'es' ? 'Términos de Uso' : 'Termos de Uso',
    ],
    ['/cookies', 'Cookies'],
    ['/reembolso', language === 'en' ? 'Refunds' : language === 'es' ? 'Reembolsos' : 'Reembolso'],
  ]

  return (
    <main className="min-h-screen bg-[#E9E9E4] text-[#163B43]">
      <header className="border-b border-[#163B43]/10 bg-[#F7F7F3] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Brand />
          <Link
            href="/"
            className="rounded-full border border-[#163B43]/12 px-4 py-2 text-xs font-semibold"
          >
            Voltar ao site
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[240px_1fr] lg:py-20">
        <aside>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9B7F57]">
            {language === 'pt-BR'
              ? 'Central jurídica'
              : isEnglish
                ? 'Legal center'
                : 'Centro jurídico'}
          </p>
          <nav className="mt-5 flex flex-col gap-2">
            {policies.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-[#163B43]/8 bg-[#F7F7F3] px-4 py-3 text-xs font-semibold transition hover:border-[#C5AD87]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="rounded-[2rem] bg-[#F7F7F3] p-6 shadow-[0_24px_70px_rgba(18,60,50,.07)] sm:p-10 lg:p-14">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9B7F57]">
            {language === 'pt-BR'
              ? 'Versão 1.0 · Atualizada em 20 de março de 2026'
              : isEnglish
                ? 'Version 1.0 · Updated March 20, 2026'
                : 'Versión 1.0 · Actualizada el 20 de marzo de 2026'}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">
            {translatedTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#60757A]">
            {language === 'pt-BR'
              ? summary
              : isEnglish
                ? `This document explains the rules and protections covered by Pround’s ${translatedTitle.toLowerCase()}.`
                : `Este documento explica las reglas y protecciones cubiertas por la ${translatedTitle.toLowerCase()} de Pround.`}
          </p>
          <div className="mt-10 rounded-2xl border border-[#C5AD87]/30 bg-[#F0ECE4] p-5 text-xs leading-6 text-[#6F5839]">
            {language === 'pt-BR'
              ? 'Este documento é um modelo informativo da Pround. e não constitui aconselhamento jurídico. O texto deve ser revisado por profissional qualificado e adaptado aos processos reais.'
              : isEnglish
                ? 'This is an informational template from Pround and is not legal advice. A qualified professional must review it and adapt it to actual processes.'
                : 'Este es un modelo informativo de Pround y no constituye asesoría jurídica. Un profesional calificado debe revisarlo y adaptarlo a los procesos reales.'}
          </div>
          <div className="mt-10 space-y-10">
            {sections.map((section, index) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-[-.03em]">
                  {index + 1}.{' '}
                  {language === 'pt-BR'
                    ? section.title
                    : (sectionTitles[section.title]?.[language] ?? section.title)}
                </h2>
                {language === 'pt-BR' ? (
                  <>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-sm leading-7 text-[#60757A]">
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-[#60757A]">
                        {section.items.map((item) => (
                          <li key={item} className="list-disc pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[#60757A]">
                    {isEnglish
                      ? `This section describes ${sectionTitles[section.title]?.en.toLowerCase() ?? 'the applicable rules'} for Pround, including the safeguards required by Brazilian law.`
                      : `Esta sección describe ${sectionTitles[section.title]?.es.toLowerCase() ?? 'las reglas aplicables'} para Pround, incluidas las protecciones exigidas por la legislación brasileña.`}
                  </p>
                )}
              </section>
            ))}
          </div>
          <div className="mt-12 border-t border-[#163B43]/10 pt-8 text-xs leading-6 text-[#60757A]">
            <p className="font-semibold text-[#163B43]">
              {language === 'pt-BR'
                ? 'Contato da Pround.'
                : isEnglish
                  ? 'Contact Pround.'
                  : 'Contacto de Pround.'}
            </p>
            <p>
              {language === 'pt-BR'
                ? 'Para dúvidas, solicitações ou exercício de direitos, use o formulário “Conte sua ideia” no site e identifique o assunto como “Privacidade e dados”.'
                : isEnglish
                  ? 'For questions, requests or privacy rights, use the “Tell us your idea” form and identify the subject as “Privacy and data”.'
                  : 'Para dudas, solicitudes o derechos de privacidad, usa el formulario “Cuéntanos tu idea” e identifica el asunto como “Privacidad y datos”.'}
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
