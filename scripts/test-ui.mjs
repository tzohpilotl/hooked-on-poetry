/**
 * UI verification script for hooked-to-poetry.
 * Requires the dev server running on http://localhost:5174
 * Run with: node scripts/verify-ui.mjs
 *
 * Exercises the full user flow:
 *   Poem View → Browse by Author → select letter → open dropdown
 *   → pick author → Read Another Poem → back on Poem View
 */

import { chromium } from "playwright";

const BASE_URL = process.env.APP_URL ?? "http://localhost:5174";
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR ?? "/tmp";
const LETTER = "s";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 800, height: 900 });

// ── helpers ────────────────────────────────────────────────────────────────
let stepNo = 0;
const step = async (label, fn) => {
  stepNo++;
  process.stdout.write(`[${stepNo}] ${label} ... `);
  const result = await fn();
  const ok = result !== false;
  console.log(ok ? "✅" : "❌");
  await page.screenshot({ path: `${SCREENSHOT_DIR}/step${stepNo}-${label.replace(/\s+/g, "-")}.png` });
  return ok;
};

let allPassed = true;
const check = (label, condition) => {
  if (!condition) {
    console.log(`    ⚠  ${label} FAILED`);
    allPassed = false;
  }
  return condition;
};

// ── 1. Initial load: Poem View ─────────────────────────────────────────────
await step("load poem view", async () => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  check("h1 = 'hooked on poetry'", (await page.innerText("h1")).replace(/\s+/g, " ").trim() === "hooked on poetry");
  check("poem author visible", await page.isVisible(".poem__author"));
  check("poem title visible", await page.isVisible(".poem__title"));
  check("Browse by Author button present", await page.isVisible("button:has-text('Browse by Author')"));
  return true;
});

// ── 2. Navigate to Author View ─────────────────────────────────────────────
await step("navigate to author view", async () => {
  await page.click("button:has-text('Browse by Author')");
  await page.waitForTimeout(300);
  const letterBtns = await page.$$(".letter-btn");
  check("26 letter buttons rendered", letterBtns.length === 26);
  check("Authors heading present", await page.isVisible("h2:has-text('Authors')"));
  check("Read Another Poem disabled initially", await page.$eval("button:has-text('Read Another Poem')", (el) => el.disabled));
  return true;
});

// ── 3. Select a letter ────────────────────────────────────────────────────
await step(`select letter ${LETTER.toUpperCase()}`, async () => {
  await page.click(`.letter-btn:has-text("${LETTER.toUpperCase()}")`);
  await page.waitForTimeout(2500); // wait for API response
  const activeEl = await page.$(".letter-btn--active");
  const activeTxt = await activeEl?.textContent();
  check(`letter ${LETTER.toUpperCase()} highlighted`, activeTxt?.toUpperCase() === LETTER.toUpperCase());
  const dropdownTxt = await page.textContent(".author-dropdown__value");
  check("dropdown shows an author (not placeholder)", dropdownTxt !== "Author");
  check("Read Another Poem enabled", !(await page.$eval("button:has-text('Read Another Poem')", (el) => el.disabled)));
  return true;
});

// ── 4. Open the dropdown ──────────────────────────────────────────────────
const dropdownBefore = (await page.textContent(".author-dropdown__value"))?.trim();
await step("open dropdown", async () => {
  await page.click(".author-dropdown__field");
  await page.waitForTimeout(200);
  check("dropdown list appears", await page.isVisible(".author-dropdown__list"));
  const opts = await page.$$(".author-dropdown__option");
  check("at least 1 option in list", opts.length > 0);
  return true;
});

// ── 5. Select a different author ───────────────────────────────────────────
await step("select different author", async () => {
  const options = await page.$$(".author-dropdown__option");
  // pick the last option to ensure it's different from the pre-selected first
  const target = options[options.length - 1];
  const targetTxt = (await target.textContent())?.trim();
  await target.click();
  await page.waitForTimeout(200);
  const dropdownAfter = (await page.textContent(".author-dropdown__value"))?.trim();
  check("dropdown label changed to selected author", dropdownAfter === targetTxt);
  check("dropdown list closed", !(await page.isVisible(".author-dropdown__list")));
  return true;
});

// ── 6. Read Another Poem → navigate back to Poem View ─────────────────────
await step("read poem by author", async () => {
  await page.click("button:has-text('Read Another Poem')");
  await page.waitForTimeout(3500);
  check("back on poem view", await page.isVisible("button:has-text('Browse by Author')"));
  check("poem author displayed", await page.isVisible(".poem__author"));
  return true;
});

// ── 7. Probe: click-outside closes dropdown ────────────────────────────────
await step("probe: click-outside closes dropdown", async () => {
  await page.click("button:has-text('Browse by Author')");
  await page.waitForTimeout(300);
  await page.click(`.letter-btn:has-text("${LETTER.toUpperCase()}")`);
  await page.waitForTimeout(2000);
  await page.click(".author-dropdown__field");
  await page.waitForTimeout(200);
  check("dropdown opens", await page.isVisible(".author-dropdown__list"));
  await page.click("h1"); // click outside
  await page.waitForTimeout(200);
  check("dropdown closes on outside click", !(await page.isVisible(".author-dropdown__list")));
  return true;
});

await browser.close();

console.log("\n" + (allPassed ? "✅ All checks passed" : "❌ Some checks failed"));
process.exit(allPassed ? 0 : 1);
