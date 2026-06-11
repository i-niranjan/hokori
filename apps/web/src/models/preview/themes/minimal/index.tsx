import type { ReactNode } from "react";
import type { ProfileData } from "@hokori/types";
import type { ThemeDefinition } from "../../types";
import { getInitials } from "@/helpers/helper";
import { getSocialLinks } from "../../lib";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto bg-white text-neutral-900 antialiased">
      <div className="mx-auto flex max-w-md flex-col gap-10 px-6 py-12">
        {children}
      </div>
    </div>
  );
}

function PersonalInfo({ data }: { data: ProfileData }) {
  const socials = getSocialLinks(data);

  return (
    <section className="flex flex-col items-center gap-4 text-center">
      {data.avatarUrl ? (
        <img
          src={data.avatarUrl}
          alt={data.name}
          className="size-24 rounded-full border border-neutral-200 object-cover"
        />
      ) : (
        <div className="flex size-24 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-2xl font-semibold text-neutral-500">
          {getInitials(data.name)}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm uppercase tracking-widest text-neutral-500">
          {data.title}
        </p>
      </div>

      {data.bio && (
        <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
          {data.bio}
        </p>
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

export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  Shell,
  renderers: {
    PersonalInfo,
  },
};
