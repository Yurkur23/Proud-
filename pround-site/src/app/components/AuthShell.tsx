import { Brand } from './Brand'

// Moldura das telas "Esqueci a senha" e "Criar nova senha".
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-[calc(100vh-2.5rem)] place-items-center overflow-hidden bg-[#E9E9E4] px-6 py-24 text-[#163B43]">
      <div className="aurora-soft absolute inset-0 opacity-70" />
      <Brand className="absolute left-6 top-6 lg:left-10 lg:top-9" />
      <div className="animate-pop-in relative w-full max-w-md rounded-[2rem] border border-white/70 bg-[#F7F7F3] p-7 shadow-[0_30px_100px_-30px_rgba(20,50,40,.3)] sm:p-10">
        {children}
      </div>
    </main>
  )
}
