"use client";

import { useState } from "react";
import { motion, type Transition, type Variants } from "motion/react";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
} from "@tabler/icons-react";

/* ------------------------------------------------------------------ */
/* Sample profile data — mirrors the "minimal" theme content shape     */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: "Aiko Tanaka",
  title: "Product Designer",
  initials: "AT",
  bio: "Designing quiet, considered interfaces. Currently shaping the craft at a small studio.",
  skills: ["Product Design", "Prototyping", "Design Systems", "Webflow"],
  project: {
    title: "Hokori Studio",
    desc: "A portfolio system for makers who take pride in their craft.",
  },
};

/* ------------------------------------------------------------------ */
/* Tunables — the fanned-stack geometry                                */
/* ------------------------------------------------------------------ */

const CARD_BASE_LEFT = 138; // where the first card sits, measured from the phone
const CARD_SPACING = 62; // horizontal gap between stacked cards (heavy overlap)
const CARD_TILT = -30; // rotateY in degrees — faces toward the centre
const HOVER_SHIFT = 70; // how far later cards slide to reveal the hovered one
const ENTRANCE_OFFSET = 46; // how far each card slides out from behind the phone

const spring: Transition = {
  type: "spring",
  stiffness: 130,
  damping: 17,
  mass: 0.9,
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const phoneVariants: Variants = {
  hidden: { opacity: 0, x: -28, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: spring },
};

// Cards enter tucked behind the phone, then slide out into the fan.
const cardVariants: Variants = {
  hidden: { opacity: 0, x: -ENTRANCE_OFFSET, y: 12 },
  visible: { opacity: 1, x: 0, y: 0, transition: spring },
};

/* ------------------------------------------------------------------ */
/* The block-cards that peel off the phone                             */
/* ------------------------------------------------------------------ */

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
      {children}
    </span>
  );
}

function ProfileBlock() {
  return (
    <div className="flex h-full flex-col gap-3">
      <CardLabel>Profile</CardLabel>
      <div className="flex size-14 items-center justify-center rounded-2xl bg-stone-200 font-display text-xl font-semibold text-stone-600">
        {PROFILE.initials}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900">
          {PROFILE.name}
        </h3>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-stone-500">
          {PROFILE.title}
        </p>
      </div>
      <p className="text-[12px] leading-relaxed text-stone-600">
        {PROFILE.bio}
      </p>
    </div>
  );
}

function SkillsBlock() {
  return (
    <div className="flex h-full flex-col gap-3">
      <CardLabel>Skills</CardLabel>
      <div className="flex flex-wrap content-start gap-2">
        {PROFILE.skills.map((s) => (
          <span
            key={s}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsBlock() {
  return (
    <div className="flex h-full flex-col gap-3">
      <CardLabel>Projects</CardLabel>
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <div className="h-20 w-full bg-linear-to-br from-stone-200 to-stone-100" />
        <div className="flex items-start justify-between gap-2 px-3 py-2.5">
          <div className="min-w-0">
            <h4 className="font-display text-sm font-semibold tracking-tight text-stone-900">
              {PROFILE.project.title}
            </h4>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-stone-500">
              {PROFILE.project.desc}
            </p>
          </div>
          <IconArrowUpRight className="size-3.5 shrink-0 text-stone-300" />
        </div>
      </div>
    </div>
  );
}

function LinksBlock() {
  return (
    <div className="flex h-full flex-col gap-3">
      <CardLabel>Connect</CardLabel>
      <a className="inline-flex w-max items-center gap-1.5 rounded-full bg-stone-900 px-3.5 py-2 text-[11px] font-medium text-white">
        <IconMail className="size-3.5" /> Get in touch
      </a>
      <div className="flex items-center gap-2">
        {[IconBrandX, IconBrandGithub, IconBrandLinkedin].map((Icon, i) => (
          <span
            key={i}
            className="rounded-full border border-stone-200 p-2 text-stone-600"
          >
            <Icon className="size-4" />
          </span>
        ))}
      </div>
    </div>
  );
}

const BLOCKS = [
  { key: "profile", Block: ProfileBlock },
  { key: "skills", Block: SkillsBlock },
  { key: "projects", Block: ProjectsBlock },
  { key: "links", Block: LinksBlock },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function PhoneHero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative h-130 w-full"
      style={{ perspective: "1400px" }}
    >
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-10 top-1/2 size-72 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      {/* ---------------- Phone (anchor, left) ---------------- */}
      <motion.div
        variants={phoneVariants}
        className="absolute left-0 top-1/2 z-10 h-115 w-56 -translate-y-1/2 rounded-[2.5rem] border border-stone-300/70 bg-stone-900 p-2 shadow-[0_40px_80px_-30px_rgba(28,25,23,0.55)]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-4xl bg-stone-50">
          {/* notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-stone-900" />

          <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-stone-200 font-display text-lg font-semibold text-stone-600">
                {PROFILE.initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold leading-tight tracking-tight text-stone-900">
                  {PROFILE.name}
                </h3>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-stone-500">
                  {PROFILE.title}
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-stone-600">
              {PROFILE.bio}
            </p>

            <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-[10px] font-medium text-white">
              <IconMail className="size-3" /> Get in touch
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Skills
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {PROFILE.skills.map((s, i) => (
                  <span key={s} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-medium text-stone-800">
                      {s}
                    </span>
                    {i < PROFILE.skills.length - 1 && (
                      <span aria-hidden className="text-stone-300">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Projects
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <div className="h-12 w-full bg-linear-to-br from-stone-200 to-stone-100" />
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <h4 className="font-display text-[11px] font-semibold tracking-tight text-stone-900">
                    {PROFILE.project.title}
                  </h4>
                  <IconArrowUpRight className="size-3 shrink-0 text-stone-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------- Fanned block-cards (peel off, tilted) ------- */}
      {BLOCKS.map(({ key, Block }, index) => {
        const shouldShift = activeIndex !== null && index > activeIndex;
        const isActive = activeIndex === index;
        const left = CARD_BASE_LEFT + index * CARD_SPACING;

        return (
          <motion.div
            key={key}
            variants={cardVariants}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className="absolute top-1/2 z-20 h-82.5 w-54.5 -translate-y-1/2 cursor-pointer"
            style={{
              left,
              transformStyle: "preserve-3d",
              zIndex: 20 + index,
            }}
          >
            <motion.div
              className="h-full w-full rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-5 shadow-[0_30px_60px_-25px_rgba(28,25,23,0.5)] backdrop-blur-sm"
              animate={{
                x: shouldShift ? HOVER_SHIFT : 0,
                rotateY: isActive ? CARD_TILT / 2 : CARD_TILT,
                y: isActive ? -16 : 0,
              }}
              transition={spring}
              style={{ transformOrigin: "left center" }}
            >
              <Block />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
