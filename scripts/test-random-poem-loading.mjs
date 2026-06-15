/**
 * Focused test for the "Random Poem" button loading state.
 *
 * Uses Playwright route interception to hold the /random/1 response
 * mid-flight and assert the button is disabled with "Loading poem…"
 * label while the request is in flight.
 *
 * Run with: node scripts/test-random-poem-loading.mjs
 * Requires the dev server to be running (npm run dev).
 */

import { chromium } from "playwright";

const BASE_URL = process.env.APP_URL ?? "http://localhost:5174";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 800, height: 900 });

let passed = true;
const check = (label, condition) => {
  const ok = Boolean(condition);
  console.log(`  ${ok ? "✅" : "❌"} ${label}`);
  if (!ok) passed = false;
};

// ── setup ─────────────────────────────────────────────────────────────────────

console.log("Setup: load Poem view…");
await page.goto(BASE_URL, { waitUntil: "networkidle" });

// Confirm we start on the poem view with the button available
check(
  '"Random Poem" button present on load',
  await page.isVisible("button:has-text('Random Poem')"),
);

// ── intercept: hold /random/1 responses ──────────────────────────────────────

let releaseRoute;
const routeHeld = new Promise((resolve) => { releaseRoute = resolve; });

await page.route("**", async (route) => {
  if (new URL(route.request().url()).pathname === "/random/1") {
    await routeHeld;
  }
  await route.continue();
});

// ── test ─────────────────────────────────────────────────────────────────────

console.log('\nTest: click "Random Poem" and verify loading state…');
await page.click("button:has-text('Random Poem')");

// Give React one tick to update state
await page.waitForTimeout(100);

const loadingBtn = page.getByRole("button", { name: "Loading poem…" });

check("button label changes to 'Loading poem…'", await loadingBtn.isVisible());
check("button is disabled while loading", await loadingBtn.isDisabled());
check(
  '"Browse by Author" stays enabled during load',
  await page.getByRole("button", { name: "Browse by Author" }).isEnabled(),
);

// Release the held route so the fetch can complete
console.log("\nReleasing held route…");
releaseRoute();

await page.waitForSelector("button:has-text('Random Poem'):not([disabled])", { timeout: 8000 });
check("button returns to 'Random Poem' after response", await page.isVisible("button:has-text('Random Poem')"));
check("poem content is still displayed", await page.isVisible(".poem__title"));

// ── teardown ─────────────────────────────────────────────────────────────────

await browser.close();
console.log("\n" + (passed ? "✅ All checks passed" : "❌ Some checks failed"));
process.exit(passed ? 0 : 1);
