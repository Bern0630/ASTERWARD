import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";

import { articleUrl, findPreviewServer, startPreviewServer, waitUntilReady } from "./local-preview.mjs";

async function withServer(body, action) {
  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html" });
    response.end(body);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  try {
    await action(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("finds an existing server only when it is ASTERWARD", async () => {
  await withServer("<title>ASTERWARD</title>", async (baseUrl) => {
    assert.equal(await findPreviewServer([baseUrl]), baseUrl);
  });
  await withServer("<title>Another site</title>", async (baseUrl) => {
    assert.equal(await findPreviewServer([baseUrl]), null);
  });
});

test("waits until a local server responds", async () => {
  await withServer("ASTERWARD", async (baseUrl) => {
    await assert.doesNotReject(waitUntilReady(baseUrl, 500));
  });
});

test("reports a timeout when the server never starts", async () => {
  await assert.rejects(waitUntilReady("http://127.0.0.1:9", 100), /無法啟動本機網站/);
});

test("reports a child-process launch failure without hanging", async () => {
  await assert.rejects(
    startPreviewServer({ nodePath: "/definitely/missing/node", timeoutMs: 100 }),
    /無法啟動本機網站/
  );
});

test("builds an encoded Chinese article URL", () => {
  assert.equal(
    articleUrl("http://127.0.0.1:4321", "2026-11-12-rwa-market"),
    "http://127.0.0.1:4321/trends/2026-11-12-rwa-market/"
  );
});
