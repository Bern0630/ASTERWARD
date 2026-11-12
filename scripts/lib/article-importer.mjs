import { basename } from "node:path";

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "[]") return [];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    }
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    if (trimmed.startsWith('"')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed.slice(1, -1);
      }
    }
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

export function parseArticle(sourceText) {
  const match = sourceText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontmatter: {}, body: sourceText };

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) frontmatter[field[1]] = parseScalar(field[2]);
  }
  return { frontmatter, body: sourceText.slice(match[0].length) };
}

export function normalizeDisplayMath(body) {
  let inFence = false;
  let fenceMarker = "";
  return body
    .split("\n")
    .map((line) => {
      const fence = line.match(/^\s*(```+|~~~+)/);
      if (fence) {
        if (!inFence) {
          inFence = true;
          fenceMarker = fence[1][0];
        } else if (fence[1][0] === fenceMarker) {
          inFence = false;
          fenceMarker = "";
        }
        return line;
      }
      if (!inFence && /^\s*\\[\[\]]\s*$/.test(line)) return "$$";
      return line;
    })
    .join("\n");
}

function localDateString(now) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function plainText(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(body) {
  const withoutTitle = body.replace(/^\s*#\s+.*(?:\r?\n|$)/, "");
  const blocks = withoutTitle.split(/\r?\n\s*\r?\n/);
  const paragraph = blocks.find((block) => {
    const trimmed = block.trim();
    return trimmed && !/^(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|```|~~~|\|)/.test(trimmed);
  });
  return plainText(paragraph ?? "").slice(0, 220);
}

const TAG_RULES = [
  { zh: "RWA", en: "RWA", pattern: /\bRWA(?:s)?\b|real[- ]world assets?|實體資產|現實世界資產/iu },
  { zh: "美股", en: "U.S. Stocks", pattern: /美股|美國股(?:市|票)|U\.S\. (?:stocks?|equities)|US (?:stocks?|equities)|NYSE|Nasdaq/iu },
  { zh: "股票代幣", en: "Tokenized Stocks", pattern: /股票代幣|代幣化股票|tokeni[sz]ed (?:stocks?|shares?)|xStocks?/iu },
  { zh: "永續合約", en: "Perpetuals", pattern: /永續合約|perpetual (?:contracts?|futures?)|stock perpetuals?|PerpOptions?/iu },
  { zh: "選擇權", en: "Options", pattern: /選擇權|期權|\boptions?\b|Delta|Gamma/iu },
  { zh: "市場微結構", en: "Market Microstructure", pattern: /市場微結構|市場結構|交易市場|訂單流|委託簿|成交量|價格發現|market microstructure|market structure|order flow|order book|price discovery|trading venue/iu },
  { zh: "AI", en: "AI", pattern: /人工智慧|生成式 AI|\bAI\b|artificial intelligence|machine learning/iu },
  { zh: "資料中心", en: "Data Centers", pattern: /資料中心|數據中心|data cent(?:er|re)s?/iu },
  { zh: "光通訊", en: "Optical Networking", pattern: /光通訊|光纖|光學模組|optical networking|optical modules?|fiber optics?/iu },
  { zh: "CPO", en: "CPO", pattern: /\bCPO\b|共同封裝光學|co-packaged optics?/iu },
  { zh: "矽光子", en: "Silicon Photonics", pattern: /矽光子|硅光子|silicon photonics/iu },
  { zh: "先進封裝", en: "Advanced Packaging", pattern: /先進封裝|CoWoS|SoIC|advanced packaging/iu },
  { zh: "玻璃基板", en: "Glass Core Substrates", pattern: /玻璃基板|玻璃核心|glass[- ]core substrates?|glass substrates?/iu },
  { zh: "特殊材料", en: "Specialty Materials", pattern: /特殊材料|特用化學|陶瓷|specialty materials?|specialty chemicals?|ceramics?/iu },
  { zh: "供應鏈", en: "Supply Chain", pattern: /供應鏈|供應商|supply chains?|suppliers?/iu },
  { zh: "金融危機", en: "Financial Crisis", pattern: /金融危機|金融風暴|次貸危機|financial crisis|Great Recession/iu },
  { zh: "雷曼兄弟", en: "Lehman Brothers", pattern: /雷曼|Lehman Brothers?/iu },
  { zh: "AIG", en: "AIG", pattern: /\bAIG\b/iu },
  { zh: "TARP", en: "TARP", pattern: /\bTARP\b|問題資產救助計畫/iu },
  { zh: "銀行", en: "Banking", pattern: /銀行|banking|banks?|bank holding compan/iu },
  { zh: "金融史", en: "Market History", pattern: /金融史|市場歷史|歷史過程|financial history|market history|chronology|timeline/iu },
  { zh: "利率", en: "Interest Rates", pattern: /利率|公債殖利率|interest rates?|Treasury yields?|Fed(?:eral Reserve)?/iu },
  { zh: "企業財報", en: "Corporate Earnings", pattern: /財報|季度業績|營收|毛利率|earnings|financial results?|revenue|gross margin/iu },
  { zh: "現金流", en: "Cash Flow", pattern: /現金流|自由現金流|cash flow|free cash flow/iu },
  { zh: "台灣市場", en: "Taiwan Market", pattern: /台灣市場|臺灣市場|台股|臺股|Taiwan market|Taiwan Weighted/iu },
  { zh: "美國市場", en: "U.S. Market", pattern: /美國市場|美國經濟|U\.S\. market|U\.S\. economy|US market|US economy/iu }
];

const FALLBACK_TAGS = {
  zh: ["市場研究", "產業分析", "投資研究", "商業模式"],
  en: ["Market Research", "Industry Analysis", "Investment Research", "Business Models"]
};

export function suggestTags({ title = "", summary = "", body = "", lang = "zh" }, limit = 6) {
  const normalizedLang = lang === "en" ? "en" : "zh";
  const text = plainText(`${title}\n${summary}\n${body}`);
  const suggestions = TAG_RULES
    .filter(({ pattern }) => pattern.test(text))
    .map((rule) => rule[normalizedLang]);

  for (const fallback of FALLBACK_TAGS[normalizedLang]) {
    if (suggestions.length >= 4) break;
    if (!suggestions.includes(fallback)) suggestions.push(fallback);
  }
  return suggestions.slice(0, limit);
}

export function deriveDefaults(parsed, sourcePath, now = new Date()) {
  const heading = parsed.body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const filename = basename(sourcePath).replace(/\.(?:md|mdx)$/i, "").replace(/[-_]+/g, " ");
  const title = String(parsed.frontmatter.title || heading || filename).trim();
  const summary = String(parsed.frontmatter.summary || firstParagraph(parsed.body)).trim();
  const lang = parsed.frontmatter.lang === "en" ? "en" : "zh";
  const suppliedTags = Array.isArray(parsed.frontmatter.tags) ? parsed.frontmatter.tags.map(String).filter(Boolean) : [];
  return {
    title,
    date: String(parsed.frontmatter.date || localDateString(now)).slice(0, 10),
    type: "trend",
    summary,
    tags: suppliedTags.length > 0 ? suppliedTags : suggestTags({ title, summary, body: parsed.body, lang }),
    lang,
    author: String(parsed.frontmatter.author || "ASTERWARD")
  };
}

export function slugifyArticle(title, date) {
  const ascii = title
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${date}-${ascii || "article"}`;
}

function quoteYaml(value) {
  return JSON.stringify(String(value));
}

export function serializeArticle(metadata, body) {
  const tags = (metadata.tags ?? []).map(quoteYaml).join(", ");
  const fields = [
    `title: ${quoteYaml(metadata.title)}`,
    `date: ${metadata.date}`,
    `type: "trend"`,
    `summary: ${quoteYaml(metadata.summary)}`,
    `tags: [${tags}]`,
    `lang: ${quoteYaml(metadata.lang || "zh")}`,
    ...(metadata.translationKey ? [`translationKey: ${quoteYaml(metadata.translationKey)}`] : []),
    `author: ${quoteYaml(metadata.author || "ASTERWARD")}`
  ];
  const lines = body.split("\n");
  const firstContent = lines.findIndex((line) => line.trim() !== "");
  if (firstContent >= 0 && lines[firstContent].trim() === `# ${metadata.title}`) {
    lines.splice(firstContent, 1);
    if (lines[firstContent]?.trim() === "") lines.splice(firstContent, 1);
  }
  return `---\n${fields.join("\n")}\n---\n${normalizeDisplayMath(lines.join("\n"))}`;
}
