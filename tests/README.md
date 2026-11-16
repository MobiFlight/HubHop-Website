# HubHop Website Tests

End-to-end tests for the HubHop website, using [Playwright](https://playwright.dev/).
Conventions follow MobiFlight-Connector; see
[.github/instructions/playwright.instructions.md](../.github/instructions/playwright.instructions.md).

## Structure

- **`*.spec.ts`**: one spec per feature or page (`PresetList`, `PresetView`, `AddPreset`, `EditPreset`, ...).
- **`fixtures.ts`**: extends Playwright's `test` with the page objects below.
- **`fixtures/HubHopPage.ts`**: base page object. It mocks the HubHop API with the test data,
  blocks the B2C login, records write requests (`writeRequests()`) and counts full preset downloads.
- **`fixtures/PresetsPage.ts`, `fixtures/PresetViewPage.ts`**: page objects with locators and actions.
- **`auth.setup.ts`**: creates storage states in `.auth/` (gitignored) for the test personas:
  `anonymous`, `user` and `moderator`. Logged-in states are a fake MSAL session, so no credentials are needed.
- **`data/*.testdata.json`**: synthetic API responses (presets, "last" stamps, statistics, history).

Tests never call the real HubHop API. Every request to it is answered from `data/`, or with a 404
for anything that isn't mocked.

## Running the tests

Inside the devcontainer, Playwright and Chromium are installed automatically.

```sh
npm run test:e2e         # all tests (starts the dev server if it isn't running)
npm run test:e2e:ui      # Playwright UI mode
npx playwright test PresetList   # a single spec
```

You can also use the Playwright extension for VS Code.

Outside the devcontainer, install the browser first:

```sh
npm install
sudo npx playwright install-deps chromium
npx playwright install chromium
```

## Writing tests

- Use the personas: `test.use({ storageState: authFile.user })` (or `moderator`). The default is anonymous.
- Change mocked data per test through `hubHopPage.api` (e.g. add a preset, change `writeStatus`).
- Assert on write operations through the recorded requests instead of server state:
  `expect.poll(() => hubHopPage.writeRequests("PUT")).toHaveLength(1)`.
- Navigate with `hubHopPage.goto()`, which waits for React hydration before the test interacts with the page.
