type Props = {
  className?: string;
  variant?: "full" | "compact" | "mark";
  tone?: "platinum" | "ink";
};

/**
 * AETHER logo system.
 *  - full:    mark + wordmark
 *  - compact: small mark + tight wordmark
 *  - mark:    monogram only
 */
export function AetherLogo({ className, variant = "full", tone = "platinum" }: Props) {
  const fg = tone === "platinum" ? "currentColor" : "var(--ink)";
  const stroke = "url(#aether-grad)";

  const Mark = (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="aether-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c0c5ce" />
          <stop offset="1" stopColor="#8ab4ff" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 L58 56 H47 L42 46 H22 L17 56 H6 Z M26 38 H38 L32 25 Z"
        fill={stroke}
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <span className={className} style={{ color: fg, display: "inline-block" }}>
        {Mark}
      </span>
    );
  }

  const sizeClasses =
    variant === "compact" ? "h-6 gap-1.5 text-base" : "h-8 gap-2 text-lg";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} ${className ?? ""}`}
      style={{ color: fg }}
    >
      <span className="h-full aspect-square">{Mark}</span>
      <span
        className="font-display tracking-[0.18em] uppercase"
        style={{ fontSize: variant === "compact" ? "0.95rem" : "1.25rem" }}
      >
        Aether
      </span>
    </span>
  );
}
