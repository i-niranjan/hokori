# Hokori V1 — Development Plan

Goal: a creator signs up, composes their page from blocks, picks a theme, and shares
`hokori.app/username` — a fast, credible public profile. Everything in this plan is
sequenced so the product is **live and shareable after Phase 1**, and every later phase
only adds blocks/credibility on top of a working loop.

Status legend: ✅ exists today · 🔶 partially exists · ⬜ not started

---

## Current state (June 2026)

| Area | Status |
|---|---|
| Auth (JWT + refresh, signup/login, guard) | ✅ |
| Profile (PersonalInfo) CRUD + ImageKit avatar | ✅ |
| Dashboard editor + live preview module, 2 themes (minimal, terminal), theme controller | ✅ |
| Typed `blocks[]` in Redux as single source of truth | ✅ |
| `Project`, `Skill` Prisma models | 🔶 models only — no routes, no UI |
| Template / Insights / Settings pages | 🔶 placeholders |
| Public profile page (`/:username`) | ⬜ |
| Page config persistence (block order/visibility, theme) | ⬜ |
| Redis + BullMQ (in stack readme) | ⬜ not wired |

---

## Scope rulings (trims & substitutions)

The readme's V1 list is too large to ship. Rulings:

- **Behance/Dribbble "integration"** → V1 ships them as *social links + manually added
  projects*. Dribbble's API requires app approval and Behance's API is effectively dead.
  True embeds are post-V1.
- **Blogs / articles / case studies** → **cut from V1.** This is a CMS — a project of its
  own. Post-V1. (Case-study-as-project: the Projects block gets a long-description field,
  which covers 80% of the need.)
- **Calendar connections** → V1 = a "Book a call" block that embeds a Cal.com/Calendly
  link the user pastes. No OAuth calendar integration in V1.
