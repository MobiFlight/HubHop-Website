# HubHop Website

The website for [HubHop](https://hubhop.mobiflight.com), the [MobiFlight](https://www.mobiflight.com) community
database of flight-simulator presets for MSFS 2020 and X-Plane. Browse, search, add, edit, report and export presets.

Built with Next.js (static export), React, Tailwind CSS and Dexie, and deployed to Azure Static Web Apps.
Login uses Azure AD B2C via MSAL.

## Getting started

The recommended setup is the **devcontainer**: open the repository in VS Code and choose
_Reopen in Container_, or use GitHub Codespaces. It installs Node, the GitHub and Azure CLIs, Claude Code,
the recommended editor extensions, and all npm dependencies.

```sh
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
npm run type-check   # TypeScript check
npm run format       # Prettier
npm run test:e2e     # Playwright end-to-end tests
```

The site runs against the production HubHop API. Configuration comes from the public `NEXT_PUBLIC_*`
variables in `.env`. Everything in it is public, so never add secrets there.

Tests are described in [tests/README.md](tests/README.md).

## Contributing

- Never push to `main`. Create a branch (`<issue-number>/<descriptive-name>`) and open a pull request.
- Fill in the pull request template. Every PR gets an Azure Static Web Apps preview deployment.
- Guidelines for humans and AI agents are in [AGENTS.md](AGENTS.md) and [.github/instructions/](.github/instructions/).
