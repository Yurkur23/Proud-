import Link from 'next/link'
import { Brand } from './components/Brand'
import { Icon } from './components/Icon'
import { SiteHeader } from './components/SiteHeader'
import { Marquee } from './components/Marquee'
import { StatsBand } from './components/StatsBand'
import { DashboardPreview } from './components/DashboardPreview'
import { ServicesAccordion } from './components/ServicesAccordion'
import { SolutionsShowcase } from './components/SolutionsShowcase'
import { CookieSettingsButton } from './components/CookieConsent'
import { WhatsAppFloat } from './components/WhatsAppFloat'

export default function HomePage() {
  return (
    <main className="marketing-page overflow-x-clip bg-[#F7F7F3] text-[#163B43]">
      <section className="grain grain-open relative min-h-[760px] overflow-hidden bg-[#163B43] text-white lg:min-h-[860px]">
        <div className="aurora absolute inset-0" />
        <SiteHeader />
        <div className="hero-grid absolute inset-0 opacity-30" />
        <div className="absolute -right-40 top-36 size-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-16 top-64 size-[290px] rounded-full border border-[#C5AD87]/30" />
        <div className="absolute -left-32 bottom-10 size-[380px] rounded-full border border-white/[.06]" />
        <div className="relative z-10 mx-auto flex max-w-[1320px] flex-col px-6 pb-16 pt-44 lg:flex-row lg:items-center lg:px-10 lg:pb-24 lg:pt-48">
          <div className="hero-copy relative z-10 max-w-3xl lg:w-[63%]">
            <div className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#C5AD87]">
              <span className="relative size-1.5 rounded-full bg-[#C5AD87] pulse-dot" /> Websites com
              propósito
            </div>
            <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7.7rem)] font-medium leading-[.87] tracking-[-0.07em]">
              Sua presença digital{' '}
              <span className="serif italic font-normal text-gradient-sand">começa aqui.</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl font-medium leading-8 text-white/75">
              Sites profissionais, feitos para impulsionar seu negócio.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/projeto" className="group btn btn-sand px-7 py-4">
                Quero um site melhor{' '}
                <Icon name="arrow" className="size-5 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/#projetos" className="btn btn-ghost-light px-7 py-4 font-medium">
                Ver soluções
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/60">
              {['Projeto sob medida', 'Suporte contínuo', '100% responsivo'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-[#C5AD87]/15">
                    <Icon name="check" className="size-3 text-[#C5AD87]" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-visual relative mt-14 h-[390px] lg:mt-0 lg:h-[540px] lg:w-[37%]">
            <div className="absolute right-0 top-4 h-[88%] w-[87%] overflow-hidden rounded-[2rem] bg-[#D8D3C8] shadow-float ring-1 ring-white/20">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 border-b border-white/15 bg-[#0F2B31]/60 px-4 py-3 backdrop-blur-md"
              >
                <span className="size-2.5 rounded-full bg-[#E8806E]/90" />
                <span className="size-2.5 rounded-full bg-[#E9C46A]/90" />
                <span className="size-2.5 rounded-full bg-[#7CCBA0]/90" />
                <span className="ml-3 flex-1 truncate rounded-full bg-white/10 px-3 py-1 text-[10px] tracking-wide text-white/70">
                  seusite.com.br
                </span>
              </div>
              <img
                src="/pround-workspace.svg"
                alt="Notebook exibindo um projeto de interface em uma mesa de trabalho"
                className="h-full w-full object-cover grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163B43]/55 via-transparent to-[#163B43]/10" />
            </div>
            <div className="floating-card absolute -left-4 top-20 z-20 hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#0F2B31]/85 px-4 py-3 text-white shadow-float backdrop-blur-xl sm:flex">
              <span className="relative size-2.5 rounded-full bg-[#6FD1A0] pulse-dot" />
              <div>
                <strong className="block text-lg leading-none tracking-[-.03em]">99.9%</strong>
                <span className="text-[11px] text-white/60">disponibilidade</span>
              </div>
            </div>
            <div className="floating-card absolute bottom-0 left-0 rounded-2xl border border-white/15 bg-[#F7F7F3] p-5 text-[#163B43] shadow-float sm:w-64">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[.16em] text-[#667A7F]">
                  Projeto entregue
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87]">
                  <Icon name="check" className="size-4" />
                </span>
              </div>
              <div className="mt-7 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-[-.04em]">+42%</p>
                <svg aria-hidden="true" viewBox="0 0 80 28" className="h-7 w-20 text-[#9B7F57]">
                  <path
                    d="M1 24C10 22 14 14 24 16s14 8 24-2 14-10 31-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-1 text-sm text-[#60757A]">de conversões no primeiro mês</p>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="border-b border-[#163B43]/10 bg-gradient-to-b from-[#EFEFEA] to-[#E9E9E4]">
        <StatsBand />
      </section>

      <section id="servicos" className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-[#9B7F57]/60" />O que fazemos
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.05] tracking-[-.05em] md:text-5xl">
              Da primeira ideia à manutenção contínua, construímos e cuidamos da sua presença
              digital em cada etapa.
            </h2>
          </div>
          <ServicesAccordion />
        </div>
      </section>

      <section id="processo" className="relative bg-[#E9E9E4] py-24 lg:py-32">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-[#9B7F57]/60" />Nosso processo
              </p>
              <h2 className="mt-5 max-w-2xl text-5xl font-medium leading-none tracking-[-.055em] md:text-6xl">
                Simples para você.
                <br />
                Intencional em cada detalhe.
              </h2>
            </div>
            <p className="max-w-sm leading-7 text-[#60757A]">
              Você acompanha cada etapa, sabe o que está acontecendo e fala com pessoas de verdade.
            </p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-[#163B43]/10 shadow-lift ring-1 ring-[#163B43]/10 md:grid-cols-4">
            {[
              {
                number: '01',
                title: 'Imersão',
                text: 'Entendemos seu negócio, público e objetivos.',
                image: '/processo-imersao.webp',
                alt: 'Duas pessoas colaborando e discutindo ideias para um projeto',
              },
              {
                number: '02',
                title: 'Estratégia',
                text: 'Organizamos conteúdo, jornada e prioridades.',
                image: '/processo-estrategia.webp',
                alt: 'Equipe reunida para planejar a estratégia do projeto',
              },
              {
                number: '03',
                title: 'Criação',
                text: 'Design e desenvolvimento em ciclos transparentes.',
                image: '/processo-criacao.webp',
                alt: 'Mesa de trabalho com notebook, câmera, celular e café',
              },
              {
                number: '04',
                title: 'Evolução',
                text: 'Publicamos, medimos e seguimos cuidando.',
                image: '/processo-evolucao.webp',
                alt: 'Equipe analisando gráficos e acompanhando a evolução de resultados',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="polish-card group relative overflow-hidden bg-[#F7F7F3] transition duration-500 hover:z-10 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#C5AD87] to-[#9B7F57] transition-transform duration-500 group-hover:scale-x-100" />
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#163B43]/65 via-[#163B43]/10 to-transparent" />
                  <span className="absolute bottom-4 left-5 grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] text-[11px] font-bold text-[#163B43] ring-4 ring-[#163B43]/25">
                    {item.number}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold tracking-[-.035em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#60757A]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SolutionsShowcase />

      <section className="grain relative isolate overflow-hidden bg-[#163B43] py-24 text-white lg:py-32">
        <div className="aurora absolute inset-0" />
        <div className="absolute -left-40 top-10 size-[460px] rounded-full border border-white/[.07]" />
        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-16 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10">
          <div>
            <p className="eyebrow flex items-center gap-3 !text-[#C5AD87]">
              <span className="h-px w-8 bg-[#C5AD87]/60" />Depois do lançamento
            </p>
            <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-.055em] md:text-6xl">
              Seu site cuidado como parte do seu time.
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-white/60">
              Na área do cliente Pround, você centraliza sites, chamados e manutenções. Sem e-mails
              perdidos, sem ficar no escuro.
            </p>
            <Link href="/area-cliente" className="group btn btn-sand mt-9 px-6 py-4">
              Explorar área do cliente{' '}
              <Icon name="arrow" className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-[#C5AD87]/10 blur-3xl" />
            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="relative mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36">
        <div className="text-center">
          <p className="eyebrow flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#9B7F57]/60" />
            Planos de desenvolvimento
            <span className="h-px w-8 bg-[#9B7F57]/60" />
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-5xl font-medium leading-none tracking-[-.055em] md:text-6xl">
            Um começo à altura do seu próximo passo.
          </h2>
        </div>
        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
          {[
            {
              name: 'Essencial',
              desc: 'Presença profissional para começar certo.',
              items: ['Site institucional', 'Até 5 páginas', 'Design responsivo', 'SEO essencial'],
            },
            {
              name: 'Crescimento',
              desc: 'Estrutura para atrair e converter mais.',
              items: [
                'Estratégia de conteúdo',
                'Até 10 páginas',
                'Integrações e automações',
                'Suporte prioritário',
              ],
              featured: true,
            },
            {
              name: 'Sob medida',
              desc: 'Experiências digitais sem limitações.',
              items: [
                'Projeto personalizado',
                'Funcionalidades exclusivas',
                'Área logada ou e-commerce',
                'Evolução contínua',
              ],
            },
          ].map((plan) => (
            <article
              key={plan.name}
              className={`polish-card group relative flex flex-col overflow-hidden rounded-[1.75rem] p-7 transition duration-500 hover:-translate-y-2 sm:p-8 ${
                plan.featured
                  ? 'grain ring-gradient isolate bg-gradient-to-b from-[#1D4A54] to-[#0F2B31] text-white shadow-float lg:-my-4 lg:py-11'
                  : 'border border-[#163B43]/12 bg-white hover:border-[#C5AD87] hover:shadow-lift'
              }`}
            >
              {plan.featured && (
                <>
                  <div className="aurora-soft absolute inset-0" />
                  <span className="absolute right-6 top-6 z-10 rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#163B43]">
                    Mais escolhido
                  </span>
                </>
              )}
              <div className="relative z-10 flex flex-1 flex-col">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p
                  className={`mt-3 max-w-xs text-sm leading-6 ${plan.featured ? 'text-white/60' : 'text-[#60757A]'}`}
                >
                  {plan.desc}
                </p>
                <div
                  className={`my-7 h-px ${plan.featured ? 'bg-gradient-to-r from-white/25 to-transparent' : 'bg-gradient-to-r from-[#163B43]/15 to-transparent'}`}
                />
                <ul className="flex-1 space-y-3.5">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full ${plan.featured ? 'bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] text-[#163B43]' : 'bg-[#F0ECE4] text-[#9B7F57] transition group-hover:bg-[#C5AD87] group-hover:text-[#163B43]'}`}
                      >
                        <Icon name="check" className="size-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/projeto"
                  className={`btn mt-9 py-3.5 text-sm ${plan.featured ? 'btn-sand' : 'btn-outline'}`}
                >
                  Conversar sobre o projeto
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="cta-shine relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#D6C3A0,#C5AD87_48%,#B49A71)] px-6 py-20 text-center text-[#163B43] lg:py-28">
          <div className="absolute -left-24 -top-24 size-64 rounded-full border border-[#163B43]/10" />
          <div className="absolute -bottom-28 -right-16 size-72 rotate-12 rounded-[4rem] border border-[#163B43]/10" />
          <div className="absolute bottom-12 right-[8%] size-3 rounded-full bg-[#163B43]/20" />
          <div className="relative z-10">
            <p className="eyebrow">Vamos criar algo relevante?</p>
            <h2 className="serif mx-auto mt-5 max-w-4xl text-5xl italic leading-none tracking-[-.04em] md:text-7xl">
              Seu próximo grande passo pode começar com um bom site.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#163B43]/70 sm:text-base">
              Conte o que você está imaginando. Nós ajudamos a transformar sua ideia em uma
              experiência digital.
            </p>
            <Link href="/projeto" className="group btn btn-ink mt-8 px-7 py-4 text-sm sm:text-base">
              <span>Conte sua ideia</span>
              <Icon
                name="arrow"
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#0F2B31] px-6 pt-16 text-white lg:px-10">
        <div className="aurora-soft absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-[1320px] gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Brand light />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
              Sites dos quais você vai se orgulhar. Estratégia, design, tecnologia e cuidado em um
              só parceiro.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#C5AD87]">
              Navegue
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">
              <Link href="/#servicos" className="w-fit transition hover:translate-x-1 hover:text-white">
                Serviços
              </Link>
              <Link href="/#projetos" className="w-fit transition hover:translate-x-1 hover:text-white">
                Soluções
              </Link>
              <Link href="/#planos" className="w-fit transition hover:translate-x-1 hover:text-white">
                Planos
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#C5AD87]">
              Cliente Pround
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/60">
              <Link href="/entrar" className="w-fit transition hover:translate-x-1 hover:text-white">
                Entrar
              </Link>
              <Link
                href="/area-cliente"
                className="w-fit transition hover:translate-x-1 hover:text-white"
              >
                Acessar área privada
              </Link>
              <Link href="/projeto" className="w-fit transition hover:translate-x-1 hover:text-white">
                Solicitar projeto
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#C5AD87]">
              Legal e privacidade
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <Link href="/privacidade" className="transition hover:text-white">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="transition hover:text-white">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="transition hover:text-white">
                Política de Consentimento de Cookies
              </Link>
              <Link href="/reembolso" className="transition hover:text-white">
                Política de Reembolso
              </Link>
              <CookieSettingsButton />
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex max-w-[1320px] flex-col justify-between gap-3 pt-8 text-xs text-white/40 sm:flex-row">
          <span>© 2026 Pround. Todos os direitos reservados.</span>
          <span>Privacidade · Termos · Cookies · LGPD</span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 mx-auto mt-10 h-[clamp(4rem,13vw,13rem)] max-w-[1320px] select-none overflow-hidden"
        >
          <p className="outline-word whitespace-nowrap text-center text-[clamp(6rem,19vw,17rem)] font-semibold leading-[.8] tracking-[-.08em]">
            Pround.
          </p>
        </div>
      </footer>
      <WhatsAppFloat />
    </main>
  )
}
