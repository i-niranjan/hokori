import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { isAxiosError } from "axios";
import type { PublicProfilePayload } from "@hokori/types";
import { getPublicProfile } from "@/services/publicService";
import { themes } from "@/models/preview/themes/registry";
import { renderBlock } from "@/models/preview/render";
import type { Block } from "@/models/blocks/types";
import { IconLoader2 } from "@tabler/icons-react";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "ready"; payload: PublicProfilePayload };

export default function PublicProfile() {
  const { username = "" } = useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const payload = await getPublicProfile(username);
        if (!cancelled) setState({ status: "ready", payload });
      } catch (error) {
        if (cancelled) return;
        if (isAxiosError(error) && error.response?.status === 404) {
          setState({ status: "not-found" });
        } else {
          setState({ status: "error" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (state.status === "loading") {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.status === "not-found" || state.status === "error") {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-display text-3xl font-semibold">
          {state.status === "not-found"
            ? "This page doesn't exist"
            : "Something went wrong"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {state.status === "not-found"
            ? `No published Hokori page at "${username}".`
            : "Please try again in a moment."}
        </p>
        <Link to="/" className="mt-2 text-sm underline underline-offset-4">
          Claim this page on Hokori
        </Link>
      </div>
    );
  }

  const { payload } = state;
  const theme = themes[payload.theme];
  const title = payload.profile
    ? `${payload.profile.name} — ${payload.profile.title}`
    : `@${payload.username} — Hokori`;

  return (
    <div className="h-dvh w-full">
      <Helmet>
        <title>{title}</title>
        {payload.profile?.bio && (
          <meta name="description" content={payload.profile.bio} />
        )}
        <meta property="og:title" content={title} />
        {payload.profile?.bio && (
          <meta property="og:description" content={payload.profile.bio} />
        )}
        {payload.profile?.avatarUrl && (
          <meta property="og:image" content={payload.profile.avatarUrl} />
        )}
      </Helmet>
      <theme.Shell>
        {payload.blocks.map((config) => {
          const data =
            config.type === "PersonalInfo" ? payload.profile : payload.skills;
          return renderBlock(theme, { ...config, data } as Block);
        })}
      </theme.Shell>
    </div>
  );
}
