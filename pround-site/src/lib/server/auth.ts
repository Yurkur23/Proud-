import { betterAuth } from 'better-auth'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { nextCookies } from 'better-auth/next-js'
import { getPool } from './db'
import { emailReady, resetPasswordEmail, sendEmail } from './email'
import { siteUrl, trustedOrigins } from './site-url'
import { isStrongPassword, PASSWORD_RULE_MESSAGE } from '../password-policy'

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('Defina BETTER_AUTH_SECRET com 32+ caracteres aleatórios (ex.: openssl rand -base64 32).')
  }
  const isProd = process.env.NODE_ENV === 'production'

  return betterAuth({
    appName: 'Proud',
    secret,
    baseURL: siteUrl(),
    trustedOrigins: trustedOrigins(),
    database: getPool(),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      // O e-mail é só informado (não confirmado): quem se cadastra já entra. Ele serve para recuperar a senha.
      requireEmailVerification: false,
      autoSignIn: true,
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hora
      revokeSessionsOnPasswordReset: true, // trocou a senha -> derruba os outros logins
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({ to: user.email, ...resetPasswordEmail(user.name, url) })
      },
    },

    user: {
      additionalFields: {
        phone: { type: 'string', required: false, defaultValue: '', input: true },
        // input:false = ninguém consegue se promover a admin pela API; só via scripts/promote-admin.mjs
        role: { type: 'string', required: false, defaultValue: 'client', input: false },
      },
    },

    session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },

    // Limite de tentativas guardado no banco (serverless não tem memória fixa)
    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 60,
      customRules: {
        '/sign-in/email': { window: 60, max: 8 },
        '/sign-up/email': { window: 3600, max: 10 },
        '/request-password-reset': { window: 3600, max: 5 },
        '/reset-password': { window: 3600, max: 10 },
      },
    },

    advanced: {
      useSecureCookies: isProd,
      cookiePrefix: 'pround',
      ipAddress: { ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'] },
    },

    // Validações que valem no servidor (o formulário do navegador é só conveniência)
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        const body = (ctx.body ?? {}) as Record<string, unknown>
        // Sem e-mail configurado ninguém conseguiria trocar a senha: melhor recusar logo do que
        // fingir que enviou (o erro de envio do Better Auth é silencioso).
        if (ctx.path === '/request-password-reset' && !emailReady()) {
          console.error('[email] RESEND_API_KEY/EMAIL_FROM não configurados: recuperação de senha indisponível.')
          throw new APIError('SERVICE_UNAVAILABLE', { message: 'Envio de e-mail indisponível.', code: 'EMAIL_NOT_CONFIGURED' })
        }
        if (ctx.path === '/sign-up/email') {
          if (!isStrongPassword(body.password)) {
            throw new APIError('BAD_REQUEST', { message: PASSWORD_RULE_MESSAGE, code: 'WEAK_PASSWORD' })
          }
          const name = typeof body.name === 'string' ? body.name.trim() : ''
          if (name.length < 2 || name.length > 120) {
            throw new APIError('BAD_REQUEST', { message: 'Informe seu nome completo.', code: 'INVALID_NAME' })
          }
          const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
          if (!/^[0-9+()\-\s.]{10,30}$/.test(phone)) {
            throw new APIError('BAD_REQUEST', { message: 'Informe um telefone válido.', code: 'INVALID_PHONE' })
          }
        }
        if (ctx.path === '/reset-password' && !isStrongPassword(body.newPassword)) {
          throw new APIError('BAD_REQUEST', { message: PASSWORD_RULE_MESSAGE, code: 'WEAK_PASSWORD' })
        }
      }),
    },

    plugins: [nextCookies()], // precisa ser o último plugin
  })
}

type Auth = ReturnType<typeof createAuth>
const globalForAuth = globalThis as unknown as { __prounAuth?: Auth }

// Criado sob demanda (não no import) para o build não exigir as variáveis de ambiente.
export function getAuth(): Auth {
  if (!globalForAuth.__prounAuth) globalForAuth.__prounAuth = createAuth()
  return globalForAuth.__prounAuth
}
