import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'

const nextCli = resolve('node_modules', 'next', 'dist', 'bin', 'next')
const port = process.env.PORT || '8080'
const server = spawn(
  process.execPath,
  [nextCli, 'start', '--hostname', '0.0.0.0', '--port', port],
  { stdio: 'inherit' },
)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}

server.on('error', (error) => {
  console.error('[discloud-start] falha ao iniciar Next.js:', error.message)
  process.exitCode = 1
})

server.on('exit', (code) => {
  process.exitCode = code ?? 1
})
