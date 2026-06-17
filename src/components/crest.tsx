import Image from "next/image";

/**
 * Group crest. Uses a real image when available (group.logoUrl), otherwise a
 * generated monogram badge built from the group's code + color. Drop real
 * crests at /brand/crests/<CODE>.png and set logoUrl to swap them in.
 */
export function Crest({
  code,
  color,
  logoUrl,
  size = 40,
  className = "",
}: {
  code: string;
  color: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`${code} crest`}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  const id = `g-${code}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`shrink-0 ${className}`}
      aria-label={`${code} crest`}
      role="img"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(color, 0.25)} />
          <stop offset="100%" stopColor={darken(color, 0.3)} />
        </linearGradient>
      </defs>
      {/* hex shield */}
      <path
        d="M24 1.5 42.5 12v24L24 46.5 5.5 36V12z"
        fill={`url(#${id})`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
      />
      {/* top sheen */}
      <path
        d="M24 1.5 42.5 12v6L24 8 5.5 18v-6z"
        fill="rgba(255,255,255,0.18)"
      />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontFamily="Clash Display, Inter, sans-serif"
        fontWeight="700"
        fontSize={code.length > 3 ? 10 : 13}
        fill="#fff"
      >
        {code}
      </text>
    </svg>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}
function lighten(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return toHex({ r: r + (255 - r) * amt, g: g + (255 - g) * amt, b: b + (255 - b) * amt });
}
function darken(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return toHex({ r: r * (1 - amt), g: g * (1 - amt), b: b * (1 - amt) });
}
