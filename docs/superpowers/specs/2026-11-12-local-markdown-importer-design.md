# ASTERWARD 本機 Markdown 智慧匯入器

## 目的

讓使用者在 macOS 雙擊一個 `.command` 檔後選擇 Markdown，將文章安全加入 ASTERWARD 的本機 Astro 網站，完成格式檢查、網站建置並自動開啟文章預覽。Git commit、push 與公開部署不在此工具的範圍內。

## 已選方案

採用「智慧匯入型」。相較於單純複製檔案，它會補齊網站需要的 frontmatter、處理 VS Code 與 Astro 常見的數學公式分隔符差異，並在開啟預覽前驗證建置。固定收件匣批次匯入則留待未來有大量文章需求時再考慮。

## 使用流程

1. 雙擊 `匯入文章到ASTERWARD.command`。
2. macOS 檔案選擇器只接受 `.md` 或 `.mdx`。
3. 工具讀取文章標題與內容；若缺少 Astro frontmatter，依內容產生必要欄位。
4. 工具顯示即將使用的標題、日期、摘要、標籤與網址 slug，讓使用者確認或修改。
5. 工具建立 `src/content/trends/<slug>.md`，不覆蓋同名文章。
6. 工具執行內容檢查與 Astro build。失敗時保留錯誤訊息，且不啟動錯誤頁面。
7. 成功後啟動或沿用本機開發伺服器，並在瀏覽器開啟該文章網址。

## 內容規則

- 必要 frontmatter：`title`、`date`、`type: trend`、`summary`、`tags`、`lang: zh`。
- `translationKey` 只在網站現行驗證確實要求時產生；本工具不捏造英文翻譯。
- 將獨立行的 `\[` 與 `\]` 轉為 `$$`，避免數學公式以原始文字顯示。
- 原文正文、引用、連結與免責聲明不做語意改寫。
- 檔名採 ASCII slug；無法可靠轉寫時，以日期加短識別碼產生。
- 來源檔不修改；匯入結果寫入網站內容目錄。

## 安全邊界

- 不執行 `git add`、commit、push、pull、reset 或部署。
- 不覆蓋既有文章；遇到相同 slug 時要求改名。
- 不自動安裝或升級套件。
- 不把本機伺服器暴露到區域網路或網際網路。
- 每次匯入都先建置驗證，並清楚顯示錯誤。

## 現有專案修復

目前 `main` 是尚未建立第一筆 commit 的 unborn branch，Git index 亦缺少多個 blob；因此無法從 index 恢復已消失的 Astro 頁面、版型與內容。實作前會先唯讀檢查 GitHub 遠端：

- 若遠端已有完整網站歷史，將其取回到獨立暫存位置，只把缺失的網站檔案複製回工作目錄。
- 不覆蓋目前仍存在的檔案，也不改動使用者的 Markdown、IG 素材或 Git index。
- 若遠端同樣沒有完整網站，停止並回報，改以現有檔案重建網站會視為另一項工作。

## 驗收條件

- `.command` 可從 Finder 雙擊執行並正常開啟檔案選擇器。
- 可匯入目前的 `asterward_rwa_us_stocks_market_structure_20261112_humanized.md`。
- 匯入後公式正常呈現，不顯示原始 LaTeX 分隔符。
- `pnpm run build` 成功。
- 瀏覽器自動開啟正確的本機文章頁面。
- 執行前後都沒有新增 commit 或 push。

