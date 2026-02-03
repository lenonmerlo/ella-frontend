import { Logo } from "@/components/Logo";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function PrimaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-ella-gold text-ella-navy focus-visible:ring-offset-ella-background inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:outline-none " +
        (className ?? "")
      }
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "border-ella-muted text-ella-subtile hover:border-ella-gold hover:text-ella-navy bg-ella-card/60 focus-visible:ring-offset-ella-background inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:outline-none " +
        (className ?? "")
      }
    >
      {children}
    </button>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="ella-glass group border-ella-muted/70 bg-ella-card/80 relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-amber-500/10 via-white/0 to-slate-900/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="bg-ella-card/70 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/5">
          {icon}
        </div>
        <h3 className="text-ella-navy text-sm font-semibold">{title}</h3>
        <p className="text-ella-subtile mt-2 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 5v-5h7v5h-7Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function IconUpload({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 16V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="m8.5 9.5 3.5-3.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 18.5a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18.5"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.85"
      />
    </svg>
  );
}

function IconBrainRound({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M9 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 9.2c1.2 0 2.2 1 2.2 2.2M9 13.2c1.2 0 2.2 1 2.2 2.2M15 9.2c-1.2 0-2.2 1-2.2 2.2M15 13.2c-1.2 0-2.2 1-2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function IconTag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 4h6l8 8-6 6-8-8V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 8.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="border-ella-muted/70 text-ella-subtile bg-ella-card/70 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium shadow-sm">
      {children}
    </span>
  );
}

