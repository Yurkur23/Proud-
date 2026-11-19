import { redirect } from 'next/navigation'

// Endereço antigo (quando o painel era uma demonstração): mantém links antigos funcionando.
export default function LegacyDemoPage() {
  redirect('/area-cliente')
}
