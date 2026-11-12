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

export function deriveDefaults(parsed, sourcePath, now = new Date()) {
  const heading = parsed.body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const filename = basename(sourcePath).replace(/\.(?:md|mdx)$/i, "").replace(/[-_]+/g, " ");
  return {
    title: String(parsed.frontmatter.title || heading || filename).trim(),
    date: String(parsed.frontmatter.date || localDateString(now)).slice(0, 10),
    type: "trend",
    summary: String(parsed.frontmatter.summary || firstParagraph(parsed.body)).trim(),
    tags: Array.isArray(parsed.frontmatter.tags) ? parsed.frontmatter.tags.map(String) : [],
    lang: parsed.frontmatter.lang === "en" ? "en" : "zh",
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
