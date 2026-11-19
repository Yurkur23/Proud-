import { Suspense } from 'react'
import { AuthShell } from '../components/AuthShell'
import { ResetForm } from './ResetForm'

export const metadata = { title: 'Criar nova senha | Pround', robots: { index: false, follow: false } }

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <h1 className="text-3xl font-semibold tracking-[-.05em]">Criar nova senha</h1>
      <p className="mt-3 text-sm leading-6 text-[#60757A]">Escolha uma senha forte para a sua conta.</p>
      <div className="mt-8">
        {/* useSearchParams precisa de Suspense para o build estático */}
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </AuthShell>
  )
}
