import { Logo } from "../components/Logo";

export function PublicHeader() {
  return (
    <header className="w-full border-b border-ella-muted bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Logo variant="horizontal" size="small" />

        <span className="text-xs text-ella-subtile">
          Sua parceira financeira inteligente
        </span>
      </div>
    </header>
  );
}
