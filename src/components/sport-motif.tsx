/**
 * Line-art sport illustrations used as background motifs (hero, patterns).
 * Picks a motif from the sport name/slug; falls back to a trophy.
 * All use currentColor so opacity/color is controlled by the parent.
 */
type MotifProps = { className?: string; size?: number };

const common = (children: React.ReactNode, size: number, className?: string) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={3.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

function Soccer({ size = 100, className }: MotifProps) {
  return common(
    <>
      <circle cx="50" cy="50" r="38" />
      <polygon points="50,34 64,44 59,61 41,61 36,44" fill="currentColor" stroke="none" opacity="0.18" />
      <polygon points="50,34 64,44 59,61 41,61 36,44" />
      <path d="M50 12v22M88 50 64 44M73 80 59 61M27 80 41 61M12 50 36 44" />
    </>,
    size,
    className,
  );
}

function Basketball({ size = 100, className }: MotifProps) {
  return common(
    <>
      <circle cx="50" cy="50" r="38" />
      <path d="M50 12v76M12 50h76" />
      <path d="M22 24c14 12 14 40 0 52M78 24c-14 12-14 40 0 52" />
    </>,
    size,
    className,
  );
}

function Volleyball({ size = 100, className }: MotifProps) {
  return common(
    <>
      <circle cx="50" cy="50" r="38" />
      <path d="M50 12c-10 16-10 38 6 60M50 12c14 10 26 26 28 44M16 38c20-2 44 8 56 30M30 78c2-22 16-40 38-48" />
    </>,
    size,
    className,
  );
}

function Tennis({ size = 100, className }: MotifProps) {
  return common(
    <>
      {/* racket */}
      <ellipse cx="40" cy="38" rx="22" ry="26" transform="rotate(-30 40 38)" />
      <path d="M40 38m-14 0 28 0M40 38m0 -18 0 36" transform="rotate(-30 40 38)" opacity="0.6" />
      <path d="M52 56 78 84" />
      {/* ball */}
      <circle cx="74" cy="30" r="9" />
      <path d="M66 27c6 3 12 3 16-1" />
    </>,
    size,
    className,
  );
}

function TableTennis({ size = 100, className }: MotifProps) {
  return common(
    <>
      <ellipse cx="42" cy="40" rx="24" ry="26" transform="rotate(-25 42 40)" fill="currentColor" stroke="none" opacity="0.15" />
      <ellipse cx="42" cy="40" rx="24" ry="26" transform="rotate(-25 42 40)" />
      <path d="M56 58 76 82" />
      <circle cx="74" cy="34" r="7" />
    </>,
    size,
    className,
  );
}

function Badminton({ size = 100, className }: MotifProps) {
  return common(
    <>
      <circle cx="40" cy="68" r="12" />
      <path d="M48 60 78 24M44 56 70 18M52 64 86 32M40 56 60 20" />
    </>,
    size,
    className,
  );
}

function Athletics({ size = 100, className }: MotifProps) {
  return common(
    <>
      {/* medal */}
      <path d="M38 18 50 44M62 18 50 44" />
      <circle cx="50" cy="64" r="22" />
      <path d="M50 52 53 60 61 60 55 65 57 73 50 68 43 73 45 65 39 60 47 60z" fill="currentColor" stroke="none" opacity="0.25" />
    </>,
    size,
    className,
  );
}

function Trophy({ size = 100, className }: MotifProps) {
  return common(
    <>
      <path d="M32 22h36v14a18 18 0 0 1-36 0z" />
      <path d="M32 26H20c0 12 6 16 14 16M68 26h12c0 12-6 16-14 16" />
      <path d="M50 54v14M38 78h24M44 68h12" />
    </>,
    size,
    className,
  );
}

export function SportMotif({
  sport,
  size = 100,
  className,
}: {
  sport: string;
  size?: number;
  className?: string;
}) {
  const s = sport.toLowerCase();
  if (s.includes("foot") || s.includes("soccer")) return <Soccer size={size} className={className} />;
  if (s.includes("basket")) return <Basketball size={size} className={className} />;
  if (s.includes("volley")) return <Volleyball size={size} className={className} />;
  if (s.includes("table")) return <TableTennis size={size} className={className} />;
  if (s.includes("badmin")) return <Badminton size={size} className={className} />;
  if (s.includes("tennis")) return <Tennis size={size} className={className} />;
  if (s.includes("athlet") || s.includes("track") || s.includes("swim")) return <Athletics size={size} className={className} />;
  return <Trophy size={size} className={className} />;
}
