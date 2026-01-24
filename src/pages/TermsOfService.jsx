export default function TermsOfService() {
  const updatedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="mx-auto max-w-4xl bg-white px-6 py-12 text-gray-800">
      <h1 className="mb-8 text-4xl font-bold">Termos de Serviço</h1>

      <p className="mb-6 leading-relaxed">
        Estes Termos de Serviço regulam o uso da ELLA Finance, um sistema de gestão financeira
        pessoal desenvolvido por Lenon Merlo. Ao acessar ou utilizar a plataforma, você declara que
        leu, entendeu e concorda com estes termos.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">1. Aceitação dos termos</h2>
      <p className="mb-6 leading-relaxed">
        Ao criar uma conta, acessar, navegar ou utilizar qualquer funcionalidade da ELLA Finance,
        você concorda com estes Termos e com as políticas aplicáveis (incluindo Política de
        Privacidade e Política de Cookies).
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">2. Descrição do serviço</h2>
      <p className="mb-4 leading-relaxed">
        A ELLA Finance oferece ferramentas para organização e acompanhamento financeiro, incluindo,
        por exemplo:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>Upload e processamento de faturas</li>
        <li>Classificação e organização de transações</li>
        <li>Cálculo de score/indicadores de saúde financeira</li>
        <li>Gestão de orçamento</li>
        <li>Rastreamento de investimentos</li>
        <li>Metas financeiras</li>
      </ul>
      <p className="mb-6 leading-relaxed">
        A plataforma utiliza tecnologias como React (frontend), Spring Boot (backend) e PostgreSQL
        (armazenamento). O acesso pode depender de conectividade e disponibilidade dos serviços.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">3. Elegibilidade e registro</h2>
      <p className="mb-6 leading-relaxed">
        Para utilizar a ELLA Finance, você deve fornecer informações verdadeiras, completas e
        atualizadas no cadastro, manter a confidencialidade de suas credenciais e ser responsável
        por todas as atividades realizadas na sua conta.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">
        4. Direitos e responsabilidades do usuário
      </h2>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>Utilizar o serviço de forma lícita e em conformidade com estes Termos.</li>
        <li>Não compartilhar suas credenciais com terceiros.</li>
        <li>
          Garantir que arquivos enviados (ex.: faturas) pertencem a você e não violam direitos de
          terceiros.
        </li>
        <li>Manter seus dados e preferências atualizados quando necessário.</li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">5. Proibições</h2>
      <p className="mb-4 leading-relaxed">É expressamente proibido:</p>
      <ul className="mb-6 list-disc space-y-2 pl-6">
        <li>Usar o serviço para atividades ilegais ou que violem a legislação brasileira.</li>
        <li>Cometer fraude, roubo de identidade ou qualquer forma de falsidade.</li>
        <li>
          Realizar acesso não autorizado, tentativa de invasão, exploração de vulnerabilidades ou
          engenharia reversa.
        </li>
        <li>Enviar spam, malware, conteúdo malicioso ou arquivos que comprometam a segurança.</li>
        <li>
          Interferir no funcionamento da plataforma, sobrecarregar o sistema ou contornar medidas de
          segurança.
        </li>
      </ul>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">6. Propriedade intelectual</h2>
      <p className="mb-6 leading-relaxed">
        A ELLA Finance e seus componentes (marca, layout, textos, código, design, logotipos e demais
        elementos) são de propriedade de Lenon Merlo ou licenciados, sendo protegidos por leis de
        propriedade intelectual. Você recebe uma licença limitada, não exclusiva e revogável para
        uso pessoal e não comercial, conforme estes Termos.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">7. Limitação de responsabilidade</h2>
      <p className="mb-6 leading-relaxed">
        A ELLA Finance busca oferecer informações e recursos para organização financeira, mas não
        fornece consultoria financeira, contábil ou jurídica. Você é o único responsável por
        decisões tomadas com base nas informações da plataforma. Na máxima extensão permitida pela
        lei, a ELLA Finance não se responsabiliza por perdas indiretas, lucros cessantes, danos
        incidentais ou quaisquer prejuízos decorrentes do uso ou incapacidade de uso do serviço.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">8. Exclusão de garantias</h2>
      <p className="mb-6 leading-relaxed">
        O serviço é fornecido “como está” e “conforme disponível”, sem garantias de qualquer
        natureza, expressas ou implícitas, incluindo garantias de adequação a um propósito
        específico, ausência de erros ou disponibilidade ininterrupta.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">9. Indenização</h2>
      <p className="mb-6 leading-relaxed">
        Você concorda em indenizar e manter indene a ELLA Finance (e seu desenvolvedor) por
        quaisquer reivindicações, danos, responsabilidades, custos e despesas decorrentes do seu uso
        indevido da plataforma, violação destes Termos ou violação de direitos de terceiros.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">10. Rescisão de conta</h2>
      <p className="mb-6 leading-relaxed">
        Podemos suspender ou encerrar seu acesso à conta, a qualquer momento, caso identifiquemos
        violação destes Termos, riscos de segurança, fraude ou uso indevido. Você também pode
        solicitar o encerramento da conta conforme as regras e procedimentos disponíveis.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">11. Alterações nos termos</h2>
      <p className="mb-6 leading-relaxed">
        Podemos atualizar estes Termos periodicamente. Quando houver mudanças relevantes, poderemos
        comunicar por meios razoáveis. O uso contínuo da plataforma após a atualização significa
        concordância com a versão vigente.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">
        12. Lei aplicável e resolução de disputas
      </h2>
      <p className="mb-4 leading-relaxed">
        Estes Termos são regidos pelas leis da República Federativa do Brasil. As partes buscarão
        resolver eventuais controvérsias de forma amigável. Persistindo o conflito, fica eleito o
        foro competente conforme a legislação aplicável.
      </p>

      <h2 className="mt-10 mb-4 text-2xl font-semibold">13. Contato</h2>
      <p className="mb-6 leading-relaxed">
        Para dúvidas legais ou solicitações relacionadas a estes Termos, entre em contato:
        <span className="font-semibold"> contatoellafinancas@gmail.com</span>.
      </p>

      <div className="mt-10 border-t pt-6 text-sm text-gray-600">
        Data de atualização: {updatedAt}
      </div>
    </div>
  );
}
