import Link from 'next/link'

export function Brand({
  light = false,
  className = '',
}: {
  light?: boolean
  className?: string
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-semibold tracking-[-0.04em] ${light ? 'text-[#F7F7F3]' : 'text-[#163B43]'} ${className}`}
    >
      <span
        className={`relative grid size-8 place-items-center rounded-full text-sm shadow-sm transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105 ${
          light
            ? 'bg-gradient-to-br from-[#E3D3B3] to-[#C5AD87] text-[#163B43] ring-1 ring-white/30'
            : 'bg-gradient-to-br from-[#214E58] to-[#163B43] text-[#F7F7F3] ring-1 ring-[#163B43]/10'
        }`}
      >
        P
      </span>
      <span className="text-xl">
        Proud<span className="text-[#C5AD87]">.</span>
      </span>
    </Link>
  )
}
