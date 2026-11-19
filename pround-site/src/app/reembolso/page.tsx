import { LegalPage } from '../components/LegalPage'

export const metadata = {
  title: 'Política de Reembolso | Proud',
  description: 'Regras informativas para cancelamento e reembolso de serviços da Proud.',
}

export default function RefundPage() {
  return (
    <LegalPage
      title="Política de Reembolso"
      summary="Esta política apresenta critérios gerais para cancelamentos, entregas parciais e reembolsos. A proposta ou contrato de cada projeto prevalecerá nos pontos específicos, respeitada a legislação."
      sections={[
        {
          title: 'Serviços personalizados',
          paragraphs: [
            'Projetos de estratégia, design e desenvolvimento são personalizados e envolvem reserva de agenda e trabalho intelectual. Por isso, condições de pagamento, marcos de aprovação e cancelamento serão definidas na proposta aceita.',
          ],
        },
        {
          title: 'Cancelamento antes do início',
          paragraphs: [
            'Quando o cancelamento for solicitado antes do início efetivo e não houver custos assumidos, os valores pagos poderão ser restituídos, descontadas tarifas não recuperáveis expressamente demonstradas. Prazos e meios seguirão o contrato e o método de pagamento.',
          ],
        },
        {
          title: 'Cancelamento após o início',
          paragraphs: [
            'Após o início, a Proud poderá reter o valor proporcional às etapas concluídas, horas trabalhadas, licenças adquiridas e custos de terceiros. O cliente receberá uma memória objetiva do cálculo e os materiais já pagos e liberados contratualmente.',
          ],
        },
        {
          title: 'Direito de arrependimento',
          paragraphs: [
            'Quando aplicável uma relação de consumo contratada fora do estabelecimento, será respeitado o direito de arrependimento previsto no Código de Defesa do Consumidor. A análise considerará o prazo legal e eventual início antecipado do serviço solicitado pelo cliente, sem limitar direitos obrigatórios.',
          ],
        },
        {
          title: 'Falha na entrega',
          paragraphs: [
            'Se a Proud não puder entregar o serviço por motivo sob sua responsabilidade, buscará corrigir a falha, propor alternativa equivalente ou reembolsar a parcela correspondente ao que não foi entregue, conforme o caso.',
          ],
        },
        {
          title: 'Hospedagem, licenças e terceiros',
          paragraphs: [
            'Domínios, hospedagem, assinaturas, licenças e outros serviços de terceiros seguem também as políticas de seus fornecedores. Valores já repassados e não recuperáveis poderão não ser reembolsáveis, desde que informados previamente.',
          ],
        },
        {
          title: 'Como solicitar',
          paragraphs: [
            'A solicitação deverá identificar o projeto, o motivo e os dados necessários para conferência. A Proud responderá com a análise, o valor elegível e o prazo estimado.',
          ],
        },
      ]}
    />
  )
}
