'use client'

import { useState } from 'react'
import { Icon } from './Icon'

const services = [
  {
    icon: 'code' as const,
    number: '01',
    title: 'Sites que vendem',
    summary:
      'Estratégia, design e tecnologia combinados para transformar visitas em novas oportunidades.',
    details: [
      'Muito mais que uma vitrine digital, seu site é uma ferramenta para apresentar sua empresa e conquistar novos clientes.',
      'Desenvolvemos páginas personalizadas, com design exclusivo, navegação intuitiva e estrutura responsiva, garantindo uma experiência profissional em qualquer dispositivo.',
      'Cada detalhe é pensado para transmitir confiança, destacar seus diferenciais e facilitar o contato entre sua empresa e seus clientes.',
    ],
  },
  {
    icon: 'globe' as const,
    number: '02',
    title: 'Hospedagem cuidada',
    summary:
      'Performance, segurança, backups e disponibilidade 24/7 sem você precisar pensar na operação.',
    details: [
      'Seu site merece estar sempre disponível, seguro e funcionando como deveria.',
      'Cuidamos da hospedagem e da infraestrutura necessária para manter sua presença digital no ar, com atenção à performance, segurança, backups e estabilidade.',
      'Você não precisa se preocupar com questões técnicas: nós cuidamos dos bastidores para que você possa se concentrar no seu negócio.',
    ],
  },
  {
    icon: 'headset' as const,
    number: '03',
    title: 'Suporte que resolve',
    summary:
      'Uma área exclusiva para pedir ajustes, acompanhar chamados e manter tudo sob controle.',
    details: [
      'Nosso trabalho não termina quando seu site vai ao ar. Continuamos ao seu lado para garantir que ele acompanhe as necessidades da sua empresa.',
      'Oferecemos suporte contínuo para atualizações, correções, ajustes de conteúdo e melhorias, além de um canal organizado para acompanhar suas solicitações.',
      'Você conta com uma equipe disponível para cuidar do seu site mesmo depois da entrega do projeto.',
    ],
  },
]

export function ServicesAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="border-t border-[#163B43]/15">
      {services.map((service, index) => {
        const expanded = open === index
        return (
          <article
            key={service.title}
            className={`group relative border-b border-[#163B43]/15 transition-all duration-500 hover:bg-white/60 ${expanded ? 'bg-gradient-to-r from-white/95 to-white/40 shadow-lift' : ''}`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-gradient-to-b from-[#C5AD87] to-[#9B7F57] transition-transform duration-500 ${expanded ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`}
            />
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
              className="grid w-full gap-5 py-8 text-left sm:grid-cols-[70px_1fr_auto] sm:items-center sm:px-5"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[#E4E1DA] ring-1 ring-[#163B43]/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-gradient-to-br group-hover:from-[#E3D3B3] group-hover:to-[#C5AD87]">
                <Icon name={service.icon} />
              </span>
              <div>
                <p className="serif mb-1 text-xl italic text-[#9B7F57]">{service.number}</p>
                <h3 className="text-2xl font-semibold tracking-[-.035em]">{service.title}</h3>
                <p className="mt-2 max-w-lg text-[15px] leading-7 text-[#60757A]">
                  {service.summary}
                </p>
              </div>
              <span
                className={`grid size-11 place-items-center rounded-full border border-[#163B43]/15 transition-all duration-300 group-hover:border-[#163B43]/35 group-hover:bg-[#163B43] group-hover:text-white ${expanded ? 'rotate-90 bg-[#163B43] text-white' : ''}`}
              >
                <Icon name="arrow" />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div
                  className={`grid gap-5 pb-9 pl-0 pr-0 transition-transform duration-500 sm:ml-[90px] sm:mr-20 sm:grid-cols-3 ${expanded ? 'translate-y-0' : '-translate-y-3'}`}
                >
                  {service.details.map((paragraph, detailIndex) => (
                    <div
                      key={paragraph}
                      className="rounded-2xl border border-[#163B43]/8 bg-[#F7F7F3] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C5AD87]/60 hover:shadow-md"
                    >
                      <span className="text-[10px] font-bold text-[#A38A64]">
                        0{detailIndex + 1}
                      </span>
                      <p className="mt-3 text-sm leading-6 text-[#526A70]">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
