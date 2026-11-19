import Link from 'next/link'
import { Icon } from './Icon'

const solutions = [
  {
    number: '01',
    title: 'Landing pages',
    description:
      'Páginas objetivas e persuasivas para apresentar uma oferta e transformar campanhas em contatos ou vendas.',
    problem:
      'Campanhas que levam o público para perfis ou páginas genéricas, sem uma jornada clara para a conversão.',
    resources: [
      'Copy e estrutura estratégica',
      'Formulários e WhatsApp',
      'Métricas e responsividade',
    ],
    technologies: ['HTML', 'CSS', 'TypeScript', 'Next.js', 'Tailwind'],
    image: '/landing-pages-exemplo.webp',
    alt: 'Estação de trabalho moderna representando uma landing page profissional',
    proof: 'Para campanhas, lançamentos e captação',
    tone: 'bg-[#DDE5E5]',
  },
  {
    number: '02',
    title: 'Sites com hospedagem',
    description:
      'Criação, publicação e cuidado técnico contínuo para manter sua presença digital rápida, segura e disponível.',
    problem:
      'Empresas que não querem lidar com domínio, certificado, servidor, segurança, atualizações e cópias de segurança.',
    resources: ['Hospedagem gerenciada', 'SSL, backups e domínio', 'Monitoramento e suporte'],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Cloud'],
    image: '/hospedagem-cloud.webp',
    alt: 'Infraestrutura de servidores representando hospedagem segura e monitorada',
    proof: 'Infraestrutura cuidada de ponta a ponta',
    tone: 'bg-[#D8E0E1]',
  },
  {
    number: '03',
    title: 'Reformulação e recuperação',
    description:
      'Analisamos sites existentes, corrigimos problemas e reconstruímos a experiência quando ela já não acompanha o negócio.',
    problem:
      'Sites lentos, desatualizados, com erros, visual antigo ou estrutura difícil de manter e evoluir.',
    resources: ['Auditoria técnica e visual', 'Redesign e correções', 'Migração e otimização'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'MySQL'],
    image: '/restauracao-sites.webp',
    alt: 'Notebook com código representando análise, correção e reformulação de sites',
    proof: 'Melhoramos o que você já construiu',
    tone: 'bg-[#DCE2DF]',
  },
  {
    number: '04',
    title: 'Aplicações web (PWA)',
    description:
      'Soluções rápidas e instaláveis, com experiência semelhante à de um aplicativo e acesso pelo navegador.',
    problem:
      'Equipes e clientes que precisam acessar funções importantes pelo celular sem depender de uma loja de aplicativos.',
    resources: ['Instalação no celular', 'Uso responsivo', 'Notificações e acesso rápido'],
    technologies: ['PWA', 'TypeScript', 'React', 'PostgreSQL', 'Tailwind'],
    proof: 'Experiência aplicada na Kings Produtos',
    tone: 'bg-black',
    image: '/kings-dashboard.webp',
    alt: 'Painel real do sistema Kings com pedidos, receita e controle de estoque',
    imageFit: 'contain',
  },
]

export function SolutionsShowcase() {
  return (
    <section
      id="projetos"
      className="grain relative isolate overflow-hidden bg-[#0F2B31] py-24 text-white lg:py-36"
    >
      <div className="aurora-soft absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-3 !text-[#C5AD87]">
              <span className="h-px w-8 bg-[#C5AD87]/60" />
              Soluções digitais
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-medium leading-[.98] tracking-[-.055em] md:text-7xl">
              O que podemos construir para você.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-white/55 lg:justify-self-end">
            Não entregamos apenas páginas bonitas. Criamos soluções que resolvem problemas reais,
            organizam operações e ajudam empresas a crescer com mais clareza.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {solutions.map((solution) => (
            <article
              key={solution.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#F7F7F3] text-[#163B43] shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)] transition duration-500 hover:-translate-y-1.5 hover:border-[#C5AD87]/60 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,.55)]"
            >
              <div className={`relative h-72 overflow-hidden ${solution.tone}`}>
                <img
                  src={solution.image}
                  alt={solution.alt}
                  className={`h-full w-full transition duration-700 group-hover:scale-[1.04] ${
                    solution.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102F36]/65 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-[#102F36]/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-md">
                  {solution.proof}
                </div>
                <span className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-[#C5AD87] text-xs font-bold text-[#163B43] shadow-lg ring-4 ring-[#102F36]/30">
                  {solution.number}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-.045em]">{solution.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#60757A]">{solution.description}</p>

                <div className="mt-6 rounded-2xl border border-[#163B43]/8 border-l-[3px] border-l-[#C5AD87] bg-[#E9E9E4]/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#9B7F57]">
                    Problema que resolvemos
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#526A70]">{solution.problem}</p>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#87979A]">
                      Principais recursos
                    </p>
                    <ul className="mt-3 space-y-2">
                      {solution.resources.map((resource) => (
                        <li
                          key={resource}
                          className="flex items-center gap-2 text-xs font-semibold"
                        >
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#F0ECE4]">
                            <Icon name="check" className="size-3 text-[#9B7F57]" />
                          </span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#87979A]">
                      Tecnologias possíveis
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {solution.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-[#163B43]/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#60757A] transition hover:border-[#C5AD87] hover:text-[#163B43]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-[#163B43]/8 pt-5">
                  <Link
                    href="/projeto"
                    className="group/link btn btn-outline ml-auto gap-2 px-5 py-2.5 text-sm"
                  >
                    Quero uma solução assim
                    <Icon
                      name="arrow"
                      className="size-4 transition group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="glass mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl p-6 sm:flex-row">
          <p className="max-w-2xl text-sm leading-6 text-white/60">
            Sua ideia não se encaixa exatamente nessas categorias? Ótimo. Projetos sob medida
            começam com uma boa conversa.
          </p>
          <Link
            href="/projeto"
            className="btn btn-sand shrink-0 gap-2 px-5 py-3 text-sm"
          >
            Conte o que você precisa <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
