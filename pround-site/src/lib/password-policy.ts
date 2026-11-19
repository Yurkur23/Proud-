// Regras de senha (usadas no navegador para avisar e no servidor para valer de verdade).
export const PASSWORD_RULE_MESSAGE =
  'Senha fraca. Use 10+ caracteres com letras maiúsculas, minúsculas e números.'

export function isStrongPassword(password: unknown): password is string {
  return (
    typeof password === 'string' &&
    password.length >= 10 &&
    password.length <= 128 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  )
}
