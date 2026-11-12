import { spawn } from "node:child_process";
import { closeSync, openSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";

const sleep = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function isAsterward(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(500) });
    if (!response.ok) return false;
    return (await response.text()).includes("ASTERWARD");
  } catch {
    return false;
  }
}

export async function findPreviewServer(
  urls = Array.from({ length: 10 }, (_value, index) => `http://127.0.0.1:${4321 + index}`)
) {
  for (const url of urls) {
    if (await isAsterward(url)) return url;
  }
  return null;
}

async function freePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolvePromise(address.port));
    });
  });
}

export async function waitUntilReady(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isAsterward(url)) return;
    await sleep(100);
  }
  throw new Error(`無法啟動本機網站：${url}`);
}

export async function startPreviewServer({
  nodePath = process.execPath,
  astroCli = resolve("node_modules/astro/bin/astro.mjs"),
  cwd = resolve("."),
  logPath = "/private/tmp/asterward-local-preview.log",
  timeoutMs = 20_000
} = {}) {
  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const log = openSync(logPath, "a");
  const child = spawn(nodePath, [astroCli, "dev", "--host", "127.0.0.1", "--port", String(port)], {
    cwd,
    detached: true,
    stdio: ["ignore", log, log],
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" }
  });
  closeSync(log);
  const launchFailure = new Promise((_resolve, reject) => {
    child.once("error", (error) => reject(error));
  });
  try {
    await Promise.race([waitUntilReady(baseUrl, timeoutMs), launchFailure]);
  } catch (error) {
    if (child.pid && child.exitCode === null) child.kill("SIGTERM");
    throw new Error(`無法啟動本機網站：${error.message}`);
  }
  child.unref();
  return { baseUrl, pid: child.pid, logPath };
}

export function articleUrl(baseUrl, slug) {
  return `${baseUrl.replace(/\/$/, "")}/trends/${encodeURIComponent(slug)}/`;
}
