# ASTERWARD

ASTERWARD is a bilingual, content-first market research publication built with Astro.

## Current editorial state

The original daily intelligence library has been removed from the public build while the research format is redesigned. No archived article is deleted. The complete first version is preserved under:

```text
OLD_VERSION/
```

New public research uses the active Astro Content Collection:

```text
src/content/trends/
```

The previous `briefs`, `crossignal`, `second-order`, and `deep-dives` collections and routes are paused. Their source files remain under `OLD_VERSION/`; do not move them back into the active site unless an archived article is intentionally republished after editorial review.

## Architecture

- Astro
- TypeScript
- Astro Content Collections
- Markdown / MDX-ready
- Static GitHub Pages deployment

## Local development

### macOS：第一次安裝

這是 Node.js／Astro 專案。請勿使用 `pip install pnpm`；`pip` 安裝的是同名的 Python 套件，並不是本專案需要的 pnpm。

先在 Terminal 安裝 Node.js 與 pnpm：

```bash
brew install node pnpm
```

關閉 Terminal 並重新開啟，確認兩者都能使用：

```bash
node --version
pnpm --version
```

接著進入專案並安裝套件：

```bash
cd ~/Desktop/ASTERWARD
pnpm install --frozen-lockfile
```

這些安裝步驟通常只需執行一次。只有 `package.json` 或 `pnpm-lock.yaml` 更新時，才需要重新執行 `pnpm install --frozen-lockfile`。

### 每次在本機開啟網站

```bash
cd ~/Desktop/ASTERWARD
pnpm run dev
```

Terminal 顯示本機網址後，以瀏覽器開啟（通常是 <http://localhost:4321>）。開發伺服器運行期間不要關閉該 Terminal；結束時按 `Control + C`。

### 匯入 Markdown 文章

Finder 中可直接雙擊：

```text
匯入文章到ASTERWARD.command
```

也可以在 Terminal 執行同一個工具：

```bash
cd ~/Desktop/ASTERWARD
./匯入文章到ASTERWARD.command
```

若 macOS 第一次阻擋執行，請在 Finder 對該檔案按右鍵，選擇「打開」，再確認一次。工具會讓你選擇 Markdown、確認文章資料、執行網站建置，最後自動開啟本機文章頁面。它不會執行 Git commit 或 push。

匯入器會為中文版建立 `translationKey`，但不會直接呼叫翻譯 API。匯入完成後，Terminal 會顯示中文檔案路徑；將該檔交給 Codex 並指定 `$humanwriting:human-writing`，即可依英文讀者的語氣建立：

```text
src/content/trends/en/<相同檔名>.md
```

英文配對稿尚未存在時，文章頁不會顯示失效的 `EN` 按鈕；英文稿建立並使用相同的 `translationKey` 後，中英文切換會自動出現。

也可以略過檔案選擇器，直接指定 Markdown：

```bash
node scripts/import-markdown.mjs "/完整路徑/文章.md"
```

### 常見問題

如果看到 `command not found: node` 或 `command not found: pnpm`，請重新執行：

```bash
brew install node pnpm
```

完成後關閉 Terminal、重新開啟，再檢查 `node --version` 和 `pnpm --version`。若 `pnpm install` 出現 Python、PyYAML、setuptools 或 wheel 錯誤，表示使用了 `pip`；請停止該流程，改用上面的 Homebrew 指令。

## Verification

```bash
node scripts/verify-editorial.mjs
pnpm run test:importer
pnpm run build
pnpm run verify
```

## Publishing principle

A new article begins with a market question that is interesting enough to investigate. Evidence from the United States, Taiwan, and Malaysia is used only when it changes the answer. Research is not published merely to fill a daily schedule.
