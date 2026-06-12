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
            className="flex items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/75 px-5 py-2.5 backdrop-blur-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="size-8 shrink-0 rounded-full border border-stone-200 object-cover"
                />
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-[10px] font-semibold text-stone-600">
                  {getInitials(profile.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold leading-tight text-stone-900">
                  {profile.name}
                </p>
                <p className="truncate text-[10px] uppercase tracking-widest text-stone-500">
                  {profile.title}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {profile.contactEmail && (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  aria-label="Email"
                  className="rounded-full bg-stone-900 p-2 text-white transition-colors hover:bg-stone-700"
                >
                  <IconMail className="size-3.5" />
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[\s\-()]/g, "")}`}
                  aria-label="Call"
                  className="rounded-full border border-stone-300 p-2 text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
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
      <div className="h-full w-full overflow-y-auto bg-stone-50 text-stone-900 antialiased">
        <StickyBar info={info} />
        <div className="mx-auto flex max-w-xl flex-col gap-12 px-6 pb-20 pt-12">
          {children}
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        {children}
      </h2>
      <div className="h-px flex-1 bg-stone-200" />
    </div>
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
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-20 shrink-0 rounded-2xl border border-stone-200 object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-stone-200 text-xl font-semibold text-stone-600">
                {getInitials(profile.name)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                {profile.name}
              </h1>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                {profile.title}
              </p>
            </div>
          </div>

          {profile.bio && (
            <p className="max-w-prose text-[15px] leading-relaxed text-stone-600">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {profile.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
              >
                <IconMail className="size-4" /> Get in touch
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[\s\-()]/g, "")}`}
                aria-label="Call"
                className="rounded-full border border-stone-300 p-2.5 text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                <IconPhone className="size-4" />
              </a>
            )}
            {socials.length > 0 && (
              <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />
            )}
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-900"
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
    <section className="flex flex-col gap-4">
      <SectionHeader>Skills</SectionHeader>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        {shown.map((skill, index) => (
          <span key={skill.id} className="flex items-baseline gap-3">
            <span className="text-[15px] font-medium text-stone-800">
              {skill.name}
            </span>
            {index < shown.length - 1 && (
              <span aria-hidden className="text-stone-300">
                ·
              </span>
            )}
          </span>
        ))}
        {extra > 0 && (
          <span className="text-sm text-stone-400">+{extra} more</span>
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
    <section className="flex flex-col gap-4">
      <SectionHeader>Projects</SectionHeader>

      {featured ? (
        <button
          type="button"
          onClick={() => setSelected(featured)}
          className="group cursor-pointer overflow-hidden rounded-2xl border border-stone-200 text-left transition-colors hover:border-stone-400"
        >
          {featured.thumbnail && (
            <img
              src={featured.thumbnail}
              alt=""
              className="h-40 w-full border-b border-stone-100 object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            />
          )}
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {featured.title}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">
                {featured.desc}
              </p>
            </div>
            <IconArrowUpRight className="size-4 shrink-0 text-stone-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-900" />
          </div>
        </button>
      ) : (
        <div className="flex flex-col">
          {data.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="group flex cursor-pointer items-center gap-4 border-b border-stone-200 py-4 text-left last:border-b-0"
            >
              <span className="w-6 shrink-0 font-display text-sm text-stone-300 transition-colors group-hover:text-stone-900">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-lg font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-stone-500">
                  {project.desc}
                </p>
              </div>
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt=""
                  className="size-13 shrink-0 rounded-lg border border-stone-200 object-cover"
                />
              )}
              <IconArrowUpRight className="size-4 shrink-0 text-stone-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-900" />
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
    <section className="flex flex-col gap-4">
      <SectionHeader>Resume</SectionHeader>
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-max items-center gap-2 text-[15px] font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 transition-colors hover:decoration-stone-900"
      >
        View my resume
        <IconArrowUpRight className="size-4 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-900" />
      </a>
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
    Resume,
  },
};
