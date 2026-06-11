import type { ReactNode } from "react";
import type { ProfileData, SkillData } from "@hokori/types";
import type { ThemeDefinition } from "../../types";
import { getSocialLinks } from "../../lib";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto bg-zinc-950 font-mono text-zinc-200 antialiased">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-5 py-8">
        {children}
      </div>
    </div>
  );
}

function WindowChrome({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-500" />
        <span className="size-2.5 rounded-full bg-yellow-500" />
        <span className="size-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-zinc-500">{title}</span>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
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

function PersonalInfo({ data }: { data: ProfileData }) {
  const socials = getSocialLinks(data);

  return (
    <WindowChrome title={`${data.name.toLowerCase().replace(/\s+/g, "-")} — zsh`}>
      <div className="flex flex-col gap-4">
        <Prompt command="whoami" />
        <div className="flex items-center gap-4">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.name}
              className="size-16 rounded-md border border-zinc-700 object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-emerald-400">
              $_
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-zinc-50">{data.name}</h1>
            <p className="text-sm text-emerald-400">{data.title}</p>
          </div>
        </div>

        {data.bio && (
          <div className="flex flex-col gap-1">
            <Prompt command="cat about.txt" />
            <p className="text-sm leading-relaxed text-zinc-400">{data.bio}</p>
          </div>
        )}

        {socials.length > 0 && (
          <div className="flex flex-col gap-2">
            <Prompt command="ls ./socials" />
            <div className="flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex items-center gap-1.5 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-emerald-400 hover:text-emerald-400"
                >
                  <Icon className="size-3.5" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </WindowChrome>
  );
}

function Skills({ data }: { data: SkillData[] }) {
  if (data.length === 0) return null;
  return (
    <WindowChrome title="skills — zsh">
      <div className="flex flex-col gap-2">
        <Prompt command="ls ./skills" />
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <span
              key={skill.id}
              className="rounded border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-xs text-emerald-300"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </WindowChrome>
  );
}

export const terminalTheme: ThemeDefinition = {
  id: "terminal",
  name: "Terminal",
  Shell,
  renderers: {
    PersonalInfo,
    Skills,
  },
};
