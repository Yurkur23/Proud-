import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/server/site-url'

// Páginas públicas podem aparecer no Google; área do cliente, login e API não.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/area-cliente', '/entrar', '/cadastro', '/esqueci-senha', '/redefinir-senha'] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
