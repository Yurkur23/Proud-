# Como publicar na Vercel (passo a passo)

Tudo já está configurado. Você precisa de 3 contas: **GitHub**, **Vercel** (plano **Pro** — o gratuito não permite uso
comercial) e, opcionalmente, **Resend** (e-mail). As tabelas do banco e o administrador são criados sozinhos no deploy.

## 1) Subir o projeto para o GitHub
1. Crie um repositório **privado** no GitHub (ex.: `pround-site`).
2. Extraia o zip e envie o conteúdo da pasta `pround-site` para esse repositório
   (GitHub > "uploading an existing file", ou `git init && git add . && git commit -m "site" && git push`).
   Os arquivos de segredo (`.env*`, `variaveis-vercel*`) são ignorados pelo `.gitignore`.

## 2) Importar na Vercel
1. Vercel > **Add New > Project** > escolha o repositório > **não clique em Deploy ainda**.

## 3) Criar o banco (Neon)
1. No projeto da Vercel: **Storage > Marketplace > Neon > Create** e conecte ao projeto.
   Isso cria `DATABASE_URL` sozinho.

## 4) Colar as variáveis
1. **Settings > Environment Variables**.
2. Abra o arquivo **`variaveis-vercel.env.txt`** (vem separado do zip), copie **todo** o conteúdo e cole no campo **Key**.
   A Vercel separa as linhas sozinha. Marque *Production* e *Preview* e salve.
3. *(Se tiver domínio próprio)* adicione `NEXT_PUBLIC_SITE_URL` = `https://www.seudominio.com.br`.
4. *(Recomendado)* e-mail: crie a conta no Resend, verifique seu domínio e adicione `RESEND_API_KEY` e
   `EMAIL_FROM` (ex.: `Proud <contato@seudominio.com.br>`). Adicione também `ADMIN_NOTIFY_EMAIL` com o **seu e-mail real**
   para receber o aviso de cada novo briefing e chamado.

## 5) Deploy
1. Clique em **Deploy**. No log do build procure:
   - `Banco: 2 migration(s) aplicada(s).`
   - `Administrador admin@pround.invalid: criado (senha definida).`
2. Abra o site, vá em **/entrar** e entre com o e-mail e a senha do arquivo `variaveis-vercel.env.txt`.

## 6) Teste rápido no site publicado
Cadastre uma conta de teste (entra direto) → abra um chamado → entre como admin e resolva → envie um briefing em
`/projeto` → entre como admin e confira o projeto na aba **Projetos** (com a mensagem e o contato).

## Trocar a senha do administrador
Na Vercel: mude `ADMIN_PASSWORD`, crie `ADMIN_RESET_PASSWORD` = `true`, faça **Redeploy** e depois **apague** a
`ADMIN_RESET_PASSWORD`. (O e-mail `admin@pround.invalid` é só um nome de login: ninguém consegue receber e-mail nele, por
isso "Esqueci minha senha" não se aplica ao admin. Se preferir um e-mail real, troque `ADMIN_EMAIL` **antes do primeiro
deploy**; trocar depois cria um segundo administrador.)

## Antes de divulgar para clientes
Mande revisar Termos, Privacidade, Cookies e Reembolso e inclua razão social, CNPJ e contato do encarregado de dados.
