import { siteUrl } from './site-url'

// Envio de e-mails. Em produção usa o Resend (https://resend.com) por HTTPS, sem biblioteca extra.
//   RESEND_API_KEY + EMAIL_FROM            -> envia de verdade
//   EMAIL_TRANSPORT=log (só fora da Vercel) -> imprime o e-mail (com o link) no console: para testes locais
// Em produção sem Resend configurado o envio FALHA de propósito (nunca finge que enviou).

type Transport = 'resend' | 'log' | 'none'

function transport(): Transport {
  if (process.env.EMAIL_TRANSPORT === 'log') {
    return process.env.VERCEL_ENV === 'production' ? 'none' : 'log'
  }
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) return 'resend'
  return process.env.NODE_ENV === 'production' ? 'none' : 'log'
}

// true quando dá para entregar e-mail (Resend configurado, ou modo "log" fora da produção)
export function emailReady() {
  return transport() !== 'none'
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function sendEmail(input: { to: string | string[]; subject: string; html: string; text: string }) {
  const to = Array.isArray(input.to) ? input.to : [input.to]
  const mode = transport()

  if (mode === 'log') {
    console.log(`[email:dev] para=${to.join(',')} assunto="${input.subject}"\n${input.text}\n[/email:dev]`)
    return
  }
  if (mode === 'none') {
    throw new Error('E-mail não configurado: defina RESEND_API_KEY e EMAIL_FROM nas variáveis de ambiente.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject: input.subject, html: input.html, text: input.text }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) {
    throw new Error(`Falha ao enviar e-mail (Resend respondeu ${response.status}): ${(await response.text()).slice(0, 300)}`)
  }
}

// Modelo visual simples (HTML de e-mail precisa de tabela e estilo inline).
function layout(title: string, bodyHtml: string, button?: { label: string; url: string }) {
  const site = siteUrl()
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#E9E9E4;font-family:Arial,Helvetica,sans-serif;color:#163B43">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F7F7F3;border-radius:20px;overflow:hidden">
<tr><td style="background:#163B43;padding:22px 28px;color:#F7F7F3;font-size:20px;font-weight:bold">Proud<span style="color:#C5AD87">.</span></td></tr>
<tr><td style="padding:32px 28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${escapeHtml(title)}</h1>
<div style="font-size:15px;line-height:1.6;color:#385a61">${bodyHtml}</div>
${button ? `<p style="margin:28px 0 8px"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:#163B43;color:#fff;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:999px">${escapeHtml(button.label)}</a></p>
<p style="font-size:12px;color:#667A7F;word-break:break-all">Se o botão não abrir, copie este endereço no navegador:<br>${escapeHtml(button.url)}</p>` : ''}
</td></tr>
<tr><td style="padding:16px 28px 28px;font-size:12px;color:#667A7F">Você recebeu este e-mail pela Proud (${escapeHtml(site.replace(/^https?:\/\//, ''))}). Se não foi você, ignore esta mensagem.</td></tr>
</table></td></tr></table></body></html>`
}

export function resetPasswordEmail(name: string, url: string) {
  return {
    subject: 'Redefinir sua senha da Proud',
    html: layout('Redefinir senha', `Olá, ${escapeHtml(name.split(' ')[0] || 'tudo bem')}. Recebemos um pedido para criar uma nova senha na sua conta. O link vale por 1 hora e só funciona uma vez. Se não foi você, ignore este e-mail: sua senha continua a mesma.`, { label: 'Criar nova senha', url }),
    text: `Olá, ${name}.\n\nPara criar uma nova senha (o link vale por 1 hora):\n${url}\n\nSe não foi você, ignore esta mensagem: sua senha continua a mesma.`,
  }
}

// Avisa a equipe da Proud (ADMIN_NOTIFY_EMAIL, separados por vírgula). Nunca derruba a requisição.
export async function notifyAdmins(subject: string, lines: [string, string][]) {
  const recipients = (process.env.ADMIN_NOTIFY_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!recipients.length) return
  const rows = lines.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#667A7F;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join('')
  try {
    await sendEmail({
      to: recipients,
      subject,
      html: layout(subject, `<table role="presentation" style="font-size:14px">${rows}</table>`, { label: 'Abrir área do cliente', url: `${siteUrl()}/area-cliente` }),
      text: `${subject}\n\n${lines.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${siteUrl()}/area-cliente`,
    })
  } catch (error) {
    console.error('[notifyAdmins] falhou:', error instanceof Error ? error.message : error)
  }
}
