---
title: "AI 不只需要算得快，也需要傳得動"
date: 2026-10-02T12:00:00+08:00
type: "trend"
lang: "zh"
translationKey: "2026-10-02-ai-optics-cpo-network-power"
summary: "當更多 GPU 共同運算，系統瓶頸也從單顆晶片延伸到資料交換。本文拆解光通訊、CPO、基板與電力需求的關係，並區分哪些產業已受惠、哪些 CPO 營收仍待驗證。"
tags: ["AI", "光通訊", "CPO", "矽光子", "資料中心", "供應鏈"]
author: "ASTERWARD"
---

AI 系統愈做愈大，問題不再只是單顆 GPU 算得夠不夠快，也包括大量 GPU 能不能及時交換資料。

當資料傳輸跟不上，昂貴的運算晶片就可能等待網路；當傳輸所需的電力與散熱持續增加，資料中心也不能只靠堆疊更多設備解決問題。因此，AI 基礎建設的升級正在從運算晶片延伸到交換器、光模組、雷射、光纖、連接器、封裝與電力系統。

不過，這不代表所有連線都會立刻改用光通訊，也不代表每一家 CPO 概念公司都已經產生相關營收。真正重要的是分清楚：技術解決了什麼問題、產品走到哪一個商業階段，以及收入與獲利是否已經出現在財報裡。

> 本文資料截至 2026 年 10 月 2 日（台灣時間）。文中公司是研究案例，不代表買賣建議或個股價格預測。

## 一分鐘結論

1. **AI 的瓶頸正從算力延伸到資料交換。** GPU 數量增加後，頻寬、延遲、連接密度與每位元耗電都會影響整套系統的效率。
2. **光通訊、矽光子與 CPO 不是同一件事。** 光通訊是傳輸方式，矽光子是製作光學元件的平台，CPO 則是把光學引擎放到交換晶片附近的封裝架構。
3. **CPO 的核心價值是縮短高速電訊號路徑。** 它有機會降低傳輸損耗與耗電，但不會消除 GPU、記憶體、冷卻與其他設備的用電。
4. **量產已經開始，但可插拔光模組不會立刻消失。** CPO 會先出現在功耗與密度壓力最大的高階網路設備，並與既有方案共存。
5. **投資判斷要從題材走向證據。** 已量產、已出貨、驗證中與只有概念連結，代表完全不同的營收能見度。

## 從算力瓶頸走向網路瓶頸

AI 訓練需要許多 GPU 同時處理模型參數與資料；大型推論服務也需要在運算、記憶體與網路之間持續搬移資料。GPU 增加後，系統效能不再由單顆晶片決定，而是取決於整個叢集能否協調運作。

網路需求可以先分成兩層：

| 網路層級 | 主要用途 | 常見瓶頸 |
|---|---|---|
| Scale-up | 在緊密耦合的運算域內連接 GPU | 極低延遲、高頻寬與同步效率 |
| Scale-out | 跨伺服器、機櫃或資料中心擴張 | 交換容量、傳輸距離、功耗與成本 |

目前 CPO 最明確的商業落點，是高容量交換器與相關網路平台，而不是「每一顆 GPU 都直接使用 CPO」。隨著交換器頻寬往 51.2T、102.4T 甚至更高提升，電訊號若要在電路板上走較長距離，損耗、散熱與訊號完整性的難度都會上升。

這就是光通訊的重要性：把適合長距離、高頻寬傳輸的部分交給光，減少高速電訊號在銅線與電路板上的負擔。

## 光通訊、矽光子與 CPO 不是同一件事

三個常被混用的名詞，實際上位於不同層次：

| 名詞 | 它是什麼 | 投資研究時要問什麼 |
|---|---|---|
| 光通訊 | 用光傳送資料的技術與產業 | 公司提供光纖、雷射、光模組、連接器，還是系統？ |
| 矽光子 | 用半導體製程整合光學元件的技術平台 | 元件是否通過驗證，良率與成本是否可量產？ |
| CPO | 將光學引擎放到交換晶片附近的封裝方式 | 產品是否量產、出貨給誰、是否已形成營收？ |

傳統可插拔光模組的路徑，大致是：

**交換晶片 → 電路板上的電訊號 → 面板端光模組 → 光纖。**

CPO 則把轉換位置往晶片靠近：

**交換晶片 → 鄰近的光學引擎 → 光纖。**

關鍵不是「完全沒有電訊號」，而是縮短最難處理的高速電訊號路徑，降低傳輸損耗與重新放大訊號所需的電力，同時提高面板與系統的連接密度。

## 30W 與 9W 應該如何理解

NVIDIA 在其 CPO 技術文章中，以特定 1.6 Tb/s 介面比較傳統可插拔方案與 CPO：前者常見功耗約 30W，CPO 可低至約 9W；同一架構下，電訊號損耗可由約 22dB 降至約 4dB，能源效率約提高 3.5 倍。[1]

這些數字說明了 CPO 的工程價值，但不能直接改寫成「所有 CPO 都只用 9W」，更不能當成整台交換器或整座資料中心的耗電。它是特定廠商、特定介面與系統設計下的比較。

