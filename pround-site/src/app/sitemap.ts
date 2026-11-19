import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/server/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return ['', '/projeto', '/privacidade', '/termos', '/cookies', '/reembolso'].map((path) => ({
    url: `${base}${path}`,
  }))
}
