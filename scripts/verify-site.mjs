import { verifyGeneratedSite } from "./verify-site-lib.mjs";

const failures = verifyGeneratedSite(process.cwd());

if (failures.length > 0) {
  console.error(`Generated-site verification failed (${failures.length}):`);
  for (const failure of failures) {
    console.error(`\n[FAIL] ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Current bilingual research publication verified; archived articles remain private.");
}
