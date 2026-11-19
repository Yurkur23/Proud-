const items = [
  'Sites que vendem',
  'Hospedagem cuidada',
  'Suporte que resolve',
  'Landing pages',
  'Sites com hospedagem',
  'Reformulação e recuperação',
  'Aplicações web (PWA)',
]

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="serif whitespace-nowrap px-8 text-2xl italic text-white/80 sm:text-3xl">
            {item}
          </span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-[#C5AD87]">
            <path fill="currentColor" d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" />
          </svg>
        </li>
      ))}
    </ul>
  )
}

export function Marquee() {
  return (
    <section className="grain relative overflow-hidden border-y border-[#C5AD87]/15 bg-[#0F2B31] py-6">
      <div className="marquee relative z-10">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
