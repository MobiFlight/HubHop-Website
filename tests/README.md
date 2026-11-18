# HubHop Website Tests

End-to-end tests for the HubHop website, using [Playwright](https://playwright.dev/).
Conventions follow MobiFlight-Connector; see
[.github/instructions/playwright.instructions.md](../.github/instructions/playwright.instructions.md).

## Structure

- **`*.spec.ts`**: one spec per feature or page (`PresetList`, `PresetView`, `AddPreset`, `EditPreset`, ...).
- **`fixtures.ts`**: extends Playwright's `test` with the page objects below.
- **`fixtures/HubHopPage.ts`**: base page object. It mocks the HubHop API with the test data,
  records write requests (`writeRequests()`), counts full preset downloads and can log in (`login(roles)`).
- **`fixtures/FakeIdentityProvider.ts`**: a minimal OpenID Connect provider that answers the login service's
  endpoints (OpenID configuration, authorize, token, logout). The app's real MSAL login code runs against it.
- **`fixtures/PresetsPage.ts`, `fixtures/PresetViewPage.ts`**: page objects with locators and actions.
- **`auth.setup.ts`**: logs in through the UI and saves storage states in `.auth/` (gitignored) for the test
  personas `anonymous`, `user` and `moderator`. The role comes from the mocked `/settings/user` API.
  MSAL encrypts its cache with a key kept in a session cookie; the storage states contain both.
- **`data/*.testdata.json`**: synthetic API responses (presets, "last" stamps, statistics, history).

Tests never call the real HubHop API or login service. API requests are answered from `data/` (404 for
anything that isn't mocked); login requests are answered by the fake identity provider. The test server
uses `http://localhost:3000/` as OAuth redirect URI (set in `playwright.config.ts`).

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
- Tests start with the cookie banner answered ("rejected"). Use `test.use({ cookieConsent: "unset" })` or
  `"accepted"` to test the banner; requests to Google Tag Manager (container `GTM-TEST`, set in `playwright.config.ts`) are mocked and listed in `hubHopPage.tagManagerRequests`.
- Change mocked data per test through `hubHopPage.api` (e.g. add a preset, change `writeStatus`).
- Assert on write operations through the recorded requests instead of server state:
  `expect.poll(() => hubHopPage.writeRequests("PUT")).toHaveLength(1)`.
- Navigate with `hubHopPage.goto()`, which waits for React hydration before the test interacts with the page.