- **Testimonials** → stays in V1 (it's the differentiator), but the request flow is
  link-based, no email sending in V1.

---

## Phase 0 — Foundation hardening (~1 week)

Make the base production-grade before building on it.

- [x] **`Page` model** (Prisma): `{ id, userId, theme, published, blocks Json }` where
      `blocks` is the ordered `[{ id, type, visible }]` skeleton (block *data* stays in
      its own tables). Endpoints: `GET/PUT /page`. Hydrate Redux from it on dashboard load;
      persist `activeTheme` here (closes the known gap: theme currently resets on reload).
- [x] **Validation & safety on server**: zod request validation middleware, `helmet`,
      rate limiting on auth routes, central env validation (fail fast on missing vars).
- [x] **Shared types discipline**: move `Block`, `BlockType`, `ThemeId` into
      `packages/types` so server and web share one contract.
- [x] **Web hygiene**: route-level code splitting (`React.lazy`) — the bundle is 813 kB;
      Axios error interceptor with consistent toasts. *(splitting done: 813→666 kB; also
      fixed the store/authSlice/refresh circular import)*
- [x] **CI**: GitHub Action running `turbo build` + typecheck on PR.

## Phase 1 — Tracer bullet: the public profile is LIVE (~1–2 weeks)

The product exists at the end of this phase. Everything else is iteration.

- [x] **Public read API**: `GET /public/:username` — no auth — returns profile + page
      config + (later) skills/projects in one payload. 404 when unpublished.
- [x] **Public route** `/:username` in the web app rendering the **same
      `models/preview` themes** (they're pure props-in components by design — this is
      why). Promote `models/preview` → `packages/preview` only if/when a separate public
      app appears; for now one app, two routes.
- [x] **Publish toggle** in dashboard (writes `Page.published`).
- [x] **Username claim UX**: reserved-words list + format rules enforced server-side.
      *(live availability check in the signup form still pending)*
- [x] **SEO minimum**: `react-helmet-async` title/description/OG tags per profile.
      (SSR/prerender is post-V1; OG tags from an SPA are imperfect — accept for V1,
      mitigate with the OG-image endpoint in Phase 5.)
- [ ] **Deploy**: server + Postgres + web on real infra, custom domain, HTTPS.
      Smoke-test the full loop: signup → edit → publish → share link.

## Phase 2 — Core blocks (~2–3 weeks)

Each block = Prisma model (+ routes) → editor card (left) → renderer in **both** themes
(the typed `ThemeRenderers` map enforces this at compile time) → entry in `BlockType`.

- [x] **Skills block** — CRUD routes, tag editor (comma/Enter to add, 40 cap, dupe
      check), renderers in both themes. *(icon autocomplete still pending)*
- [x] **Projects block** — CRUD routes, add/edit dialog with ImageKit banner upload and
      long description, detail popup on the page (banner, summary, full story, visit),
      card renderers in both themes, orphaned-file cleanup. *(tags still pending)*
- [x] **Block composition UI** *(added beyond plan)* — picker modal with custom SVG
      glyphs, add/hide/remove per block persisted to `Page.blocks`, ghost skeletons in
      preview for empty blocks, new pages start with Profile only.
- [x] **Social links v2** — `SocialLink` table with all 9 platforms, backfill migration,
      legacy Profile columns dropped, all-platform editor in ProfileForm.
- [x] **Resume block** — PDF upload (ImageKit, 8 MB cap), view/replace/remove editor,
      renderers in both themes, server-side file cleanup on replace/delete.
- [x] **Block reordering** — drag-to-reorder via motion Reorder, Profile pinned first,
      persists to `Page.blocks`, preview follows live.

## Phase 3 — Developer stats & integrations (~1–2 weeks)

All read-only public data, fetched server-side and **cached** — never live-proxied per
page view. Wire **Redis + BullMQ** here (repeatable refresh jobs, e.g. every 6 h).

- [ ] **GitHub stats block** — public REST/GraphQL: repos, stars, contribution summary,
      pinned repos. User supplies username only (no OAuth in V1).
- [ ] **LeetCode stats block** — unofficial GraphQL endpoint (solved counts, streak).
      Build behind a thin adapter; it's unofficial and may break — fail soft (hide block).
- [ ] **Book-a-call block** — Cal.com/Calendly URL field + embed renderer.

## Phase 4 — Credibility: testimonials (~1–1.5 weeks)

The "genuine testimonials" differentiator, link-based flow:

- [ ] `Testimonial { id, userId, authorName, authorTitle, authorAvatar?, text, status }`
      + `TestimonialRequest { token, expiresAt }`.
- [ ] Owner generates a request link → public form at `/t/:token` (name, role,
      relationship, text) → lands as `pending` → owner approves/rejects in dashboard →
      approved ones render in the Testimonials block.
- [ ] Anti-abuse: token single-use + expiry, length limits, rate limit on submit.

## Phase 5 — Polish, insights & launch (~1–2 weeks)

- [ ] **Two more themes** (e.g. editorial serif, brutalist) — registry makes this additive.
- [ ] **Theme accent customization** — graduate themes from fixed utilities to
      theme-local CSS vars (`--pv-*`) on the Shell; user picks an accent color.
- [ ] **Insights page (real)** — profile view counter + referrer + simple time-series
      (one `PageView` table, written by the public endpoint, async via queue).
- [ ] **Settings page (real)** — change username/password/email, delete account (cascade).
- [ ] **OG image endpoint** — server-generated share card (`@vercel/og`-style) per profile.
- [ ] **Profile completeness meter** in dashboard ("Add skills → 60% → 80%") to drive
      activation.
- [ ] **QR code** share button for the public URL.
- [ ] **Error monitoring** (Sentry) on web + server; uptime check on the public endpoint.
- [ ] Landing page final pass, readme update, V1 tag.

---

## Suggested additions beyond the readme (included above)

1. Publish/draft toggle (Phase 1) — nobody wants a half-built page live.
2. Profile completeness meter (Phase 5) — activation driver.
3. View analytics powering the existing Insights placeholder (Phase 5).
4. Server-generated OG share image (Phase 5) — the share moment *is* the growth loop.
5. QR code share (Phase 5).
6. Reserved-username protection (Phase 1) — security/abuse necessity.

## Post-V1 parking lot

Blog/CMS · real Dribbble/Behance embeds · calendar OAuth · SSR/prerender for SEO ·
custom domains · template marketplace · multi-page profiles · email sending
(testimonial invites, digests).

## Working agreements

- A block ships only when it renders in **every** theme (compiler enforces via
  `ThemeRenderers`).
- Theme components stay pure (props in, JSX out; no app tokens, no fetching) — they are
  the future `packages/preview`.
- Every new endpoint ships with zod validation + auth middleware decision recorded in
  the route file.
- Deploy at the end of every phase, not at the end of the project.

**Total estimate: ~7–10 weeks solo.** Critical path: Phase 0 → 1; Phases 2–4 blocks are
parallelizable/reorderable; Phase 3 and 4 can swap based on energy.
