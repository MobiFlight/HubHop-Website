---
description: "Next.js / React development standards for the HubHop website"
applyTo: "**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css"
---

# Next.js / React Development Instructions

## Project Context

- Next.js (pages router) with `output: "export"`: the site is a fully **static export** served by
  Azure Static Web Apps. There is no server: no API routes, no `getServerSideProps`, no middleware.
- `trailingSlash: true`. Presets have path URLs (`lib/presetUrls.ts`): `/presets/<sim>/<vendor>/<aircraft>/` for the list,
  `/presets/<sim>/<vendor>/<aircraft>/<label>-<id>/` for one preset; search and other filters are query parameters.
  `pages/presets/[[...slug]].tsx` is exported once and served for every `/presets/*` path by a rewrite in
  `staticwebapp.config.json`. Pages pass context (sim, filters) to each other through these URLs, not `localStorage`.
- Aircraft cheat sheets (`lib/aircraftPages.ts`) are real static pages for search engines, generated at build time
  from the full preset list (`services/libraryStats.ts#loadPresets`): `/aircraft/<sim>/` (index), `/aircraft/<sim>/<vendor>/<aircraft>/`
  (up to 30 presets per system) and `/aircraft/<sim>/<vendor>/<aircraft>/<system>/` for larger systems. Cheat sheets with fewer
  than 10 presets are `noindex`. The site is rebuilt to pick up new presets.
- Search engines: pages pass `title`, `description`, `path` (canonical URL, `og:url`) and `noindex` to `Layout`, which writes
  the meta and Open Graph tags; don't add them per page. `npm run build` also runs `scripts/sitemap.mjs`, which writes
  `out/sitemap.xml` (every page with a canonical URL that isn't `noindex`) and `out/robots.txt`. Page texts for search
  results are templates in `lib/aircraftPages.ts`; write them for home cockpit builders. See `docs/search-console.md`.
- React with functional components and hooks
- TypeScript in strict mode (legacy code uses `any` liberally; new code should be properly typed)
- Tailwind CSS v4 with shadcn/ui (Radix, style `radix-vega`, see `components.json`) and Tabler icons (`@tabler/icons-react`)
- Dexie (IndexedDB) as client-side preset cache
- MSAL (`@azure/msal-browser`, `@azure/msal-react`) against Azure AD B2C for login
- `react-hook-form` with zod for forms, the shared `DataTable` for preset lists, Sonner for toasts

## Directory Map

```
pages/                   # Routes: index, presets/[[...slug]] (list and single preset), preset (old links), aircraft/[sim]/… (cheat sheets), stats, tools, privacy, terms
components/
  ui/                    # shadcn/ui components (added with the shadcn CLI, adapted to HubHop's look)
  Layout.tsx             # Page shell (navbar + footer)
  sections/
    Navbar/, footer/, home/, aircraft/, stats/, tools/
    presets/
      presetTable/       # List view, filters
      singlePresetView/  # Preset detail + history
      ui/                # Preset card and action buttons/modals (add, edit, delete, report, export)
    Shared/              # DataTable, ComboBox, Modal, SimSwitch, promotions, cookie consent
services/
  db.ts                  # Dexie database (presetsMsfs, presetsXplane, presets tables)
  presetSync.ts          # Keeps the IndexedDB copy of each sim's presets current
  msal.js                # MSAL instance/config
  msalFunctions.js       # Access token + user settings (roles) helpers
  roles.ts               # isModerator() for UI permission checks
lib/
  Constants.tsx          # Navbar links
  presetSearch.ts        # Search, relevance and default order; shared with MobiFlight Connector
  presetUrls.ts          # Preset list and preset URLs, slugs
  aircraftPages.ts       # Aircraft cheat sheets: grouping, limits, URLs
  presetFacets.ts        # Faceted filter options
  presetTypes.ts         # Fixed Input/Output values per sim
  codeTypes.ts           # Fixed X-Plane code types
  features.ts            # Feature flags (e.g. REPORTING_ENABLED)
interfaces/
  preset.ts              # Preset, history and statistics types of the HubHop API
public/                  # Static assets
```

## Key Mechanics

### Preset data and caching

- The full preset list per sim is downloaded once and stored in IndexedDB (`services/db.ts`).
- `services/presetSync.ts#syncSim(sim)` compares the server's latest `createdDate`
  (`NEXT_PUBLIC_HUBHOP_API_LAST_*`) with a stamp in `localStorage` (`syncedMsfs` / `syncedXplane`)
  and only re-downloads when the server has newer data. Only one sync per sim runs at a time.
- Sim keys are `msfs2020` and `xplane`.

### Authentication and roles

- Login via MSAL v4 (B2C, popup flow). `services/msal.js` exports `msalInstance` and `msalReady`;
  **await `msalReady` before calling `msalInstance` directly** (MSAL must be initialized first).
  `MsalProvider` initializes it too. MSAL encrypts its `localStorage` cache with a session-cookie key,
  so users have to log in again after a browser restart.
- The access token is stored in `localStorage.accessToken`.
- `getUserSettings()` loads the user's roles from the API into `localStorage.roles`; logged-out users get `"Guest"`.
- UI permissions are checked with `isModerator()` from `services/roles.ts`, which reads `localStorage.roles`. The API enforces permissions; UI checks are convenience only.
- Who may create new values: vendor and aircraft everyone; system moderators only (moderators are admins);
  Input/Output and Code Type nobody. These are fixed lists in `lib/presetTypes.ts` and `lib/codeTypes.ts`.

### Analytics and cookie consent

- Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) comes from the GitHub repository variable `PUBLIC_GTM_ID` and is set only for production builds in the deployment workflow,
  so dev, PR previews and tests don't send data (tests use `GTM-TEST`). It loads only after the visitor accepted the "analytics"
  category (Consent Mode v2 "basic", ad signals always denied).
