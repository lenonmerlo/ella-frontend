import type { FC } from "react";

export interface LogoProps {
  variant?: "horizontal" | "vertical" | "symbol";
  size?: "small" | "medium" | "large";
  inverted?: boolean;
}

// mapa de dimensões por tamanho
const DIMENSIONS: Record<
  NonNullable<LogoProps["size"]>,
  { width: number; symbolSize: number; fontSize: number; spacing: number }
> = {
  small: { width: 120, symbolSize: 24, fontSize: 28, spacing: 8 },
  medium: { width: 180, symbolSize: 36, fontSize: 42, spacing: 12 },
  large: { width: 240, symbolSize: 48, fontSize: 56, spacing: 16 },
};

// 🔸 símbolo da meia-lua isolado
const MoonSymbol: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 4C19.8 4 16 5.6 13.2 8.4C10.4 11.2 8.8 15 8.8 19.2C8.8 23.4 10.4 27.2 13.2 30C16 32.8 19.8 34.4 24 34.4C24.8 34.4 25.6 34.4 26.4 34.2C22.8 32.4 20.4 28.6 20.4 24C20.4 19.4 22.8 15.6 26.4 13.8C25.6 13.6 24.8 13.6 24 13.6C21.6 13.6 19.4 14.4 17.6 16C15.8 17.8 15 20 15 22.4C15 24.8 15.8 27 17.6 28.8C19.4 30.6 21.6 31.4 24 31.4C26.4 31.4 28.6 30.6 30.4 28.8C32.2 27 33 24.8 33 22.4C33 18.2 30.2 14.6 26.4 13.8C30 15.6 32.4 19.4 32.4 24C32.4 28.6 30 32.4 26.4 34.2C30.8 33.6 34.6 31.4 37.2 28C40 25.2 41.6 21.4 41.6 17.2C41.6 13 40 9.2 37.2 6.4C34.4 3.6 30.6 2 26.4 2C25.6 2 24.8 2 24 2.2"
      fill={color}
    />
    <circle cx="24" cy="24" r="3" fill={color} opacity="0.4" />
  </svg>
);

// 🔹 wordmark “ELLA”
const EllaText: FC<{ fontSize: number; color: string }> = ({
  fontSize,
  color,
}) => (
  <svg
    width={fontSize * 3.2}
    height={fontSize * 1.2}
    viewBox="0 0 180 70"
    fill="none"
  >
    <text
      x="0"
      y="56"
      fill={color}
      style={{
        fontFamily: "Poppins, system-ui, -apple-system, sans-serif",
        fontSize: "56px",
        fontWeight: 300,
        letterSpacing: "0.1em",
      }}
    >
      ELLA
    </text>
  </svg>
);

export const Logo: FC<LogoProps> = ({
  variant = "horizontal",
  size = "medium",
  inverted = false,
}) => {
  const navy = inverted ? "#FFFFFF" : "#0E1A2B";
  const gold = "#C9A43B";

  const { symbolSize, fontSize, spacing } = DIMENSIONS[size];

  if (variant === "horizontal") {
    return (
      <div
        className="flex items-center"
        style={{ gap: `${spacing}px` }}
        aria-label="Logo ELLA"
      >
        <MoonSymbol size={symbolSize} color={gold} />
        <EllaText fontSize={fontSize} color={navy} />
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div
        className="flex flex-col items-center"
        style={{ gap: `${spacing}px` }}
        aria-label="Logo ELLA"
      >
        <MoonSymbol size={symbolSize} color={gold} />
        <EllaText fontSize={fontSize} color={navy} />
      </div>
    );
  }

  // só o símbolo
  return (
    <div aria-label="Símbolo ELLA">
      <MoonSymbol size={symbolSize * 1.5} color={gold} />
    </div>
  );
};
