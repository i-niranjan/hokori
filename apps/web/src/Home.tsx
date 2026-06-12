import { Link } from "react-router";
import { Button } from "./components/ui/button";
import { IconArrowUpRight } from "@tabler/icons-react";
import HomeNavbar from "./components/homeNavbar";
import { Card } from "./components/ui/card";

const features = [
  {
    title: "Your Profile",
    desc: "A single page that introduces you, your way.",
  },
  {
    title: "Your Story",
    desc: "Long-form sections for the work behind the work.",
  },
  {
    title: "Your Work",
    desc: "Showcase projects, links, and what you're proud of.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <HomeNavbar />
      </div>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Pride in your journey
          </span>
          <h1 className="font-display text-5xl font-medium leading-[1.04] tracking-tight md:text-7xl">
            A profile for
            <br />
            the work you&apos;re
            <br />
            <em className="font-light text-primary">proud of</em>
            <span className="text-primary">.</span>
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Hokori is a quiet, opinionated home for developers, designers,
            marketers, and creative professionals.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button asChild>
              <Link to="/auth/signup">
                Get started <IconArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <Card className="w-full max-w-sm rounded-md border bg-card p-6 shadow-none">
            <div className="flex items-baseline justify-between border-b pb-3">
              <span className="font-display text-sm font-semibold">
                hokori<span className="text-primary">.</span>
              </span>
              <span className="font-display text-xs text-muted-foreground">
                誇り
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="size-12 rounded-full bg-muted" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Your name</span>
                <span className="text-xs text-muted-foreground">
                  Your title
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-muted-foreground">
              "Small steps build a future you're proud of."
            </p>
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <div className="size-2 rounded-full bg-primary" aria-hidden />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                preview
              </span>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <h3 className="font-display text-lg font-semibold">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t px-6 py-8">
        <p className="text-xs text-muted-foreground">
          © Hokori · 誇り — Pride in your journey.
        </p>
      </footer>
    </div>
  );
}

export default Home;
