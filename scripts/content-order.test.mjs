import assert from "node:assert/strict";
import test from "node:test";

import { sortByDateDesc } from "../src/lib/content.ts";

test("same-day articles have a deterministic order on every filesystem", () => {
  const date = new Date("2026-11-12T00:00:00Z");
  const crisis = { id: "2026-11-12-2008.md", data: { date } };
  const rwa = { id: "2026-11-12-rwa.md", data: { date } };

  const forward = sortByDateDesc([crisis, rwa]).map((entry) => entry.id);
  const reverse = sortByDateDesc([rwa, crisis]).map((entry) => entry.id);

  assert.deepEqual(forward, [crisis.id, rwa.id]);
  assert.deepEqual(reverse, [crisis.id, rwa.id]);
});
