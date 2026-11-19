import { LegalPage } from '../components/LegalPage'

export const metadata = {
  title: 'Política de Privacidade | Proud',
  description: 'Como a Proud trata dados pessoais e atende aos direitos previstos na LGPD.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      summary="Esta política explica quais dados a Proud poderá tratar, para quais finalidades e como titulares podem exercer seus direitos conforme a Lei Geral de Proteção de Dados Pessoais (LGPD)."
      sections={[
        {
          title: 'Quem controla os dados',
          paragraphs: [
            'A Proud atua como controladora dos dados pessoais coletados em seus canais e serviços, definindo as finalidades e os meios de tratamento. Os dados de cadastro, briefings e chamados são armazenados em banco de dados seguro, com acesso restrito à própria conta e à equipe da Proud.',
          ],
        },
        {
          title: 'Dados que poderemos tratar',
          items: [
            'Dados de identificação e contato, como nome, e-mail e telefone.',
            'Informações de projeto fornecidas voluntariamente em briefings e chamados.',
            'Dados técnicos essenciais, preferências de idioma e consentimento de cookies.',
            'Registros contratuais, financeiros e de atendimento quando houver contratação real.',
          ],
        },
        {
          title: 'Finalidades e bases legais',
          items: [
            'Atender solicitações e executar contratos ou procedimentos preliminares solicitados pelo titular.',
            'Criar e manter contas, prestar suporte e garantir segurança com base na execução contratual e no legítimo interesse, após avaliação aplicável.',
            'Cumprir obrigações legais ou regulatórias.',
            'Enviar comunicações de marketing somente com consentimento específico, opcional e revogável.',
          ],
        },
        {
          title: 'Compartilhamento, transferências e segurança',
          paragraphs: [
            'Dados poderão ser compartilhados apenas com fornecedores necessários à hospedagem, comunicação, pagamentos e operação dos serviços, sob deveres de confidencialidade e proteção. Transferências internacionais, quando existirem, deverão observar as garantias previstas na LGPD.',
            'Adotaremos medidas técnicas e administrativas proporcionais aos riscos. Nenhum sistema é absolutamente invulnerável; incidentes relevantes serão tratados e comunicados conforme a legislação.',
          ],
        },
        {
          title: 'Retenção e exclusão',
          paragraphs: [
            'Os dados serão mantidos pelo tempo necessário às finalidades informadas, ao cumprimento de obrigações legais, ao exercício regular de direitos e aos prazos contratuais. Encerrada a necessidade, serão eliminados ou anonimizados, salvo hipótese legal de conservação.',
            'A opção “Excluir conta e dados”, na área do cliente, apaga a conta, os sites, os chamados, as notificações e os acessos associados. Briefings já enviados são mantidos sem vínculo com a conta e podem ser eliminados mediante solicitação, observadas as exceções legais.',
          ],
        },
        {
          title: 'Direitos do titular',
          items: [
            'Confirmação da existência de tratamento e acesso aos dados.',
            'Correção de dados incompletos, inexatos ou desatualizados.',
            'Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.',
            'Portabilidade, informação sobre compartilhamentos e revisão de decisões automatizadas, quando aplicável.',
            'Revogação do consentimento e eliminação dos dados tratados com essa base, respeitadas as hipóteses legais.',
            'Petição perante a Autoridade Nacional de Proteção de Dados (ANPD).',
          ],
        },
        {
          title: 'Atualizações',
          paragraphs: [
            'Esta política poderá ser atualizada para refletir mudanças legais ou operacionais. A versão e a data serão indicadas no início do documento, e alterações relevantes serão comunicadas pelos canais disponíveis.',
          ],
        },
      ]}
    />
  )
}