此外，傳輸效率改善與總用電下降是兩件事。資料中心的總用電還包括 GPU、CPU、記憶體、儲存、電源轉換、散熱與備援系統。如果 GPU 數量、資料流量與使用率增加得比效率改善更快，總耗電仍可能上升。

**更省電，不等於總用電一定下降。**

因此，CPO 可能降低「每單位資料」的傳輸耗電，同時讓更多運算設備得以部署。對電力、散熱與資料中心建設而言，需求未必因光通訊效率提升而減少。

## CPO、基板與玻璃基板的關係

CPO 將交換晶片、光學引擎、電源與連接結構放進更緊密的系統，需要處理高速訊號、熱膨脹、平坦度、對位精度、良率與維修方式。這會提高先進封裝、封裝基板與精密連接技術的重要性。

但三種材料不能混為一談：

| 材料或結構 | 主要角色 | 與 CPO 的關係 |
|---|---|---|
| PCB | 連接系統中的元件與模組 | 仍是交換器與伺服器的重要基礎 |
| 封裝基板 | 承載晶片並提供高密度互連 | CPO 封裝複雜化後，規格要求可能提高 |
| 玻璃核心基板 | 以玻璃作為核心材料的先進封裝方向 | 可提供平坦度與尺寸穩定性，但不是 CPO 的必要條件 |

Intel 提出的玻璃基板路線，著重更大的封裝面積、更高互連密度與未來光學整合能力。[6] 這證明玻璃可能成為先進封裝的材料選項，卻不能反推所有 CPO 都必須使用玻璃基板。光纖中的玻璃，也與封裝基板使用玻璃核心是不同問題。

## 技術已量產，但尚未全面取代可插拔模組

產業已經跨過純概念階段。Broadcom 將第二代 TH5-Bailly 稱為業界首款進入量產的 CPO 解決方案，並列出 Corning、Delta、FIT、Micas 與 Twinstar 等合作夥伴的出貨或量產進度。[3]

NVIDIA 在 2026 年 5 月表示 Spectrum-X Ethernet Photonics 交換器已進入生產，但搭載於 Vera Rubin 平台的完整系統，量產出貨預計從同年秋季開始。[4] 這兩句話必須分開：網路產品進入生產，不等於所有終端系統已經大量交付。

同時，NVIDIA 也明確表示光子交換器會與可插拔光收發器技術共同發展。[5] 可插拔模組具備成熟供應鏈、可維修性與部署彈性；CPO 則在最高頻寬、功耗與密度壓力下更有吸引力。兩者更可能長期分工，而不是一夕替代。

## 哪些產業可能受影響

同樣被歸類為光通訊或 CPO 供應鏈，證據強度可能差很多：

| 產業位置 | 公司案例 | 目前可驗證的證據 | 判讀 |
|---|---|---|---|
| 網路晶片與平台 | NVIDIA、Broadcom | 已公布 CPO 交換器平台、生產或量產進度 | 商業化證據最直接，但仍要追蹤終端出貨 |
| 雷射與光學元件 | Lumentum、Coherent | NVIDIA 分別宣布長期採購承諾與 20 億美元投資；Lumentum 提到 CPO 雷射需求與初始 ELS 訂單 | 訂單與產能合作明確，實際獲利貢獻仍需看財報 |
| 光纖、連接器與耦合 | Corning、FIT、FOCI | Broadcom 公布 Corning 出貨與 FIT 量產釋出；FOCI 公開 CPO 開發、連接器與資本支出 | 前兩者已有量產節點；FOCI 較接近開發與驗證階段 |
| 矽光子與先進封裝 | TSMC | NVIDIA 公布與 TSMC 合作並使用 COUPE 技術 | 有平台合作，仍須區分製程收入與單一 CPO 專案貢獻 |
| 交換器與系統整合 | Delta、Micas | Broadcom 公布 TH5-Bailly 相關生產進度 | 已進入產品化，但規模與毛利仍待公司數據驗證 |
| 可插拔光模組 | Coherent、Fabrinet 等 | 既有光網路需求仍成長，且官方說法是與 CPO 並存 | 不應把 CPO 成長直接解讀成既有模組立即衰退 |

Lumentum 與 Coherent 的合作有較強的商業訊號。NVIDIA 分別公布多年、數十億美元等級的採購承諾與 20 億美元投資，用來擴充美國光學產能。[7][8] Lumentum 在 2026 會計年度第四季也表示，高功率 CPO 雷射需求增加，並取得初始外部雷射光源訂單。[9]

Coherent 同期營收成長，證明整體公司與資料中心相關需求強勁，但不能把整家公司營收增幅全部歸因於 CPO。[10] 同樣地，FOCI 公開的共同開發、ReLFACon 連接器與擴產計畫，屬於值得追蹤的驗證訊號，仍不是大規模 CPO 營收與獲利已實現的證明。[11]

