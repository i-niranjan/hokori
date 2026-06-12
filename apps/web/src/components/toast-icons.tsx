/**
 * Hand-drawn toast glyphs, sibling style to the block glyphs in
 * models/blocks/components/BlockIcons.tsx. Pure currentColor so the
 * toaster tints them per toast type.
 */

interface GlyphProps {
  className?: string;
}

export function SuccessGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle
        cx="24"
        cy="24"
        r="17"
        className="fill-current opacity-12"
      />
      <circle
        cx="24"
        cy="24"
        r="17"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="88 19"
        strokeDashoffset="-8"
      />
      <path
        d="M16.5 24.5l5.5 5.5L32 18.5"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ErrorGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="17" className="fill-current opacity-12" />
      <circle
        cx="24"
        cy="24"
        r="17"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="88 19"
        strokeDashoffset="14"
      />
      <path
        d="M18.5 18.5L29.5 29.5M29.5 18.5L18.5 29.5"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WarningGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path
        d="M24 8L42 38H6L24 8z"
        className="fill-current opacity-12"
      />
      <path
        d="M24 8L42 38H6L24 8z"
        className="stroke-current"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="78 14"
        strokeDashoffset="-20"
      />
      <path
        d="M24 19v9"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="33" r="2" className="fill-current" />
    </svg>
  );
}

export function InfoGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="17" className="fill-current opacity-12" />
      <circle
        cx="24"
        cy="24"
        r="17"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="88 19"
        strokeDashoffset="40"
      />
      <circle cx="24" cy="16.5" r="2.2" className="fill-current" />
      <path
        d="M24 22.5V32"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoadingGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle
        cx="24"
        cy="24"
        r="17"
        className="stroke-current opacity-20"
        strokeWidth="3"
      />
      <path
        d="M24 7a17 17 0 0 1 14.7 8.5"
        className="stroke-current"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="20" r="2.2" className="fill-current" />
    </svg>
  );
}
