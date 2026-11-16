# Copilot Instructions

## About this project

HubHop (https://hubhop.mobiflight.com) is the MobiFlight community database of flight-simulator
presets (MSFS 2020 and X-Plane). This repository is the website: browse, search, view, add, edit,
report and export presets. Data comes from the HubHop API; this repo contains no backend.

## Git workflow

- **Never push to `main`.** Work on a feature branch and open a pull request; maintainers merge.
- Branch names: `<issue-number>/<descriptive-name>` when an issue exists, otherwise `<type>/<descriptive-name>` (e.g. `chore/update-deps`).
- Do not add `Co-Authored-By` or other attribution trailers to commit messages, and no "Generated with ..." footers in PR descriptions.
- Keep PRs focused: one concern per PR. Fill in `.github/pull_request_template.md`.

## Commands

| Command                | Purpose                             |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Dev server on http://localhost:3000 |
| `npm run build`        | Static export to `out/`             |
| `npm run type-check`   | TypeScript check (`tsc`)            |
| `npm run format`       | Format all files with Prettier      |
| `npm run format:check` | Check formatting (CI)               |
| `npm run test:e2e`     | Playwright end-to-end tests         |
| `npm run test:e2e:ui`  | Playwright UI mode                  |

Before pushing, run `npm run format:check`, `npm run type-check`, `npm run build` and `npm run test:e2e`.

The devcontainer provisions all tooling (Node, gh, az, Claude Code, editor extensions).
Add new tooling to `.devcontainer/devcontainer.json` rather than documenting manual installs.

## Definition of Done for MobiFlight PRs

### General Guidelines

- Follow existing design patterns and architecture
- Consistent with existing code style and conventions
- Backward compatibility unless a breaking change is explicitly intended; use migration routines where necessary (e.g. Dexie schema versions)
- Create tests to cover existing functionality BEFORE starting code refactoring
  - Use descriptive test names
  - Do not use decorative divider comments

### Pull request checklist

Always check for the following items before marking a PR as ready to merge, if applicable:

- PR description is clear, provides context and serves as release notes for end users
- PR description describes the problem being solved and the feature being added
- PR description "fixes" or "closes" related issues
- PR description mentions any breaking changes
- PR description provides a section with technical details of the implementation
- PR description includes screenshots or screen recordings for UI changes
- All new code is covered by end-to-end tests where applicable
- All existing and new tests pass successfully
- Add label `docs` if documentation updates are required
