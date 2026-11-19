import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

// Fala com /api/auth/* (mesmo domínio). Nenhuma chave no navegador.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({ user: { phone: { type: 'string', required: false } } })],
})
