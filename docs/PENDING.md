# Hokori — What's Pending

Status as of 2026-06-12. Companion to [V1-PLAN.md](./V1-PLAN.md); this is the
short list of what stands between today and shipping, then what comes after.

## Ship blockers (do these, then launch)

- [ ] **Deploy** — server + Postgres + web on real infra, custom domain, HTTPS.
      Production env vars (`NODE_ENV=production`, real `CLIENT_URL`, strong JWT
      secrets, ImageKit keys). Server-side proxy/cookie/CORS prep is done
      (trust proxy, SameSite=None cookies in prod, comma-separated CLIENT_URL).
- [ ] **Manual QA walkthrough** — fresh signup → build page (all four blocks)
      → reorder/hide → theme switch → publish → open `/username` logged out
      and on a phone. Much of the recent UI is typecheck-verified only.
- [x] **Placeholder pages** — Templates and Insights now show an honest
      "still cooking" state instead of fake empty states.

## Known imperfections — OK to ship, decide consciously

- [ ] Social-share previews (OG tags) won't render for scrapers — SPA, no SSR.
      Mitigation lands with the Phase 5 OG-image endpoint.
- [ ] Avatar upload in the profile form can orphan an ImageKit file when the
      dialog is cancelled after upload (banner + resume already have the fix;
      port the session-cleanup pattern).
- [ ] No error monitoring (Sentry) — you won't see production errors without it.
- [ ] No tests / CI runs typecheck+build only.
- [ ] Access token in localStorage (XSS exposure) — revisit with a refresh
      rework later.
- [ ] Tab-hidden validation errors in the profile dialog (error in a tab you're
      not viewing only blocks save silently; needs an error dot on the tab).
- [ ] Live username-availability check in the signup form (server enforces
      reserved/format rules; the form doesn't check as you type).

## Phase 3 — Developer stats & integrations (post-launch)

- [ ] Wire Redis + BullMQ (refresh jobs, caching).
- [ ] GitHub stats block (public API, cached server-side).
- [ ] LeetCode stats block (unofficial GraphQL, fail-soft adapter).
- [ ] Book-a-call block (Cal.com/Calendly embed URL).

## Phase 4 — Testimonials

- [ ] `Testimonial` + `TestimonialRequest` models, tokenized request link,
      public submit form at `/t/:token`, owner approve/reject, themed renderer.
- [ ] Anti-abuse: single-use tokens, expiry, rate limit on submit.

## Phase 5 — Polish, insights & launch hardening

- [ ] Two more themes; theme accent customization (`--pv-*` vars in Shells).
- [ ] Insights page: page-view counter + referrers (`PageView` table).
- [ ] Settings page: change username/password/email, delete account.
- [ ] Server-generated OG share image per profile.
- [ ] Profile completeness meter in dashboard.
- [ ] QR-code share button.
- [ ] Sentry on web + server; uptime check on the public endpoint.
- [ ] Landing page final pass, readme update, V1 tag.

## Small cleanups (whenever)

- [ ] Project `tags` field (deferred from Phase 2).
- [ ] Per-field URL validation feedback on the Socials tab (currently
      normalized on save; server catches invalid).
- [ ] Code-split the 660 kB main chunk further (motion + icons are the bulk).
- [ ] `errorHandler` returns raw error messages on 500s; sanitize for prod.