還要分清楚公司與終端客戶的關係：直接供應商、共同開發夥伴、製造服務商與最終使用者，承擔的風險與可取得的價值都不同。

**公司可能已受惠於高速光通訊，但 CPO 新增營收仍待驗證。**

## 回到股票市場：用四個層級判斷

光通訊成長不代表每家公司同等受惠。研究個股時，可以把證據分成四層：

| 證據層級 | 可以接受的證據 | 還不能證明什麼 |
|---|---|---|
| 已實現 | 財報揭露相關營收、毛利、訂單或現金流 | 成長是否可以長期維持 |
| 開始放量 | 官方宣布量產、出貨、產能承諾或具名客戶 | 出貨規模是否足以明顯影響獲利 |
| 驗證中 | 共同開發、送樣、認證、設備或產能準備 | 客戶最終是否採用、何時轉成收入 |
| 概念連結 | 技術能力或材料理論上相關 | 是否進入供應鏈，更不能證明已賺到錢 |

接下來可以固定追蹤五個問題：

1. 公司實際賣的是雷射、光引擎、連接器、基板、設備，還是完整系統？
2. 誰是直接付費的客戶？是晶片商、交換器廠、雲端業者，還是代工夥伴？
3. 產品處於送樣、驗證、量產、出貨，還是已經列入財報的階段？
4. 營收成長是否伴隨毛利、營業現金流與客戶集中風險改善？
5. 為了接單增加的設備與研發支出，多久能由現金流回收？

這套判斷比「公司是否被列入 CPO 概念股」更接近真正的投資研究。

## 結論

AI 不只需要更多算力，也需要更快、更密集且更省電的資料交換。光通訊已是資料中心的重要基礎，CPO 則是在交換器頻寬與功耗壓力升高後，逐步進入量產的新架構。

產業方向是真的，但商業成果並不平均。網路平台、雷射、光學元件、光纖連接、先進封裝與系統整合都可能受影響；它們各自的量產時間、議價能力、資本支出與獲利模式卻不同。

所以，研究的下一步不是再找更多概念股，而是追蹤產品是否量產、由誰採購、收入是否入帳，以及毛利與現金流是否跟上。當這些證據逐步成立，技術趨勢才真正變成可以持續的生意。

## 資料與文獻來源

[1] NVIDIA Developer Blog，2025-08-18。  
*Scaling AI Factories With Co-Packaged Optics for Better Power Efficiency.*  
https://developer.nvidia.com/blog/scaling-ai-factories-with-co-packaged-optics-for-better-power-efficiency/

[2] NVIDIA Developer Blog，2025-08-26。  
*How Industry Collaboration Fosters NVIDIA Co-Packaged Optics.*  
https://developer.nvidia.com/blog/how-industry-collaboration-fosters-nvidia-co-packaged-optics/

[3] Broadcom。  
*Broadcom Announces Third-Generation Co-Packaged Optics.*  
https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-third-generation-co-packaged-optics-cpo

[4] NVIDIA Newsroom，2026-05-31。  
*NVIDIA Vera Rubin Platform in Full Production to Power the Next Generation of Agentic AI Factories.*  
https://nvidianews.nvidia.com/news/vera-rubin-full-production-agentic-ai-factory

[5] NVIDIA Investor Relations，2025。  
*NVIDIA Announces Spectrum-X Photonics Co-Packaged Optics Networking Switches.*  
https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Spectrum-X-Photonics-Co-Packaged-Optics-Networking-Switches-to-Scale-AI-Factories-to-Millions-of-GPUs/default.aspx

[6] Intel Newsroom。  
*Intel Unveils Industry-Leading Glass Substrates to Meet Demand for More Powerful Compute.*  
https://www.intel.com/content/www/us/en/newsroom/news/intel-unveils-industry-leading-glass-substrates.html

[7] Lumentum，2026。  
*NVIDIA Announces Strategic Partnership With Lumentum to Develop State-of-the-Art Optics Technology.*  
https://investor.lumentum.com/financial-news-releases/news-details/2026/NVIDIA-Announces-Strategic-Partnership-With-Lumentum-to-Develop-State-of-the-Art-Optics-Technology/default.aspx

[8] Coherent，2026。  
*NVIDIA and Coherent Announce Strategic Partnership.*  
https://www.coherent.com/news/press-releases/nvidia-and-coherent-announce-strategic-partnership

[9] Lumentum，2026。  
*Lumentum Announces Fourth-Quarter and Full Fiscal Year 2026 Results.*  
https://investor.lumentum.com/financial-news-releases/news-details/2026/Lumentum-Announces-Fourth-Quarter-and-Full-Fiscal-Year-2026-Results/default.aspx

[10] Coherent，2026。  
*Coherent Corp. Reports Fourth Quarter and Full Year Fiscal 2026 Results.*  
https://ir.coherent.com/news-releases/news-release-details/coherent-corp-reports-fourth-quarter-and-full-year-fiscal-2026

[11] FOCI。  
*共同封裝光學元件（CPO）與 ReLFACon 技術說明。*  
https://www.foci.com.tw/zh-tw/article/22
