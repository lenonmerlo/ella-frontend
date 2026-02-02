import { Logo } from "../components/Logo";

export function PublicHeader() {
  return (
    <header className="border-ella-muted w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Logo variant="horizontal" size="small" />

        <span className="text-ella-subtile text-xs">Sua parceira financeira inteligente</span>
      </div>
    </header>
  );
}
