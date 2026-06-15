/**
 * Test runner — discovers and runs every scripts/test-*.mjs in alphabetical
 * order. Add a new test-*.mjs file and it will be picked up automatically.
 *
 * Exit code: 0 if all pass, 1 on the first failure.
 */

import { readdirSync } from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = readdirSync(__dirname)
  .filter((f) => f.startsWith("test-") && f.endsWith(".mjs"))
  .sort();

if (files.length === 0) {
  console.log("No test-*.mjs files found in scripts/");
  process.exit(0);
}

let allPassed = true;

for (const file of files) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`▶  ${file}`);
  console.log("─".repeat(60));

  const result = spawnSync("node", [path.join(__dirname, file)], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    allPassed = false;
    break;
  }
}

console.log(`\n${"═".repeat(60)}`);
console.log(allPassed ? "✅  All test suites passed" : "❌  Test suite failed");
process.exit(allPassed ? 0 : 1);
