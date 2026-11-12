# ASTERWARD 中英雙語 HumanWriting 工作流程

## 目的

中文文章先透過現有 `.command` 匯入；英文版由 Codex 使用 HumanWriting 翻譯與修訂後，存成獨立的配對 Markdown。網站只在英文配對檔確實存在時顯示語言切換，避免 EN 連到不存在的頁面。

## 未來匯入流程

1. `.command` 匯入中文 Markdown，沿用標準化檔名與 Astro 建置檢查。
2. 中文 frontmatter 自動加入與 slug 相同的 `translationKey`。
3. 匯入完成後，Terminal 顯示中文檔案路徑及下一步提示：將該檔交給 Codex，指定 HumanWriting 建立英文版。
4. 尚未建立英文檔時，文章頁不顯示 `EN` 切換。
5. Codex 將英文稿寫入 `src/content/trends/en/<相同檔名>.md`，並使用相同的 `translationKey`、日期與作者資料。
6. 英文檔存在並通過建置後，中英文文章頁自動顯示互相切換的語言按鈕。

## 英文翻譯原則

- 以英文讀者自然閱讀為目標，不逐字翻譯中文句法。
- 保留所有名稱、日期、數字、公式、產品分類、引用編號、網址、法律意義、風險限定與免責聲明。
- 標題、摘要與小標可依英文語序調整，但不得改變論點或強化原文未主張的因果關係。
- 使用穩定的金融與市場微觀結構術語；不為避免重複而任意替換技術名詞。
- 進行 HumanWriting 自然語氣檢查，刪除模板化轉場、宣傳語氣與不必要的結論重述。

## 目前 RWA 文章

- 中文檔：`src/content/trends/2026-11-12-rwa.md`
- 英文檔：`src/content/trends/en/2026-11-12-rwa.md`
- 配對鍵：`2026-11-12-rwa`
- 英文標題採自然英文市場研究語氣，不逐字直譯。
- 全文十個主段落、四條傳導路徑、表格、文字流程圖、有效槓桿公式、八筆參考資料與免責聲明均須保留。

## 驗證

- 中文文章在英文檔不存在時不出現失效的 `EN` 連結。
- 建立英文檔後，中英文頁面互相連結至正確 slug。
- Astro check、build、editorial verification 與 site verification 全部通過。
- 中英文頁面均只有一個 H1；英文公式以 KaTeX 顯示；引用 1–8 和外部網址完整。
- `.command` 不呼叫外部翻譯 API，也不執行 commit、push 或部署。

