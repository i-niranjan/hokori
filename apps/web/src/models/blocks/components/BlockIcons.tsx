/**
 * Hand-drawn glyphs for block types. Two-tone: strokes follow currentColor,
 * accents use the theme primary, so they work in any context.
 */

interface GlyphProps {
  className?: string;
}

export function ProfileGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="7"
        y="7"
        width="34"
        height="34"
        rx="11"
        className="stroke-current"
        strokeWidth="2.5"
      />
      <circle
        cx="24"
        cy="20"
        r="5.5"
        className="fill-primary/25 stroke-current"
        strokeWidth="2.5"
      />
      <path
        d="M15 35.5c1.8-5.4 5.4-7.5 9-7.5s7.2 2.1 9 7.5"
        className="stroke-current"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="37.5" cy="10.5" r="4" className="fill-primary" />
      <path
        d="M36 10.5l1.1 1.1 2-2.2"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SkillsGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M22 7l3.2 9.3 9.3 3.2-9.3 3.2L22 32l-3.2-9.3L9.5 19.5l9.3-3.2L22 7z"
        className="fill-primary/25 stroke-current"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M35 26l1.8 5.2L42 33l-5.2 1.8L35 40l-1.8-5.2L28 33l5.2-1.8L35 26z"
        className="fill-primary stroke-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="38" r="2.5" className="fill-current opacity-40" />
      <path
        d="M40 12v6M37 15h6"
        className="stroke-current opacity-40"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProjectsGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="14"
        y="6"
        width="28"
        height="20"
        rx="6"
        className="fill-primary/15 stroke-current opacity-50"
        strokeWidth="2"
      />
      <rect
        x="10"
        y="13"
        width="28"
        height="20"
        rx="6"
        className="fill-background stroke-current opacity-75"
        strokeWidth="2.2"
      />
      <rect
        x="6"
        y="20"
        width="28"
        height="20"
        rx="6"
        className="fill-background stroke-current"
        strokeWidth="2.5"
      />
      <path
        d="M13 30l3.5 3L13 36"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 35.5h6"
        className="stroke-current opacity-60"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
