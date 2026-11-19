import { LegalPage } from '../components/LegalPage'

export const metadata = {
  title: 'Política de Consentimento de Cookies | Pround',
  description: 'Entenda como a Pround. usa armazenamento local e cookies.',
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Consentimento de Cookies"
      summary="Esta política descreve o uso de cookies e tecnologias semelhantes, as finalidades de cada categoria e as opções de controle disponíveis ao visitante."
      sections={[
        {
          title: 'O que são cookies',
          paragraphs: [
            'Cookies são pequenos arquivos gravados no dispositivo durante a navegação. O armazenamento local do navegador exerce função semelhante ao preservar escolhas, como idioma e consentimento de cookies.',
          ],
        },
        {
          title: 'Categorias utilizadas',
          items: [
            'Essenciais: preservam escolhas de idioma e consentimento e mantêm você conectado à área do cliente (cookie de sessão). Não dependem de autorização quando estritamente necessários.',
            'Análise: ajudariam a entender o uso do site de forma agregada. Nenhuma ferramenta de análise está ativa no momento e essa categoria só poderá ser ativada após consentimento.',
            'Marketing: poderiam medir campanhas ou personalizar anúncios. Não são usados atualmente.',
          ],
        },
        {
          title: 'Consentimento',
          paragraphs: [
            'Cookies não essenciais devem permanecer desativados até uma ação afirmativa do visitante. Recusar cookies não essenciais não impedirá o acesso ao conteúdo principal. A ausência de interação não será interpretada como consentimento.',
          ],
        },
        {
          title: 'Como alterar sua escolha',
          paragraphs: [
            'A preferência é registrada no navegador e pode ser alterada a qualquer momento pelo link “Preferências de cookies”, no rodapé do site.',
          ],
        },
        {
          title: 'Cookies de terceiros e prazos',
          paragraphs: [
            'Se serviços de terceiros forem adicionados no futuro, esta política deverá identificar fornecedores, finalidades e prazos. As preferências serão mantidas apenas pelo período necessário e renovadas quando houver mudança material.',
          ],
        },
        {
          title: 'Privacidade e direitos',
          paragraphs: [
            'Quando identificadores puderem ser associados a uma pessoa, seu tratamento seguirá a LGPD e a Política de Privacidade. O titular poderá solicitar informações, correção, oposição ou eliminação nos limites legais.',
          ],
        },
      ]}
    />
  )
}
