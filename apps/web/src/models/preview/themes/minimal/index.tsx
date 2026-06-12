import { useState, type ReactNode } from "react";
import type { ProjectData, SkillData } from "@hokori/types";
import type { PersonalInfoBlockData } from "@/models/blocks/types";
import type { ThemeDefinition } from "../../types";
import { getInitials } from "@/helpers/helper";
import { getSocialLinks } from "../../lib";
import ProjectDetailDialog from "../../components/ProjectDetailDialog";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto bg-white text-neutral-900 antialiased">
      <div className="mx-auto flex max-w-md flex-col gap-10 px-6 py-12">
        {children}
      </div>
    </div>
  );
}

function PersonalInfo({ data }: { data: PersonalInfoBlockData }) {
  const { profile } = data;
  const socials = getSocialLinks(data.socialLinks);

  return (
    <section className="flex flex-col items-center gap-4 text-center">
      {profile && (
        <>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="size-24 rounded-full border border-neutral-200 object-cover"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-2xl font-semibold text-neutral-500">
              {getInitials(profile.name)}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm uppercase tracking-widest text-neutral-500">
              {profile.title}
            </p>
          </div>

          {profile.bio && (
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              {profile.bio}
            </p>
          )}
        </>
      )}

      {socials.length > 0 && (
        <div className="mt-2 flex gap-3">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="rounded-full border border-neutral-200 p-2 text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Skills({ data }: { data: SkillData[] }) {
  if (data.length === 0) return null;
  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Skills
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {data.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}

function Projects({ data }: { data: ProjectData[] }) {
  const [selected, setSelected] = useState<ProjectData | null>(null);
  if (data.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Projects
      </h2>
      <div className="flex flex-col gap-3">
        {data.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200 text-left transition-all hover:border-neutral-400 hover:shadow-sm"
          >
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt=""
                className="h-28 w-full border-b border-neutral-100 object-cover"
              />
            )}
            <div className="px-4 py-3">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {project.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
      <ProjectDetailDialog
        project={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  Shell,
  renderers: {
    PersonalInfo,
    Skills,
    Projects,
  },
};
