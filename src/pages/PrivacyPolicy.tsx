export default function PrivacyPolicy() {
  const updatedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="bg-ella-card text-ella-text mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">Política de Privacidade</h1>

      <p className="mb-6 leading-relaxed">
        A ELLA Finance valoriza a sua privacidade e está comprometida com a proteção dos seus dados
        pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e
        protegemos informações quando você utiliza o nosso sistema de gestão financeira pessoal.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">1. Dados que coletamos</h2>
      <p className="mb-4 leading-relaxed">
        Para oferecer as funcionalidades da ELLA Finance, podemos coletar as seguintes categorias de
        dados, conforme aplicável:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>
          <span className="font-semibold">Dados de cadastro:</span> nome, e-mail, senha (armazenada
          de forma segura), e dados necessários para criação e gerenciamento da conta.
        </li>
        <li>
          <span className="font-semibold">Dados pessoais sensíveis/identificadores:</span> CPF
          (quando necessário para funcionalidades específicas e validações).
        </li>
        <li>
          <span className="font-semibold">Dados financeiros:</span> dados bancários informados pelo
          usuário, cartões, faturas, transações, categorias, receitas, despesas e saldos.
        </li>
        <li>
          <span className="font-semibold">Dados de uso:</span> informações sobre interações no app,
          páginas acessadas, ações realizadas e preferências.
        </li>
        <li>
          <span className="font-semibold">Dados técnicos:</span> endereço IP, identificadores do
          dispositivo/navegador, logs de autenticação e eventos de segurança.
        </li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">2. Finalidade da coleta e uso</h2>
      <p className="mb-4 leading-relaxed">
        Utilizamos seus dados para operar, manter e melhorar a ELLA Finance, incluindo:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>
          <span className="font-semibold">Autenticação e segurança:</span> criação de conta, login,
          prevenção de fraudes, detecção de acessos não autorizados e proteção do ambiente.
        </li>
        <li>
          <span className="font-semibold">Prestação do serviço:</span> processamento de uploads de
          faturas, organização de transações, gestão de orçamento, investimentos e metas.
        </li>
        <li>
          <span className="font-semibold">Análise financeira e cálculos:</span> geração de insights,
          relatórios e cálculo do score/indicadores da saúde financeira.
        </li>
        <li>
          <span className="font-semibold">Comunicação:</span> envio de mensagens transacionais (ex:
          confirmação de cadastro, redefinição de senha) e suporte.
        </li>
        <li>
          <span className="font-semibold">Melhoria contínua:</span> métricas de qualidade, correção
          de erros e aprimoramento da experiência.
        </li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">3. Segurança e proteção dos dados</h2>
      <p className="mb-6 leading-relaxed">
        Adotamos medidas técnicas e administrativas para proteger os dados, como uso de HTTPS,
        autenticação via JWT, controles de acesso e práticas de segurança para reduzir riscos de
        acesso não autorizado, alteração indevida, divulgação ou destruição. Dados sensíveis podem
        receber camadas adicionais de proteção e criptografia quando aplicável.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">4. Direitos do usuário (LGPD)</h2>
      <p className="mb-4 leading-relaxed">
        Nos termos da Lei Geral de Proteção de Dados (LGPD), você pode solicitar:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>
          <span className="font-semibold">Acesso</span> aos seus dados pessoais.
        </li>
        <li>
          <span className="font-semibold">Correção</span> de dados incompletos, inexatos ou
          desatualizados.
        </li>
        <li>
          <span className="font-semibold">Exclusão</span> de dados desnecessários, excessivos ou
          tratados em desconformidade, quando aplicável.
        </li>
        <li>
          <span className="font-semibold">Portabilidade</span> dos dados, observadas as regras da
          autoridade competente.
        </li>
        <li>
          <span className="font-semibold">Revogação do consentimento</span>, quando o tratamento
          depender de consentimento.
        </li>
      </ul>
      <p className="mb-6 leading-relaxed">
        Para exercer seus direitos, entre em contato pelos canais indicados nesta política.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">5. Compartilhamento de dados</h2>
      <p className="mb-4 leading-relaxed">
        Podemos compartilhar dados apenas quando necessário para:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>
          Operação do serviço com provedores de infraestrutura, armazenamento e ferramentas de
          suporte (ex.: hospedagem, banco de dados, e-mail transacional).
        </li>
        <li>
          Cumprimento de obrigações legais/regulatórias, ordens judiciais ou solicitações de
          autoridades competentes.
        </li>
        <li>Proteção de direitos, prevenção à fraude e segurança da plataforma e dos usuários.</li>
      </ul>
      <p className="mb-6 leading-relaxed">Não vendemos seus dados pessoais.</p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">6. Retenção de dados</h2>
      <p className="mb-6 leading-relaxed">
        Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas nesta
        política, atender obrigações legais/regulatórias e resguardar direitos. Em geral, dados de
        conta e uso podem ser mantidos enquanto a conta estiver ativa e por período adicional
        razoável para fins de auditoria, segurança e conformidade.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">
        7. Cookies e tecnologias de rastreamento
      </h2>
      <p className="mb-6 leading-relaxed">
        Utilizamos cookies e tecnologias similares para autenticação, manutenção de sessão,
        segurança e preferências. Para mais detalhes, consulte a Política de Cookies.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">8. Contato</h2>
      <p className="mb-6 leading-relaxed">
        Para dúvidas, solicitações ou reclamações relacionadas à privacidade e ao tratamento de
        dados pessoais, entre em contato pelo e-mail:{" "}
        <span className="font-semibold">contatoellafinancas@gmail.com</span>.
      </p>

      <div className="mt-10 border-t pt-6 text-sm text-gray-600">
        Data de atualização: {updatedAt}
      </div>
    </div>
  );
}
