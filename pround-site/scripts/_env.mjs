// Carrega variáveis de ambiente para os scripts (funciona igual no Windows, Mac e Linux).
//   npm run db:migrate                          -> usa .env.local
//   npm run db:migrate -- --env=.env.production -> usa outro arquivo (ex.: com os dados de produção)
import { existsSync } from 'node:fs'

export function loadEnv() {
  const flag = process.argv.find((a) => a.startsWith('--env='))
  const file = flag ? flag.slice('--env='.length) : '.env.local'
  if (existsSync(file)) process.loadEnvFile(file)
  else if (flag) {
    console.error(`Arquivo ${file} não encontrado.`)
    process.exit(1)
  }
  return process.argv.slice(2).filter((a) => !a.startsWith('--env='))
}
