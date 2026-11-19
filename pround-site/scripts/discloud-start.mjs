import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const nextCli = resolve('node_modules', 'next', 'dist', 'bin', 'next')
const port = process.env.PORT || '8080'
const buildId = resolve('.next', 'BUILD_ID')
let child

function startServer() {
  child = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', '0.0.0.0', '--port', port],
    { stdio: 'inherit' },
  )

  child.on('error', (error) => {
    console.error('[discloud-start] falha ao iniciar Next.js:', error.message)
    process.exitCode = 1
  })

  child.on('exit', (code) => {
    process.exitCode = code ?? 1
  })
}

function buildThenStart() {
  console.warn('[discloud-start] build de produção ausente; executando npm run build.')
  child = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  child.on('error', (error) => {
    console.error('[discloud-start] falha ao executar o build:', error.message)
    process.exitCode = 1
  })

  child.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`[discloud-start] build falhou (código ${code ?? 'indisponível'}${signal ? `, sinal ${signal}` : ''}).`)
      process.exitCode = code ?? 1
      return
    }
    if (!existsSync(buildId)) {
      console.error('[discloud-start] build terminou sem gerar .next/BUILD_ID.')
      process.exitCode = 1
      return
    }
    startServer()
  })
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child?.kill(signal))
}

if (existsSync(buildId)) startServer()
else buildThenStart()
