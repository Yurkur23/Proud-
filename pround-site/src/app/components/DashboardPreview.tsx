import { Brand } from './Brand'
import { Icon } from './Icon'

// Miniatura decorativa da área do cliente (usada na home e na tela de login).
export function DashboardPreview() {
  return (
    <div className="glass rounded-[2rem] p-3 shadow-float sm:p-5">
      <div className="mb-3 flex items-center gap-1.5 px-2 pt-1">
        <span className="size-2.5 rounded-full bg-[#E8806E]/80" />
        <span className="size-2.5 rounded-full bg-[#E9C46A]/80" />
        <span className="size-2.5 rounded-full bg-[#7CCBA0]/80" />
      </div>
      <div className="rounded-[1.4rem] bg-[#F7F7F3] p-5 text-[#163B43]">
        <div className="flex items-center justify-between border-b border-[#163B43]/10 pb-4">
          <Brand />
          <div className="flex gap-2">
            <span className="relative grid size-9 place-items-center rounded-full bg-[#E9E9E4]">
              <Icon name="bell" className="size-4" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#A14D3F] ring-2 ring-[#E9E9E4]" />
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] text-xs font-semibold">
              MA
            </span>
          </div>
        </div>
        <div className="grid gap-3 pt-5 sm:grid-cols-3">
          {[
            ['site', '2', 'Sites ativos'],
            ['ticket', '1', 'Chamado aberto'],
            ['clock', '24h', 'Resposta média'],
          ].map(([icon, value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-[#163B43]/5 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-[#F0ECE4]">
                <Icon name={icon as 'site'} className="size-4 text-[#9B7F57]" />
              </span>
              <strong className="mt-4 block text-2xl tracking-[-.03em]">{value}</strong>
              <span className="text-xs text-[#667A7F]">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-[#163B43]/5 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Atualização do formulário</span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#fff0c8] px-2 py-1 text-[10px] font-semibold text-[#8c6714]">
              <span className="relative size-1.5 rounded-full bg-[#C99A1E] pulse-dot" />
              EM ANDAMENTO
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E4E1DA]">
            <div className="bar-grow h-full w-2/3 rounded-full bg-gradient-to-r from-[#C5AD87] to-[#9B7F57]" />
          </div>
        </div>
      </div>
    </div>
  )
}
