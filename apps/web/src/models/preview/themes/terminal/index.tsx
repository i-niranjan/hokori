import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  IconArrowUpRight,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import type { ProfileData, ProjectData, ResumeData, SkillData } from "@hokori/types";
import type { PersonalInfoBlockData } from "@/models/blocks/types";
import type { ThemeDefinition } from "../../types";
import { getInitials } from "@/helpers/helper";
import { getSocialLinks } from "../../lib";
import ProjectDetailDialog from "../../components/ProjectDetailDialog";

/* ------------------------------------------------------------------ */
/* Shell + sticky condensed header                                     */
/* ------------------------------------------------------------------ */

interface HeroInfo {
  profile: ProfileData | null;
  heroVisible: boolean;
}

const ShellContext = createContext<{
  setInfo: (info: HeroInfo) => void;
} | null>(null);

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

function StickyBar({ info }: { info: HeroInfo }) {
  const profile = info.profile;
  const show = !info.heroVisible && !!profile;

  return (
    <div className="sticky top-0 z-20 h-0">
      <AnimatePresence>
        {show && profile && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950/80 px-5 py-2.5 backdrop-blur-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2 rounded-full bg-red-500/80" />
                <span className="size-2 rounded-full bg-yellow-500/80" />
                <span className="size-2 rounded-full bg-green-500/80" />
              </span>
              <p className="truncate text-xs text-zinc-400">
                <span className="text-emerald-400">{slug(profile.name)}</span>
                <span className="text-zinc-600">@hokori</span>
                <span className="ml-2 hidden text-zinc-500 sm:inline">
                  — {profile.title.toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {profile.contactEmail && (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  aria-label="Email"
                  className="rounded border border-emerald-400/60 bg-emerald-400/10 p-1.5 text-emerald-400 transition-colors hover:bg-emerald-400/20"
                >
                  <IconMail className="size-3.5" />
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[\s\-()]/g, "")}`}
                  aria-label="Call"
                  className="rounded border border-zinc-700 p-1.5 text-zinc-400 transition-colors hover:border-emerald-400/60 hover:text-emerald-400"
                >
                  <IconPhone className="size-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<HeroInfo>({
    profile: null,
    heroVisible: true,
  });
  const ctx = useMemo(() => ({ setInfo }), []);

  return (
    <ShellContext.Provider value={ctx}>
      <div className="h-full w-full overflow-y-auto bg-zinc-950 font-mono text-zinc-200 antialiased">
        <StickyBar info={info} />
        <div className="mx-auto flex max-w-xl flex-col gap-10 px-6 pb-20 pt-10">
          {children}
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function Prompt({ command }: { command: string }) {
  return (
    <p className="text-xs text-zinc-500">
      <span className="text-emerald-400">➜</span>{" "}
      <span className="text-sky-400">~</span> {command}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

function PersonalInfo({ data }: { data: PersonalInfoBlockData }) {
  const { profile } = data;
  const socials = getSocialLinks(data.socialLinks);
  const ctx = useContext(ShellContext);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroVisible = useInView(heroRef, { amount: 0.2 });

  useEffect(() => {
    ctx?.setInfo({ profile, heroVisible });
    return () => ctx?.setInfo({ profile: null, heroVisible: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, heroVisible]);

  return (
    <section ref={heroRef} className="flex flex-col gap-5">
      {profile && (
        <>
          <Prompt command="whoami" />
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-20 shrink-0 rounded-xl border border-zinc-800 object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl font-bold text-emerald-400">
                {getInitials(profile.name)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-emerald-400">
                {profile.title}
              </p>
            </div>
          </div>

          {profile.bio && (
            <p className="max-w-prose text-sm leading-relaxed text-zinc-400">
              <span className="select-none text-zinc-600"># </span>
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {profile.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-2 rounded border border-emerald-400/60 bg-emerald-400/10 px-3.5 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-400/20"
              >
                <IconMail className="size-4" /> get in touch
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[\s\-()]/g, "")}`}
                aria-label="Call"
                className="rounded border border-zinc-700 p-2.5 text-zinc-400 transition-colors hover:border-emerald-400/60 hover:text-emerald-400"
              >
                <IconPhone className="size-4" />
              </a>
            )}
            {socials.length > 0 && (
              <span className="mx-1 h-5 w-px bg-zinc-800" aria-hidden />
            )}
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded p-2 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-emerald-400"
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

const MAX_VISIBLE_SKILLS = 5;

function Skills({ data }: { data: SkillData[] }) {
  if (data.length === 0) return null;
  const shown = data.slice(0, MAX_VISIBLE_SKILLS);
  const extra = data.length - shown.length;

  return (
    <section className="flex flex-col gap-3">
      <Prompt command="ls ./skills" />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 pl-1">
        {shown.map((skill, index) => (
          <span key={skill.id} className="flex items-baseline gap-3">
            <span className="text-sm font-medium text-zinc-200">
              {slug(skill.name)}
            </span>
            {index < shown.length - 1 && (
              <span aria-hidden className="text-zinc-700">
                /
              </span>
            )}
          </span>
        ))}
        {extra > 0 && (
          <span className="text-xs text-zinc-500">+{extra} more</span>
        )}
      </div>
    </section>
  );
}

function Projects({ data }: { data: ProjectData[] }) {
  const [selected, setSelected] = useState<ProjectData | null>(null);
  if (data.length === 0) return null;

  const featured = data.length === 1 ? data[0] : null;

  return (
    <section className="flex flex-col gap-3">
      <Prompt command="ls ./projects" />

      {featured ? (
        <button
          type="button"
          onClick={() => setSelected(featured)}
          className="group cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 text-left transition-colors hover:border-emerald-400/50"
        >
          {featured.thumbnail && (
            <img
              src={featured.thumbnail}
              alt=""
              className="h-40 w-full border-b border-zinc-800 object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.015]"
            />
          )}
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-zinc-50">
                {featured.title}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {featured.desc}
              </p>
            </div>
            <IconArrowUpRight className="size-4 shrink-0 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
          </div>
        </button>
      ) : (
        <div className="flex flex-col">
          {data.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="group flex cursor-pointer items-center gap-4 border-b border-zinc-800/80 py-3.5 text-left last:border-b-0"
            >
              <span className="w-8 shrink-0 text-xs text-zinc-600 transition-colors group-hover:text-emerald-400">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-zinc-100">
                  {project.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                  {project.desc}
                </p>
              </div>
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt=""
                  className="size-12 shrink-0 rounded border border-zinc-800 object-cover opacity-90"
                />
              )}
              <IconArrowUpRight className="size-4 shrink-0 text-zinc-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
            </button>
          ))}
        </div>
      )}

      <ProjectDetailDialog
        project={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function Resume({ data }: { data: ResumeData }) {
  return (
    <section className="flex flex-col gap-3">
      <Prompt command="open resume.pdf" />
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-max items-center gap-2 pl-1 text-sm font-medium text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors hover:decoration-emerald-400"
      >
        view my resume
        <IconArrowUpRight className="size-4 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
      </a>
    </section>
  );
}

export const terminalTheme: ThemeDefinition = {
  id: "terminal",
  name: "Terminal",
  Shell,
  renderers: {
    PersonalInfo,
    Skills,
    Projects,
    Resume,
  },
};
