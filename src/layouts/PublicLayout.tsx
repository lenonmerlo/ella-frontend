import { Logo } from "../components/Logo";
import { useTheme } from "../contexts/ThemeContext";

export function PublicHeader() {
  const { theme } = useTheme();

  return (
    <header className="border-ella-muted bg-ella-card w-full border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Logo variant="horizontal" size="small" inverted={theme === "dark"} />

        <span className="text-ella-subtile text-xs">Sua parceira financeira inteligente</span>
      </div>
    </header>
  );
}
