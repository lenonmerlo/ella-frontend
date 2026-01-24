export default function CookiePolicy() {
  const updatedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="mx-auto max-w-4xl bg-white px-6 py-12 text-gray-800">
      <h1 className="mb-8 text-4xl font-bold">Política de Cookies</h1>

      <p className="mb-6 leading-relaxed">
        Esta Política de Cookies explica o que são cookies, por que a ELLA Finance os utiliza e como
        você pode gerenciá-los. Ao usar a plataforma, você concorda com o uso de cookies conforme
        descrito aqui, respeitadas as opções de controle disponíveis.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">1. O que são cookies</h2>
      <p className="mb-6 leading-relaxed">
        Cookies são pequenos arquivos de texto armazenados no seu navegador/dispositivo quando você
        visita um site ou utiliza um aplicativo web. Eles ajudam a lembrar preferências, manter
        sessões ativas e melhorar a experiência.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">2. Por que usamos cookies</h2>
      <p className="mb-4 leading-relaxed">
        A ELLA Finance usa cookies e tecnologias similares para:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>Autenticar e manter sua sessão ativa com segurança</li>
        <li>Garantir o funcionamento de recursos essenciais</li>
        <li>Guardar preferências do usuário (quando aplicável)</li>
        <li>Mensurar e melhorar a experiência (analytics, se aplicável)</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">3. Tipos de cookies utilizados</h2>
      <p className="mb-4 leading-relaxed">
        Dependendo da configuração e do seu uso da plataforma, podemos utilizar:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>
          <span className="font-semibold">JWT Token (autenticação):</span> usado para autenticação e
          manutenção de sessão (pode ser armazenado como cookie ou em storage, conforme
          implementação).
        </li>
        <li>
          <span className="font-semibold">Session ID (sessão):</span> identifica sua sessão para
          manter o estado do login e proteger ações sensíveis.
        </li>
        <li>
          <span className="font-semibold">Preferências:</span> idioma, tema e preferências do
          usuário (quando aplicável).
        </li>
        <li>
          <span className="font-semibold">Analytics (se aplicável):</span> entendimento de uso e
          comportamento para melhorias de performance e experiência.
        </li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">4. Cookies de terceiros</h2>
      <p className="mb-6 leading-relaxed">
        A ELLA Finance pode utilizar serviços de terceiros para infraestrutura e comunicação (por
        exemplo, e-mail transacional e hospedagem). Caso sejam utilizados cookies de terceiros (ex.:
        ferramentas de análise), isso ocorrerá para fins legítimos e respeitando a legislação
        aplicável.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">5. Como gerenciar ou deletar cookies</h2>
      <p className="mb-4 leading-relaxed">
        Você pode gerenciar cookies nas configurações do seu navegador. Abaixo um guia geral:
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold">Chrome</h3>
      <ul className="mb-6 list-decimal space-y-2 pl-6">
        <li>Acesse Configurações → Privacidade e segurança → Cookies e outros dados do site.</li>
        <li>Escolha bloquear cookies de terceiros ou gerenciar exceções por site.</li>
        <li>
          Para limpar: Privacidade e segurança → Limpar dados de navegação → Cookies e outros dados.
        </li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold">Firefox</h3>
      <ul className="mb-6 list-decimal space-y-2 pl-6">
        <li>Acesse Configurações → Privacidade e Segurança → Cookies e dados de sites.</li>
        <li>Defina proteção aprimorada contra rastreamento e regras de bloqueio.</li>
        <li>Para limpar: Cookies e dados de sites → Limpar dados.</li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold">Safari</h3>
      <ul className="mb-6 list-decimal space-y-2 pl-6">
        <li>Acesse Preferências/Ajustes → Privacidade.</li>
        <li>Ative “Impedir rastreamento entre sites” e gerencie cookies.</li>
        <li>Para limpar: Gerenciar dados de sites → Remover todos.</li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold">Edge</h3>
      <ul className="mb-6 list-decimal space-y-2 pl-6">
        <li>Acesse Configurações → Cookies e permissões do site → Cookies e dados armazenados.</li>
        <li>Gerencie bloqueios (incluindo cookies de terceiros) e exceções.</li>
        <li>Para limpar: Privacidade, pesquisa e serviços → Limpar dados de navegação.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">6. Impacto de desabilitar cookies</h2>
      <p className="mb-6 leading-relaxed">
        Se você desabilitar cookies, alguns recursos podem não funcionar corretamente. Por exemplo,
        você pode precisar fazer login novamente com mais frequência e certas preferências podem não
        ser lembradas.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">
        7. Conformidade com LGPD e consentimento
      </h2>
      <p className="mb-6 leading-relaxed">
        Tratamos dados pessoais e preferências de cookies conforme a LGPD. Quando aplicável, podemos
        solicitar seu consentimento para cookies não essenciais. Você pode revogar consentimentos a
        qualquer momento, ajustando suas preferências e configurações do navegador.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">8. Contato</h2>
      <p className="mb-6 leading-relaxed">
        Para dúvidas sobre cookies e privacidade, entre em contato:
        <span className="font-semibold"> contatoellafinancas@gmail.com</span>.
      </p>

      <div className="mt-10 border-t pt-6 text-sm text-gray-600">
        Data de atualização: {updatedAt}
      </div>
    </div>
  );
}
