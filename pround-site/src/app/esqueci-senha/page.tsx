import { AuthShell } from '../components/AuthShell'
import { ForgotForm } from './ForgotForm'

export const metadata = { title: 'Esqueci minha senha | Proud', robots: { index: false, follow: false } }

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <h1 className="text-3xl font-semibold tracking-[-.05em]">Esqueceu sua senha?</h1>
      <p className="mt-3 text-sm leading-6 text-[#60757A]">
        Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.
      </p>
      <div className="mt-8">
        <ForgotForm />
      </div>
    </AuthShell>
  )
}
