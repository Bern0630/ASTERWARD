import assert from "node:assert/strict";
import test from "node:test";

import { formatDate, sortByDateDesc } from "../src/lib/content.ts";

test("same-day articles have a deterministic order on every filesystem", () => {
  const date = new Date("2026-11-12T00:00:00Z");
  const crisis = { id: "2026-11-12-2008.md", data: { date } };
  const rwa = { id: "2026-11-12-rwa.md", data: { date } };

  const forward = sortByDateDesc([crisis, rwa]).map((entry) => entry.id);
  const reverse = sortByDateDesc([rwa, crisis]).map((entry) => entry.id);

  assert.deepEqual(forward, [crisis.id, rwa.id]);
  assert.deepEqual(reverse, [crisis.id, rwa.id]);
});

test("publication dates use the Taiwan calendar day on every runner", () => {
  const previousTimeZone = process.env.TZ;
  process.env.TZ = "UTC";

  try {
    assert.equal(
      formatDate(new Date("2026-10-16T04:00:00+08:00")),
      "OCT 16, 2026"
    );
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});