function MetricBadge({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "amber" | "slate";
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "amber"
        ? "text-amber-700 dark:text-amber-400"
        : "text-slate-600 dark:text-slate-300";

  return (
    <div className="bg-ella-card/65 rounded-xl p-3 ring-1 ring-black/5 dark:ring-white/10">
      <div className="text-ella-subtile text-[10px] font-medium tracking-wide uppercase">
        {label}
      </div>
      <div className="text-ella-navy mt-1 text-lg font-semibold">{value}</div>
      <div className={"mt-1 text-[10px] font-semibold " + accentClass}>{sub}</div>
    </div>
  );
}

function IconDoc({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path d="M14 3v4a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12h8M8 16h8" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
    </svg>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 16l5-6 4 3 7-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
    </svg>
  );
}

function IconTarget({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 21a9 9 0 1 1 9-9" stroke="currentColor" strokeWidth="1.6" opacity="0.8" />
      <path d="M12 17a5 5 0 1 1 5-5" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <path d="M12 13a1 1 0 1 1 1-1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2 20 6v7c0 5-3.4 9-8 9s-8-4-8-9V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path
        d="m9 12 2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBrain({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path
        d="M15 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path
        d="M9 7c1.2 0 2.2 1 2.2 2.2M9 11c1.2 0 2.2 1 2.2 2.2M15 7c-1.2 0-2.2 1-2.2 2.2M15 11c-1.2 0-2.2 1-2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: 1 | 2 | 3;
  title: string;
  description: string;
}) {
  return (
    <div className="ella-glass border-ella-muted bg-ella-card/90 relative rounded-2xl border p-6 shadow-sm">
      <div className="bg-ella-brand absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-lg">
        {number}
      </div>
      <h3 className="text-ella-navy mt-4 text-sm font-semibold">{title}</h3>
      <p className="text-ella-subtile mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const year = useMemo(() => new Date().getFullYear(), []);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="ella-gradient-bg min-h-screen">
      <div className="flex min-h-screen flex-col">
        {/* HERO */}
        <div className="px-4 pt-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between gap-4">
              <Logo variant="horizontal" size="medium" inverted={theme === "dark"} />

              <button
                type="button"
                onClick={toggleTheme}
                className="border-ella-muted bg-ella-card/60 text-ella-navy hover:bg-ella-background/60 inline-flex items-center justify-center rounded-full border p-2 shadow-sm transition-colors md:hidden"
                aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                title={theme === "dark" ? "Tema claro" : "Tema escuro"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="hidden items-center gap-6 md:flex">
                <a
                  href="#funcionalidades"
                  className="text-ella-subtile hover:text-ella-navy text-sm font-semibold transition-colors"
                >
                  Funcionalidades
                </a>
                <a
                  href="#como-funciona"
                  className="text-ella-subtile hover:text-ella-navy text-sm font-semibold transition-colors"
                >
                  Como funciona
                </a>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="border-ella-muted bg-ella-card/60 text-ella-navy hover:bg-ella-background/60 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm transition-colors"
                  aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                  title={theme === "dark" ? "Tema claro" : "Tema escuro"}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  <span className="hidden lg:inline">Tema</span>
                </button>

                <SecondaryButton onClick={() => navigate("/auth/login")}>Entrar</SecondaryButton>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="bg-ella-brand hover:bg-ella-brand/90 focus-visible:ring-offset-ella-background inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-900/30 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Criar conta
                </button>
              </div>
            </div>

            <div className="bg-ella-card/60 mt-10 grid items-center gap-6 rounded-2xl p-6 shadow-sm backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
              {/* Lado esquerdo */}
              <section className="space-y-4">
                <p className="text-ella-subtile text-sm tracking-[0.3em] uppercase">
                  Você chegou ao futuro das finanças
                </p>

                <h1 className="text-ella-navy text-3xl font-semibold md:text-4xl">
                  Organize sua vida financeira com clareza e inteligência.
                </h1>

                <p className="text-ella-subtile max-w-xl text-sm md:text-base">
                  A ELLA conecta suas faturas, extratos e metas em um só lugar — e ainda gera
                  insights inteligentes.
                </p>

                <ul className="text-ella-subtile mt-4 space-y-2 text-sm">
                  <li>• Visão unificada de contas pessoais e empresariais</li>
                  <li>• Metas guiadas pela IA com valores sugeridos</li>
                  <li>• Alertas de gastos fora do seu padrão</li>
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <PrimaryButton onClick={() => navigate("/auth/login")}>
                    Acessar sua conta
                  </PrimaryButton>
                  <a
                    href="#funcionalidades"
                    className="border-ella-muted text-ella-navy hover:border-ella-gold bg-ella-card/70 inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Saiba mais
                  </a>
                </div>
              </section>

              {/* Lado direito (tech preview) */}
              <section className="border-ella-muted/70 ella-glass bg-ella-card/85 relative overflow-hidden rounded-2xl border p-6 shadow-lg">
                <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-slate-900/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-ella-subtile text-xs font-medium">ELLA Insights</div>
                    <div className="text-ella-subtile text-[10px] font-semibold tracking-[0.3em] uppercase">
                      ao vivo
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <MetricBadge label="Score" value="82" sub="+4%" accent="emerald" />
                    <MetricBadge label="Gastos" value="R$ 2,4k" sub="-12%" accent="amber" />
                    <MetricBadge label="Metas" value="3" sub="em dia" accent="slate" />
                  </div>

                  <div className="bg-ella-card/65 mt-4 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-ella-subtile text-[10px] font-medium tracking-wide uppercase">
                        Fluxo mensal
                      </div>
                      <div className="text-ella-gold text-[10px] font-semibold">IA</div>
                    </div>
                    <div className="to-ella-card/0 relative mt-3 h-24 overflow-hidden rounded-lg bg-linear-to-br from-amber-500/12 via-slate-900/5">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,59,0.18),transparent_55%)]" />
                      <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-2 p-2">
                        {[34, 48, 28, 62, 54, 72, 46, 80, 58, 66, 44, 76].map((h, idx) => (
                          <div
                            key={idx}
                            className="bg-ella-navy/10 w-full rounded-md"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 ring-1 ring-black/5" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["OCR inteligente", "Categorização", "Alertas", "Insights", "Metas"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="border-ella-muted/60 text-ella-subtile bg-ella-card/55 rounded-full border px-3 py-1 text-[11px]"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* APRESENTAÇÃO */}
        <section className="bg-ella-card/70 py-14">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-center text-xs font-semibold tracking-[0.3em] uppercase">
              Apresentação
            </p>
            <h2 className="text-ella-navy mt-3 text-center text-3xl font-semibold">
              Você chegou ao <span className="text-ella-gold">futuro das finanças</span>
            </h2>
            <p className="text-ella-subtile mx-auto mt-3 max-w-2xl text-center text-sm">
              A ELLA conecta suas finanças, estatísticas e metas em um só lugar — e ainda guia
              inteligentemente.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Visão unificada",
                  description: "Contas pessoais e empresariais em um único dashboard inteligente",
                },
                {
                  title: "IA inteligente",
                  description: "Melhores guias pela IA e valores sugeridos baseados no seu perfil",
                },
                {
                  title: "Alertas personalizados",
                  description: "Ações de gestão fora do seu padrão, identificadas automaticamente",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="bg-ella-brand mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
                    ✓
                  </div>
                  <div>
                    <div className="text-ella-navy text-sm font-semibold">{item.title}</div>
                    <div className="text-ella-subtile mt-1 text-sm">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section id="funcionalidades" className="py-14">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-center text-xs font-semibold tracking-[0.3em] uppercase">
              O que vamos aprender
            </p>
            <h2 className="text-ella-navy mt-3 text-center text-3xl font-semibold">
              Funcionalidades Principais
            </h2>
            <p className="text-ella-subtile mx-auto mt-3 max-w-2xl text-center text-sm">
              Todas as ferramentas que você precisa para ter controle total das suas finanças.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Dashboard & Visão Geral"
                description="Navegação inicial e principais indicadores financeiros em tempo real."
                icon={<IconGrid className="text-ella-navy" />}
              />
              <FeatureCard
                title="Gestão de Faturas"
                description="Upload, processamento e categorização automática com OCR inteligente."
                icon={<IconDoc className="text-ella-navy" />}
              />
              <FeatureCard
                title="Score ELLA"
                description="Entendendo os 5 pilares da sua saúde financeira com análise profunda."
                icon={<IconSpark className="text-ella-navy" />}
              />
              <FeatureCard
                title="Orçamento Inteligente"
                description="Planejamento personalizado com a regra 50/30/20 e sugestões de IA."
                icon={<IconTarget className="text-ella-navy" />}
              />
              <FeatureCard
                title="Metas e Investimentos"
                description="Definição de objetivos e acompanhamento patrimonial detalhado."
                icon={<IconShield className="text-ella-navy" />}
              />
              <FeatureCard
                title="Insights & IA"
                description="Alertas inteligentes e recomendações personalizadas baseadas em dados."
                icon={<IconBrain className="text-ella-navy" />}
              />
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA (ref print 2) */}
        <section id="como-funciona" className="bg-ella-card/70 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Faturas
            </p>
            <h2 className="text-ella-navy mt-2 text-3xl font-semibold">
              Gerenciamento Inteligente
            </h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              Transforme PDFs complexos em dados claros e organizados em segundos.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "1.",
                  title: "Upload da Fatura",
                  description:
                    "Basta arrastar e soltar o arquivo PDF da sua fatura. O sistema aceita múltiplos arquivos de uma vez.",
                  icon: <IconUpload className="text-ella-navy" />,
                },
                {
                  n: "2.",
                  title: "Extração via IA",
                  description:
                    "Nossa tecnologia lê cada linha, identificando datas, estabelecimentos e valores com precisão.",
                  icon: <IconBrainRound className="text-ella-navy" />,
                },
                {
                  n: "3.",
                  title: "Categorização",
                  description:
                    "Seus gastos são automaticamente classificados em Alimentação, Transporte, Lazer e muito mais.",
                  icon: <IconTag className="text-ella-navy" />,
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="ella-glass border-ella-muted/70 bg-ella-card/85 rounded-2xl border p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="bg-ella-card/75 mx-auto flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10">
                    {s.icon}
                  </div>
                  <div className="text-ella-navy mt-6 text-lg font-semibold">
                    {s.n} {s.title}
                  </div>
                  <div className="text-ella-subtile mt-3 text-sm leading-relaxed">
                    {s.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-ella-muted/70 bg-ella-card/60 mt-10 rounded-2xl border border-dashed p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-ella-navy inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="bg-ella-navy/10 inline-flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-ella-navy text-xs font-bold">🏦</span>
                  </span>
                  Bancos Suportados
                </div>
                <span className="text-ella-subtile bg-ella-background/60 rounded-md px-3 py-1 text-xs">
                  Atualizado Jan/{String(year).slice(-2)}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Pill>Nubank</Pill>
                <Pill>Itaú</Pill>
                <Pill>Bradesco</Pill>
                <Pill>Santander</Pill>
                <Pill>C6 Bank</Pill>
                <Pill>Sicredi</Pill>
                <Pill>Banco do Brasil</Pill>
              </div>
            </div>
          </div>
        </section>

        {/* SAÚDE FINANCEIRA (ref print 3) */}
        <section id="saude-financeira" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Saúde Financeira
            </p>
            <h2 className="text-ella-navy mt-2 text-3xl font-semibold">Entendendo o Score ELLA</h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              Uma métrica unificada para medir seu progresso e hábitos financeiros.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="ella-glass border-ella-muted/70 bg-ella-card/80 rounded-2xl border p-6 shadow-sm">
                <div className="text-ella-subtile text-xs font-semibold tracking-wide">
                  Score ELLA
                </div>
                <div className="text-ella-navy mt-2 text-4xl font-semibold">72/100</div>
                <div className="text-ella-subtile mt-2 text-sm">
                  Baseado nas suas faturas e gastos recentes. Atualizado em{" "}
                  {new Date().toLocaleDateString("pt-BR")}.
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-ella-card/70 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="text-ella-subtile text-xs">Utilização</div>
                    <div className="text-ella-navy mt-1 text-sm font-semibold">100</div>
                  </div>
                  <div className="bg-ella-card/70 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="text-ella-subtile text-xs">Pagamento</div>
                    <div className="text-ella-navy mt-1 text-sm font-semibold">100</div>
                  </div>
                  <div className="bg-ella-card/70 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="text-ella-subtile text-xs">Diversidade</div>
                    <div className="text-ella-navy mt-1 text-sm font-semibold">20</div>
                  </div>
                  <div className="bg-ella-card/70 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10">
                    <div className="text-ella-subtile text-xs">Consistência</div>
                    <div className="text-ella-navy mt-1 text-sm font-semibold">100</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-ella-navy text-lg font-semibold">Como é calculado?</div>
                <div className="mt-5 space-y-3">
                  {[
                    {
                      title: "Utilização de Crédito",
                      sub: "Quanto do seu limite você usa",
                      pct: "25%",
                      color: "bg-blue-500/10 text-blue-600",
                    },
                    {
                      title: "Pagamento em Dia",
                      sub: "Pontualidade nas faturas",
                      pct: "25%",
                      color: "bg-emerald-500/10 text-emerald-600",
                    },
                    {
                      title: "Diversidade de Gastos",
                      sub: "Equilíbrio entre categorias",
                      pct: "20%",
                      color: "bg-violet-500/10 text-violet-600",
                    },
                    {
                      title: "Consistência",
                      sub: "Regularidade nos gastos",
                      pct: "15%",
                      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                    },
                    {
                      title: "Histórico de Crédito",
                      sub: "Tempo de relacionamento",
                      pct: "15%",
                      color: "bg-teal-500/10 text-teal-600",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="ella-glass border-ella-muted/70 bg-ella-card/85 flex items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            "flex h-9 w-9 items-center justify-center rounded-full " + item.color
                          }
                        >
                          <span className="text-xs font-bold">●</span>
                        </div>
                        <div>
                          <div className="text-ella-navy text-sm font-semibold">{item.title}</div>
                          <div className="text-ella-subtile text-xs">{item.sub}</div>
                        </div>
                      </div>
                      <div className="text-ella-navy bg-ella-background/60 rounded-full px-3 py-1 text-xs font-semibold">
                        {item.pct}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLANEJAMENTO (ref print 4) */}
        <section id="planejamento" className="bg-ella-card/70 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Planejamento
            </p>
            <h2 className="text-ella-navy mt-2 text-3xl font-semibold">Criando Seu Orçamento</h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              Defina limites claros para cada categoria e deixe a ELLA monitorar para você.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <div className="text-ella-navy flex items-center gap-2 text-lg font-semibold">
                  <span className="bg-ella-navy/10 text-ella-navy inline-flex h-9 w-9 items-center justify-center rounded-full">
                    ✎
                  </span>
                  1. Defina seus valores
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    {
                      label: "RENDA MENSAL",
                      rows: [{ name: "Salário Líquido", value: "R$ 5.000,00" }],
                    },
                    {
                      label: "DESPESAS FIXAS",
                      rows: [
                        { name: "Aluguel / Condomínio", value: "R$ 1.800,00" },
                        { name: "Internet / Luz", value: "R$ 300,00" },
                      ],
                    },
                    {
                      label: "DESPESAS VARIÁVEIS",
                      rows: [{ name: "Lazer / Restaurantes", value: "R$ 800,00" }],
                    },
                  ].map((block) => (
                    <div key={block.label}>
                      <div className="text-ella-subtile mb-2 text-xs font-semibold tracking-wide">
                        {block.label}
                      </div>
                      <div className="space-y-3">
                        {block.rows.map((r) => (
                          <div
                            key={r.name}
                            className="bg-ella-card/80 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-ella-navy text-sm font-medium">{r.name}</div>
                              <div className="text-ella-navy text-sm font-semibold">{r.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-ella-navy flex items-center gap-2 text-lg font-semibold">
                  <span className="bg-ella-navy/10 text-ella-navy inline-flex h-9 w-9 items-center justify-center rounded-full">
                    ▦
                  </span>
                  2. Acompanhe o Saldo
                </div>

                <div className="mt-5 rounded-2xl bg-linear-to-br from-indigo-500/85 to-slate-900/85 p-8 text-white shadow-lg">
                  <div className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
                    Saldo projetado
                  </div>
                  <div className="mt-3 text-5xl font-semibold">R$ 2.100,00</div>
                  <div className="mt-6 h-px bg-white/20" />
                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/70">Renda</div>
                      <div className="mt-1 font-semibold">R$ 5.000</div>
                    </div>
                    <div>
                      <div className="text-white/70">Despesas</div>
                      <div className="mt-1 font-semibold">R$ 2.900</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-blue-200/60 bg-blue-50/40 p-5">
                  <div className="text-ella-navy flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20">
                      💡
                    </span>
                    Dica do ELLA
                  </div>
                  <div className="text-ella-subtile mt-2 text-sm">
                    O sistema avisa automaticamente quando você atinge 80% do orçamento de uma
                    categoria.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCAÇÃO FINANCEIRA (ref print 5) */}
        <section id="regra-503020" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Educação Financeira
            </p>
            <h2 className="text-ella-navy mt-2 text-3xl font-semibold">A Regra 50/30/20</h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              O método comprovado para equilibrar suas finanças sem sacrifícios extremos.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  pct: "50%",
                  title: "Necessidades",
                  color: "border-blue-500",
                  items: ["Aluguel / Moradia", "Alimentação Básica", "Transporte / Saúde"],
                },
                {
                  pct: "30%",
                  title: "Desejos",
                  color: "border-violet-500",
                  items: ["Restaurantes / Delivery", "Hobbies / Lazer", "Compras Pessoais"],
                },
                {
                  pct: "20%",
                  title: "Investimentos",
                  color: "border-emerald-500",
                  items: ["Reserva de Emergência", "Aposentadoria", "Quitação de Dívidas"],
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className={
                    "ella-glass border-ella-muted/70 bg-ella-card/85 rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  }
                >
                  <div className={"h-1 w-full rounded-full " + c.color} />
                  <div className="mt-8 text-center">
                    <div className="text-ella-navy text-6xl font-semibold">{c.pct}</div>
                    <div className="text-ella-navy mt-2 text-lg font-semibold">{c.title}</div>
                    <div className="text-ella-subtile mt-2 text-sm">
                      {c.title === "Necessidades"
                        ? "Gastos essenciais para sua sobrevivência e trabalho."
                        : c.title === "Desejos"
                          ? "Gastos que trazem prazer e qualidade de vida."
                          : "Construção de patrimônio e segurança futura."}
                    </div>
                  </div>

                  <ul className="text-ella-subtile mt-6 space-y-2 text-sm">
                    {c.items.map((i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTELIGÊNCIA ARTIFICIAL (ref prints 6) */}
        <section id="insights" className="bg-ella-card/70 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-ella-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Inteligência Artificial
            </p>
            <h2 className="text-ella-navy mt-2 text-3xl font-semibold">Insights Inteligentes</h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              O ELLA analisa seus dados 24/7 para encontrar padrões que você não veria.
            </p>

            <div className="relative mt-12">
              <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-56 max-w-xl rounded-[48px] bg-amber-500/10 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-56 max-w-xl rounded-[48px] bg-slate-900/10 blur-3xl" />

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Anomalia de Gasto",
                    desc: "Detectamos um aumento de 35% em gastos com Transporte em relação à sua média histórica.",
                    foot: "Há 2 dias • Uber e 99Taxi",
                    accent: "border-amber-400",
                    icon: "⚠",
                  },
                  {
                    title: "Análise de Categoria",
                    desc: "Alimentação representa 42% dos seus gastos este mês. A recomendação é manter abaixo de 30%.",
                    foot: "Hoje • Baseado na regra 50/30/20",
                    accent: "border-blue-400",
                    icon: "◔",
                  },
                  {
                    title: "Meta Atingida",
                    desc: "Parabéns! Você conseguiu economizar R$ 500,00 este mês, atingindo sua meta de Reserva.",
                    foot: "Ontem • Meta: Reserva de Emergência",
                    accent: "border-emerald-400",
                    icon: "🏆",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={
                      "ella-glass border-ella-muted/70 bg-ella-card/85 relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    }
                  >
                    <div className={"absolute top-0 left-0 h-full w-1 " + card.accent} />
                    <div className="flex items-start gap-3">
                      <div className="bg-ella-navy/10 text-ella-navy flex h-10 w-10 items-center justify-center rounded-xl">
                        <span className="text-sm font-bold">{card.icon}</span>
                      </div>
                      <div>
                        <div className="text-ella-navy text-lg font-semibold">{card.title}</div>
                        <div className="text-ella-subtile mt-2 text-sm leading-relaxed">
                          {card.desc}
                        </div>
                      </div>
                    </div>
                    <div className="border-ella-muted/50 text-ella-subtile mt-5 border-t pt-3 text-xs">
                      {card.foot}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* METAS (ref print 7) */}
        <section id="metas" className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-ella-navy text-3xl font-semibold">Definindo e Alcançando Metas</h2>
            <p className="text-ella-subtile mt-2 max-w-2xl text-sm">
              Transforme sonhos em planos concretos com acompanhamento automático.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  title: "Viagem para Europa",
                  pct: 75,
                  sub: "R$ 15.000 de R$ 20.000",
                  prazo: "Prazo: Dez/2026",
                  color: "bg-blue-500",
                  badge: "text-blue-600",
                  icon: "✈",
                },
                {
                  title: "Trocar de Carro",
                  pct: 40,
                  sub: "R$ 20.000 de R$ 50.000",
                  prazo: "Prazo: Jun/2027",
                  color: "bg-violet-500",
                  badge: "text-violet-600",
                  icon: "🚗",
                },
                {
                  title: "Reserva de Emergência",
                  pct: 90,
                  sub: "R$ 27.000 de R$ 30.000",
                  prazo: "Prazo: Mar/2026",
                  color: "bg-emerald-500",
                  badge: "text-emerald-600",
                  icon: "🛡",
                },
              ].map((g) => (
                <div
                  key={g.title}
                  className="ella-glass border-ella-muted/70 bg-ella-card/85 rounded-2xl border p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-ella-navy/10 text-ella-navy flex h-12 w-12 items-center justify-center rounded-xl">
                        <span className="text-lg">{g.icon}</span>
                      </div>
                      <div>
                        <div className="text-ella-navy text-base font-semibold">{g.title}</div>
                        <div className="text-ella-subtile mt-1 text-sm">{g.sub}</div>
                      </div>
                    </div>
                    <div className={"text-sm font-semibold " + g.badge}>{g.pct}%</div>
                  </div>

                  <div className="bg-ella-background/60 mt-4 h-3 w-full rounded-full">
                    <div className={"h-3 rounded-full " + g.color} style={{ width: `${g.pct}%` }} />
                  </div>

                  <div className="text-ella-subtile mt-3 flex justify-end text-xs">{g.prazo}</div>
                </div>
              ))}

              <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      ✎
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Sugestão Automática</div>
                      <div className="text-xs text-white/70">
                        Baseado na sua renda, você pode poupar R$ 500 a mais este mês.
                      </div>
                    </div>
                  </div>
                  <button className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95">
                    Aceitar Desafio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ella-brand py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Pronto para transformar suas finanças?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80">
              Comece agora e veja a diferença que a inteligência artificial pode fazer no seu
              controle financeiro.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton onClick={() => navigate("/auth/register")} className="px-6 py-3">
                Acessar ELLA →
              </PrimaryButton>
              <a
                href="#funcionalidades"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Saiba mais
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER marketing */}
        <footer className="bg-ella-brand/95 relative overflow-hidden py-12">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-10 md:grid-cols-[1.6fr_0.7fr_0.7fr] md:gap-14">
              <div className="space-y-4">
                <div className="inline-flex">
                  <Logo variant="horizontal" size="small" inverted />
                </div>
                <p className="max-w-md text-sm leading-relaxed text-white/70">
                  Sua assistente financeira inteligente. Conecte, organize e alcance suas metas com
                  a ajuda da inteligência artificial.
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">Produto</div>
                <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                  <li>
                    <a
                      className="inline-flex transition-colors hover:text-white"
                      href="#funcionalidades"
                    >
                      Funcionalidades
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-flex transition-colors hover:text-white"
                      href="#como-funciona"
                    >
                      Como funciona
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-flex transition-colors hover:text-white"
                      href="#saude-financeira"
                    >
                      Score
                    </a>
                  </li>
                  <li>
                    <a className="inline-flex transition-colors hover:text-white" href="#metas">
                      Metas
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/auth/register")}
                      className="inline-flex text-left transition-colors hover:text-white"
                    >
                      Criar conta
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">Empresa</div>
                <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                  <li>
                    <a
                      className="inline-flex transition-colors hover:text-white"
                      href="mailto:contatoellafinancas@gmail.com"
                    >
                      contatoellafinancas@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center">
              <div>
                © {year} ELLA Finance. Todos os direitos reservados. Desenvolvido por Lenon Merlo.
              </div>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="transition-colors hover:text-white"
                >
                  Privacidade
                </button>
                <button
                  onClick={() => navigate("/terms")}
                  className="transition-colors hover:text-white"
                >
                  Termos
                </button>
                <button
                  onClick={() => navigate("/cookies")}
                  className="transition-colors hover:text-white"
                >
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