- The consent dialog is vanilla-cookieconsent, configured like mobiflight.com (`MobiFlight/mobiflight-website`,
  `astro/src/components/mobiflight/consent/`): `lib/cookieConsent.ts` (config and texts in en/de/es),
  `components/sections/Shared/CookieConsent.tsx` (runs it, loads GTM), colors in `styles/globals.css` (`#cc-main`).
  The choice is stored in the cookie `hubhop_cookie_consent` for a year (mobiflight.com's `mf_cookie_consent` is set for
  the whole domain, so HubHop needs its own name). "Cookie settings" in the footer opens the preferences.
- Send events with `track(event, params)` from `services/analytics.ts` (no-op without consent); list each event in `docs/analytics.md`.
- Google Analytics and any other tag are configured in the GTM container, not in code. Non-Google tags in GTM
  need their own consent check, and new tags or cookies need an update of the privacy page.

### Types and shared code

- `interfaces/preset.ts` follows the HubHop API (`PresetDbSchema` in HubHopApi's `model/Preset.ts`, the interface
  next to it is incomplete) and uses the same names and values as MobiFlight Connector's `types/preset.d.ts`.
- `lib/presetSearch.ts` is copied into MobiFlight Connector as is: keep it free of project imports.
- Show preset data as the API returns it: don't merge spellings, trim or deduplicate vendors, aircraft or systems in
  the frontend. Visible duplicates get fixed in the database (issues labelled `data cleanup`).

### Configuration

- All runtime configuration is `NEXT_PUBLIC_*` env vars from the committed `.env` (used by dev, build and tests,
  inlined into the JavaScript at build time): OAuth settings, `NEXT_PUBLIC_HUBHOP_API_BASEURL`, stats and "last" endpoints.
  Everything in `.env` is public. **Never put secrets there.** Use a gitignored `.env.local` for personal overrides.
