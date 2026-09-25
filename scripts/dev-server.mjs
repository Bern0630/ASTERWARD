import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const astroCli = fileURLToPath(
  new URL("../node_modules/astro/astro.js", import.meta.url)
);
const child = spawn(process.execPath, [astroCli, "dev", ...process.argv.slice(2)], {
  stdio: "inherit"
});

let isStopping = false;

function stop(signal) {
  if (isStopping) return;

  isStopping = true;
  if (child.exitCode === null && child.signalCode === null) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

child.on("error", (error) => {
  console.error(`無法啟動開發伺服器：${error.message}`);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (isStopping || signal === "SIGINT" || signal === "SIGTERM") {
    console.log("\n伺服器已關閉");
    process.exit(0);
  }

  process.exit(code ?? 1);
});
