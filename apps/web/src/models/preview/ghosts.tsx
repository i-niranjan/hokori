import type { ComponentType } from "react";
import type { BlockType } from "@hokori/types";

/**
 * Skeleton placeholders shown in the dashboard preview when a block has no
 * content yet, so adding a block immediately shows its shape on the page.
 * Bones use currentColor so they adapt to any theme Shell (light or dark).
 * Never rendered on the public page.
 */

const bone = "animate-pulse rounded-full bg-current opacity-15";

function PersonalInfoGhost() {
  return (
    <section className="flex flex-col items-center gap-4">
      <div className={`${bone} size-20 rounded-full!`} />
      <div className="flex flex-col items-center gap-2">
        <div className={`${bone} h-4 w-32`} />
        <div className={`${bone} h-3 w-24`} />
        <div className={`${bone} h-3 w-48`} />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${bone} size-8 rounded-lg!`} />
        ))}
      </div>
      <p className="text-xs opacity-40">Your profile appears here</p>
    </section>
  );
}

function SkillsGhost() {
  const widths = ["w-16", "w-12", "w-20", "w-14", "w-16", "w-12"];
  return (
    <section className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {widths.map((w, i) => (
          <div key={i} className={`${bone} h-6 ${w}`} />
        ))}
      </div>
      <p className="text-xs opacity-40">Your skills appear here</p>
    </section>
  );
}

function ProjectsGhost() {
  return (
    <section className="flex flex-col gap-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-2 rounded-xl border border-current/15 px-4 py-3"
        >
          <div className={`${bone} h-3.5 w-28`} />
          <div className={`${bone} h-2.5 w-full`} />
          <div className={`${bone} h-2.5 w-3/4`} />
        </div>
      ))}
      <p className="text-center text-xs opacity-40">
        Your projects appear here
      </p>
    </section>
  );
}

function ResumeGhost() {
  return (
    <section className="flex flex-col items-center gap-2">
      <div className={`${bone} h-9 w-36 rounded-full!`} />
      <p className="text-xs opacity-40">Your resume appears here</p>
    </section>
  );
}

export const BLOCK_GHOSTS: Record<BlockType, ComponentType> = {
  PersonalInfo: PersonalInfoGhost,
  Skills: SkillsGhost,
  Projects: ProjectsGhost,
  Resume: ResumeGhost,
};