- Because the site is static, code that touches `window`, `localStorage` or IndexedDB must run on the client only
  (inside `useEffect` or event handlers).

## Development Standards

- Prefer TypeScript for new and touched files; convert `.js` files when reasonable.
- Import project files with absolute paths from the project root (`@/components/…`, `@/lib/…`), not relative ones (`../`); ESLint enforces it.
- Use functional components and hooks; keep components small and single-purpose.
- Write components as in MobiFlight: no `React.FC`; a props type named after the component,
  `type PresetCardProps = { … }` and `const PresetCard = ({ … }: PresetCardProps) => {`.
  Declare `children: React.ReactNode` in the props type.
  Props types use `type`, not `interface`.
- Callback props pass values, not React events (e.g. `onLabelChange: (label: string) => void`); only the input
  component itself handles the event.
- Prefer `const` and immutable data over mutable variables (`let`, reassignment, in-place mutation).
  Keep values that must persist across renders in `useRef`/`useState`, not in reassigned locals.
- Use Tailwind with the theme tokens (`bg-primary`, `text-muted-foreground`, `border-border`, …); no hard-coded colors.
- Reuse existing shared components in `components/sections/Shared/` before creating new ones.
- Handle loading, error and empty states for every API call.
- Use semantic HTML and accessible names (labels, `aria-*`, alt text) so components are reachable via role-based Playwright locators.
- Add `data-testid` only when a role/label/text locator is not possible.
- Add or update Playwright tests in `tests/` for every user-facing change (see `tests/README.md`).
- Use `useEffect` with correct dependency arrays and clean up listeners/timers.

## UI components and theme

- Use shadcn/ui components from `components/ui/` and Tabler icons; add missing ones with
  `npx shadcn@latest add <component> --overwrite` (without `--overwrite` the CLI waits at a hidden prompt when a
  dependency already exists) and run `npm run format` afterwards.
- The theme is shadcn's default (base color "neutral") with HubHop's brand colors on top, in `styles/globals.css`.
  Prefer theming over one-off styles; adapt a shadcn component in its file or with a thin wrapper when HubHop's look
  differs (e.g. orange field borders, small label gap).
- HubHop is dark-only for now (`<html class="dark">` in `pages/_document.tsx`); the light theme follows in #165.
- Shared building blocks: `DataTable` (grid with table roles, sorting, pagination, expandable rows), `ComboBox`
  (Popover + Command, as in MobiFlight Connector), `Modal` (Dialog wrapper), `SimSwitch`.
- Use `table` only for tabular data; details and forms use flex or grid.

## Performance and library pitfalls

- The preset list holds about 35,000 presets. Don't repeat expensive work on every render (sort once when the
  data changes, compute per-preset values once per render).
- Sort text with `compareText` from `lib/presetSearch.ts` (a shared `Intl.Collator`). `localeCompare` with
  options creates a collator per comparison and is about 50 times slower.
- `DataTable` sorts when its data or columns change: memoize the column list (`useMemo`), otherwise every
  render re-sorts all presets.
- Define the expandable row component outside the render function; a new component identity remounts open rows.

## Code Style

- Prettier 3 with `prettier-plugin-tailwindcss` (auto-sorted Tailwind classes), config in `.prettierrc`:
  no semicolons, double quotes. Same style as other MobiFlight projects.
- Format on save is enabled in the devcontainer; `npm run format:check` must pass.
- ESLint (`eslint.config.mjs`: Next.js core-web-vitals + TypeScript rules, Prettier-compatible): `npm run lint` must report no errors.
  `any`, `Function` types and missing hook dependencies are warnings in legacy code; do not add new ones.

## Deployment

- `.github/workflows/azure-static-web-apps-*.yml` builds and deploys `out/` to Azure Static Web Apps on push to `main`,
  and creates a preview environment per PR.
- `staticwebapp.config.json` controls headers, caching and the 404 rewrite.
