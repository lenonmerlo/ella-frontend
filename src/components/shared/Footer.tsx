export function Footer() {
  const showTestingNotice =
    Boolean(import.meta.env.DEV) ||
    String(import.meta.env.VITE_PUBLIC_TESTING_NOTICE || "").toLowerCase() === "true";

  return (
    <footer className="border-ella-muted text-ella-subtile bg-ella-card/70 border-t">
      <div className="mx-auto max-w-5xl px-6 py-6 text-center text-xs leading-relaxed">
        <div>Desenvolvido por Lenon Merlo.</div>
        <div>
          Dúvidas e sugestões: <span className="font-medium">contatoellafinancas@gmail.com</span>
        </div>
        {showTestingNotice ? (
          <div className="mt-2">Você está participando da etapa de testes.</div>
        ) : null}
      </div>
    </footer>
  );
}
