---
description: "Next.js / React development standards for the HubHop website"
applyTo: "**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css"
---

# Next.js / React Development Instructions

## Project Context

- Next.js (pages router) with `output: "export"`: the site is a fully **static export** served by
  Azure Static Web Apps. There is no server: no API routes, no `getServerSideProps`, no middleware.
- `trailingSlash: true`; dynamic data is addressed via query params (e.g. `/preset/?id=<id>&simType=<sim>`), not dynamic routes.
- React with functional components and hooks
- TypeScript in strict mode (legacy code uses `any` liberally; new code should be properly typed)
- Tailwind CSS for styling (some legacy `styled-components` and `framer-motion` usage)
- Dexie (IndexedDB) as client-side preset cache
- MSAL (`@azure/msal-browser`, `@azure/msal-react`) against Azure AD B2C for login
- `react-hook-form` for forms, `react-data-table-component` for tables, `react-toastify` for toasts, `react-icons` for icons

## Directory Map

```
pages/                   # Routes: index, presets, preset (single view), stats, tools, privacy, terms
components/
  Layout.tsx             # Page shell (navbar + footer)
  sections/
    Navbar/, footer/, home/, stats/, tools/
    presets/
      presetTable/       # List view, filters
      singlePresetView/  # Preset detail + history
      ui/                # Preset card and action buttons/modals (add, edit, delete, report, export)
    Shared/              # Buttons, modal, toast, spinner, user dropdown
services/
  db.ts                  # Dexie database (presetsMsfs, presetsXplane, presets tables)
  presetSync.ts          # Keeps the IndexedDB copy of each sim's presets current
  msal.js                # MSAL instance/config
  msalFunctions.js       # Access token + user settings (roles) helpers
lib/Constants.tsx        # Navbar links
interfaces/              # Shared types
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
- UI permissions are checked with `localStorage.getItem("roles")` (e.g. only `moderator` may edit System/PresetType).
  The API enforces permissions; UI checks are convenience only.

### Configuration

- All runtime configuration is `NEXT_PUBLIC_*` env vars from the committed `.env` (used by dev, build and tests,
  inlined into the JavaScript at build time): OAuth settings, `NEXT_PUBLIC_HUBHOP_API_BASEURL`, stats and "last" endpoints.
  Everything in `.env` is public. **Never put secrets there.** Use a gitignored `.env.local` for personal overrides.
- Because the site is static, code that touches `window`, `localStorage` or IndexedDB must run on the client only
  (inside `useEffect` or event handlers).

## Development Standards

- Prefer TypeScript for new and touched files; convert `.js` files when reasonable.
- Use functional components and hooks; keep components small and single-purpose.
- Use Tailwind for new styling; do not add new `styled-components`.
- Reuse existing shared components in `components/sections/Shared/` before creating new ones.
- Handle loading, error and empty states for every API call.
- Use semantic HTML and accessible names (labels, `aria-*`, alt text) so components are reachable via role-based Playwright locators.
- Add `data-testid` only when a role/label/text locator is not possible.
- Add or update Playwright tests in `tests/` for every user-facing change (see `tests/README.md`).
- Use `useEffect` with correct dependency arrays and clean up listeners/timers.

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
