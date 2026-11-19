'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  ['+60', 'projetos entregues'],
  ['4.9/5', 'satisfação média'],
  ['24h', 'tempo de resposta'],
  ['99.9%', 'disponibilidade'],
] as const

function split(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', number: 0, decimals: 0, suffix: value }
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
  return { prefix: match[1], number: Number(match[2]), decimals, suffix: match[3] }
}

export function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  // 1 = valores finais (é o que o servidor renderiza e o que vale sem JavaScript)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setProgress(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1300
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setProgress(1 - Math.pow(1 - t, 3))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-[1320px] grid-cols-2 px-6 md:grid-cols-4 lg:px-10"
    >
      {stats.map(([value, label], index) => {
        const { prefix, number, decimals, suffix } = split(value)
        return (
          <div
            key={label}
            className={`group relative px-4 py-9 text-center transition-colors duration-300 hover:bg-white/50 md:py-11 ${
              index > 0 ? 'md:border-l md:border-[#163B43]/10' : ''
            } ${index % 2 === 1 ? 'border-l border-[#163B43]/10 md:border-l' : ''} ${
              index > 1 ? 'border-t border-[#163B43]/10 md:border-t-0' : ''
            }`}
          >
            <strong className="block text-4xl font-semibold tabular-nums tracking-[-.05em] text-[#163B43] md:text-5xl">
              {prefix}
              {(number * progress).toFixed(decimals)}
              {suffix}
            </strong>
            <span className="mt-2 block text-xs text-[#60757A] md:text-sm">{label}</span>
            <span className="absolute inset-x-8 bottom-0 h-px origin-center scale-x-0 bg-[#C5AD87] transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        )
      })}
    </div>
  )
}
