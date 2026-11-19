import { defineConfig, devices } from "@playwright/test"

const getWorkerSetting = (value: string | undefined) => {
  // we support percentage values for workers, e.g., "50%"
  if (value?.endsWith("%")) return value

  // or a numeric value
  return value ? Number(value) : 1
}

const playwrightWorkers = process.env.CI
  ? getWorkerSetting(process.env.CI_WORKERS)
  : undefined

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* The dev server compiles pages on first use, which can take a few seconds */
  expect: { timeout: 10 * 1000 },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: playwrightWorkers,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "list" : "html",
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    // Emulates `'prefers-colors-scheme'` media feature.
    colorScheme: "light",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // wide enough for the desktop navigation (xl breakpoint)
        viewport: { width: 1440, height: 900 },
        storageState: "./tests/.auth/anonymous.json",
      },
      dependencies: ["setup"],
    },
    // Setup project
    { name: "setup", testMatch: /.*\.setup\.ts/ },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    env: {
      // the login popup must return to the test server, not to production
      NEXT_PUBLIC_HUBHOP_OAUTH_REDIRECT_URI_DEV: "http://localhost:3000/",
      // test container, requests to Google Tag Manager are mocked
      NEXT_PUBLIC_GTM_ID: "GTM-TEST",
      // the same footer ("Build dev") locally and on CI, for screenshot tests
      GITHUB_RUN_NUMBER: "",
      GITHUB_SHA: "",
    },
    url: "http://localhost:3000/",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
