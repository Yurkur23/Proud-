'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Icon } from '../components/Icon'
import { submitProjectBrief } from '@/lib/db'
import { classifyContact, CONTACT_RULE_MESSAGE } from '@/lib/contact'

const services = [
  ['Criar um site do zero', 'Uma presença digital nova, pensada desde a estratégia.'],
  ['Reformular um site existente', 'Modernizar design, conteúdo, velocidade e conversão.'],
  ['Manutenção e suporte', 'Corrigir, atualizar e evoluir um site que já está no ar.'],
  ['Ainda estou avaliando', 'Tudo bem — ajudamos você a encontrar o melhor caminho.'],
]

const objectives = [
  'Apresentar minha empresa',
  'Atrair novos clientes',
  'Vender produtos ou serviços',
  'Exibir meu portfólio',
  'Outro objetivo',
]

const features = [
  'Integração com WhatsApp',
  'Formulário de contato',
  'Catálogo de produtos',
  'Agendamento online',
  'Área administrativa',
  'Galeria de fotos e portfólio',
  'Ainda não sei',
]

const stepLabels = ['Serviço', 'Objetivo', 'Funcionalidades', 'Sua ideia']

export function ProjectBriefForm() {
  const [step, setStep] = useState(0)
  const [service, setService] = useState('')
  const [objective, setObjective] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Integração com WhatsApp',
    'Formulário de contato',
  ])
  const [idea, setIdea] = useState('')
  const [contact, setContact] = useState('')
  const [sendError, setSendError] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const canContinue = Boolean(
    (step === 0 && service) ||
    (step === 1 && objective) ||
    (step === 2 && selectedFeatures.length > 0) ||
    (step === 3 && idea.trim().length >= 10 && classifyContact(contact) !== null && privacyAccepted),
  )

  function toggleFeature(feature: string) {
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    )
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step < 3) {
      if (canContinue) setStep((current) => current + 1)
      return
    }
    if (!canContinue) return
    setSending(true)
    setSendError('')
    const result = await submitProjectBrief({
      contact: contact.trim(),
      service,
      objective,
      features: selectedFeatures,
      idea: idea.trim(),
    })
    setSending(false)
    if (!result.ok) {
      setSendError(result.error)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="animate-pop-in rounded-[2rem] border border-[#163B43]/8 bg-white p-7 shadow-[0_30px_90px_rgba(18,60,50,.1)] sm:p-10">
        <span className="grid size-16 place-items-center rounded-full bg-[#C5AD87] text-[#163B43]">
          <Icon name="check" className="size-8" />
        </span>
        <p className="eyebrow mt-8">Briefing concluído</p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-.055em] sm:text-5xl">
          Obrigado por compartilhar sua ideia.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#60757A]">
          Sua solicitação foi registrada e nossa equipe será notificada para analisar o projeto.
        </p>
        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          {[
            ['01', 'Você envia', 'Seu briefing chega organizado para a Proud.'],
            ['02', 'Nós analisamos', 'Avaliamos objetivos, recursos e complexidade.'],
            ['03', 'Entramos em contato', 'Apresentamos o melhor caminho para o projeto.'],
          ].map(([number, title, text]) => (
            <div key={title} className="rounded-2xl bg-[#F0EEE9] p-5">
              <span className="text-[10px] font-bold text-[#A38A64]">{number}</span>
              <h2 className="mt-4 text-sm font-semibold">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#667A7F]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/area-cliente"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#163B43] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Ir para minha área <Icon name="arrow" className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#163B43]/15 px-6 py-3.5 text-sm font-semibold"
          >
            Voltar ao site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="grain relative isolate h-fit overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#1D4A54] to-[#123239] p-6 text-white shadow-float lg:sticky lg:top-24">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#C5AD87]">
          Seu projeto começa aqui
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-.04em]">Vamos entender sua ideia.</h2>
        <p className="mt-3 text-xs leading-5 text-white/55">
          Leva cerca de 2 minutos. Você poderá voltar e alterar suas respostas.
        </p>
        <div className="mt-8 space-y-1">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                index === step
                  ? 'bg-white/10 text-white'
                  : index < step
                    ? 'text-white/70'
                    : 'text-white/35'
              }`}
            >
              <span
                className={`grid size-7 place-items-center rounded-full text-[10px] font-bold ${
                  index < step
                    ? 'bg-[#C5AD87] text-[#163B43]'
                    : index === step
                      ? 'border border-[#C5AD87] text-[#C5AD87]'
                      : 'border border-white/15'
                }`}
              >
                {index < step ? <Icon name="check" className="size-3.5" /> : index + 1}
              </span>
              <span className="text-xs font-semibold">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-[#C5AD87] p-4 text-[#163B43]">
          <Icon name="spark" className="size-5" />
          <p className="mt-3 text-xs font-semibold leading-5">
            Não precisa ter tudo definido. Nós ajudamos a encontrar o melhor caminho.
          </p>
        </div>
      </aside>

      <form
        onSubmit={submit}
        className="min-h-[620px] rounded-[2rem] border border-[#163B43]/8 bg-white p-6 shadow-[0_30px_90px_rgba(18,60,50,.08)] sm:p-9"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[.14em] text-[#87979A]">
            Etapa {step + 1} de 4
          </span>
          <span className="text-xs font-semibold text-[#9B7F57]">{25 * (step + 1)}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F0EEE9]">
          <div
            className="h-full rounded-full bg-[#A38A64] transition-all duration-500"
            style={{ width: `${25 * (step + 1)}%` }}
          />
        </div>

        <div key={step} className="animate-step-in mt-10">
          {step === 0 && (
            <>
              <p className="eyebrow">Primeiro passo</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                Qual serviço você procura?
              </h1>
              <p className="mt-3 text-sm text-[#667A7F]">
                Escolha a opção mais próxima do que você precisa agora.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {services.map(([title, description]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setService(title)}
                    className={`group rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      service === title
                        ? 'border-[#9B7F57] bg-[#F0ECE4] shadow-[0_12px_30px_rgba(80,105,50,.12)]'
                        : 'border-[#163B43]/10 bg-[#F7F7F3] hover:border-[#9B7F57]/45'
                    }`}
                  >
                    <span
                      className={`grid size-6 place-items-center rounded-full border ${
                        service === title
                          ? 'border-[#9B7F57] bg-[#9B7F57] text-white'
                          : 'border-[#163B43]/20'
                      }`}
                    >
                      {service === title && <Icon name="check" className="size-3.5" />}
                    </span>
                    <h2 className="mt-5 text-sm font-semibold">{title}</h2>
                    <p className="mt-2 text-xs leading-5 text-[#667A7F]">{description}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="eyebrow">Direção do projeto</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                Qual é o principal objetivo do seu site?
              </h1>
              <p className="mt-3 text-sm text-[#667A7F]">
                Isso nos ajuda a priorizar a estratégia e a experiência.
              </p>
              <div className="mt-8 space-y-3">
                {objectives.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setObjective(item)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition-all hover:translate-x-1 ${
                      objective === item
                        ? 'border-[#9B7F57] bg-[#F0ECE4]'
                        : 'border-[#163B43]/10 bg-[#F7F7F3] hover:border-[#9B7F57]/45'
                    }`}
                  >
                    <span
                      className={`grid size-6 place-items-center rounded-full border ${
                        objective === item
                          ? 'border-[#9B7F57] bg-[#9B7F57] text-white'
                          : 'border-[#163B43]/20'
                      }`}
                    >
                      {objective === item && <span className="size-2 rounded-full bg-white" />}
                    </span>
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="eyebrow">Recursos importantes</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                Quais funcionalidades você gostaria de ter?
              </h1>
              <p className="mt-3 text-sm text-[#667A7F]">
                Pode selecionar mais de uma opção. Isso não fecha o escopo do projeto.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((feature) => {
                  const selected = selectedFeatures.includes(feature)
                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                        selected
                          ? 'border-[#9B7F57] bg-[#F0ECE4]'
                          : 'border-[#163B43]/10 bg-[#F7F7F3] hover:border-[#9B7F57]/45'
                      }`}
                    >
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-md border ${
                          selected
                            ? 'border-[#9B7F57] bg-[#9B7F57] text-white'
                            : 'border-[#163B43]/20'
                        }`}
                      >
                        {selected && <Icon name="check" className="size-3.5" />}
                      </span>
                      {feature}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="eyebrow">A parte mais importante</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                Conte sua ideia.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#667A7F]">
                Tem algo mais que gostaria de nos contar? Não precisa usar termos técnicos.
              </p>
              <div className="mt-8">
                <label htmlFor="idea" className="mb-3 block text-sm font-semibold">
                  O que você está imaginando?
                </label>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  rows={9}
                  minLength={10}
                  required
                  className="form-input resize-none !rounded-2xl !p-5"
                  placeholder="Descreva suas ideias, referências ou qualquer detalhe que considere importante. Não precisa ter tudo definido, podemos ajudar você a desenvolver o projeto."
                />
                <div className="mt-2 flex justify-between text-[10px] text-[#97A4A6]">
                  <span>Escreva do seu jeito.</span>
                  <span>{idea.length} caracteres</span>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="contact" className="mb-3 block text-sm font-semibold">
                  Como podemos falar com você?
                </label>
                <input
                  id="contact"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  required
                  minLength={5}
                  maxLength={160}
                  autoComplete="email"
                  className="form-input"
                  placeholder="Seu e-mail ou WhatsApp"
                  aria-describedby="contact-help"
                />
                <p
                  id="contact-help"
                  className={`mt-2 text-[11px] ${
                    contact.trim() && classifyContact(contact) === null ? 'text-red-800' : 'text-[#87979A]'
                  }`}
                >
                  {contact.trim() && classifyContact(contact) === null
                    ? CONTACT_RULE_MESSAGE
                    : 'Ex.: voce@empresa.com.br ou (34) 99999-9999. Responderemos por aí.'}
                </p>
              </div>
              <div className="mt-6 flex gap-3 rounded-2xl bg-[#F0ECE4] p-4 text-[#6F5839]">
                <Icon name="spark" className="mt-0.5 size-5 shrink-0" />
                <p className="text-xs font-semibold leading-5">
                  Não precisa ter todas as ideias definidas. Conte o que você precisa e nós
                  ajudaremos a encontrar o melhor caminho.
                </p>
              </div>
              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-[#163B43]/10 p-4">
                <input
                  type="checkbox"
                  required
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                  className="mt-1 accent-[#163B43]"
                />
                <span className="text-xs leading-5 text-[#60757A]">
                  Autorizo o uso destas respostas exclusivamente para analisar minha solicitação,
                  conforme a{' '}
                  <Link href="/privacidade" className="font-semibold underline">
                    Política de Privacidade
                  </Link>
                  .
                </span>
              </label>
            </>
          )}
        </div>

        {sendError && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-800">
            {sendError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-[#163B43]/8 pt-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-[#E9E9E4] ${
              step === 0 ? 'pointer-events-none opacity-0' : ''
            }`}
          >
            Voltar
          </button>
          <button
            disabled={!canContinue || sending}
            className="btn btn-ink px-6 py-3.5 text-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
          >
            {sending ? 'Enviando...' : step === 3 ? 'Enviar minha ideia' : 'Continuar'}
            {!sending && <Icon name="arrow" className="size-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
