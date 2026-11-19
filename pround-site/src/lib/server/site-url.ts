// Endereço público do site. Prioridade: NEXT_PUBLIC_SITE_URL > domínio de produção da Vercel >
// endereço do deploy atual (preview) > localhost.
function clean(url: string) {
  return url.replace(/\/+$/, '')
}

export function siteUrl() {
  const configuredUrl = process.env.BUILD_NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (configuredUrl) return clean(configuredUrl)
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

// Origens que podem chamar a API com cookies (proteção contra CSRF).
export function trustedOrigins() {
  const list = [siteUrl()]
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) list.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  if (process.env.VERCEL_URL) list.push(`https://${process.env.VERCEL_URL}`)
  for (const extra of (process.env.TRUSTED_ORIGINS ?? '').split(',')) {
    if (extra.trim()) list.push(clean(extra.trim()))
  }
  return [...new Set(list)]
}
