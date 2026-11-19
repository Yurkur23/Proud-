import { Pool } from 'pg'

// Um único pool por instância da função (reaproveitado entre requisições).
// Criado só quando alguém usa o banco, para o `next build` não exigir DATABASE_URL.
const globalForPool = globalThis as unknown as { __prounPool?: Pool }

export function getPool(): Pool {
  if (!globalForPool.__prounPool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL não configurada (veja .env.example).')
    const pool = new Pool({
      connectionString,
      max: 5, // funções serverless: poucas conexões por instância (use a URL "pooled" do Neon)
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    })
    pool.on('error', (error) => console.error('[pg] erro em conexão ociosa:', error.message))
    globalForPool.__prounPool = pool
  }
  return globalForPool.__prounPool
}
