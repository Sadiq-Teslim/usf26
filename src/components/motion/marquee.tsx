/** CSS-only seamless marquee of a repeated word — the poster "FOOTBALL FOOTBALL" motif. */
export function Marquee({
  text,
  className = "",
  outline = false,
  reverse = false,
}: {
  text: string;
  className?: string;
  outline?: boolean;
  reverse?: boolean;
}) {
  const items = Array.from({ length: 8 });
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((_, i) => (
              <span
                key={i}
                className={`display-wide px-6 ${outline ? "text-outline" : ""}`}
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
