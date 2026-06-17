/** Rotating rainbow sunburst — the USF26 signature motif. CSS-only. */
const RAYS = [
  "#1b75bc",
  "#f7941e",
  "#ec008c",
  "#ffd200",
  "#8dc63f",
  "#2ec4b6",
  "#e63946",
  "#6a4ca5",
];

export function Sunburst({
  className = "",
  size = 600,
  spin = true,
  opacity = 0.5,
}: {
  className?: string;
  size?: number;
  spin?: boolean;
  opacity?: number;
}) {
  const count = 24;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${spin ? "animate-spin-slow" : ""} ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        return (
          <rect
            key={i}
            x="49"
            y="0"
            width="2"
            height="50"
            fill={RAYS[i % RAYS.length]}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
    </svg>
  );
}
