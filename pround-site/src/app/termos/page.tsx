import { LegalPage } from '../components/LegalPage'

export const metadata = {
  title: 'Termos de Uso | Pround',
  description: 'Condições de uso do site e dos serviços digitais da Pround.',
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      summary="Estes termos estabelecem as regras para uso do site, da área do cliente e dos serviços digitais oferecidos pela Pround."
      sections={[
        {
          title: 'Aceite e escopo',
          paragraphs: [
            'Ao utilizar o site ou criar uma conta, o visitante declara ter lido estes termos e a Política de Privacidade. A área do cliente exige conta com e-mail confirmado e senha pessoal.',
          ],
        },
        {
          title: 'Uso adequado',
          items: [
            'Fornecer informações verdadeiras quando iniciar uma solicitação comercial.',
            'Não tentar comprometer a segurança, disponibilidade ou integridade do site.',
            'Não utilizar conteúdos ou marcas da Pround. sem autorização ou hipótese legal.',
            'Não inserir dados sensíveis ou informações de terceiros, sem autorização, nos campos de chamados e briefings.',
          ],
        },
        {
          title: 'Contas e acesso',
          paragraphs: [
            'Cada conta é pessoal. Você é responsável por manter a senha em sigilo e por avisar a Pround imediatamente em caso de uso não autorizado.',
            'Em uma versão de produção, o titular será responsável por proteger suas credenciais e informar acessos suspeitos. A Pround. deverá adotar autenticação adequada e regras para suspensão, encerramento e recuperação de conta.',
          ],
        },
        {
          title: 'Propostas e serviços',
          paragraphs: [
            'Escopo, prazo, preço, entregáveis, suporte, hospedagem e propriedade de ativos serão definidos em proposta ou contrato específico. Conteúdos e estimativas exibidos no site não constituem oferta irrevogável.',
            'Alterações de escopo poderão exigir revisão de prazo e valor, sempre mediante comunicação e aprovação antes da execução.',
          ],
        },
        {
          title: 'Propriedade intelectual',
          paragraphs: [
            'A marca, o design e os conteúdos institucionais da Pround. são protegidos pela legislação aplicável. A titularidade e as licenças dos materiais produzidos para clientes seguirão o contrato do projeto e poderão depender do pagamento integral.',
          ],
        },
        {
          title: 'Disponibilidade e responsabilidade',
          paragraphs: [
            'Buscamos manter os canais disponíveis, mas poderá haver interrupções por manutenção, falhas de terceiros ou eventos fora de controle razoável.',
            'Cada parte responde pelos danos diretos que comprovadamente causar, conforme a legislação e os limites definidos no contrato, sem afastar direitos inderrogáveis do consumidor.',
          ],
        },
        {
          title: 'Lei aplicável e contato',
          paragraphs: [
            'Aplicam-se as leis da República Federativa do Brasil. Eventuais conflitos deverão ser resolvidos preferencialmente por diálogo e, quando cabível, no foro legalmente competente, preservados os direitos do consumidor.',
          ],
        },
      ]}
    />
  )
}
