export const SITE = {
  name: "ASTERWARD",
  eyebrow: "Three-Market Daily Intelligence",
  tagline: "United States. Taiwan. Malaysia.",
  description:
    "Twice-daily market intelligence for the United States, Taiwan, and Malaysia, built from fundamentals, technicals, positioning, and explicit invalidation conditions.",
  url: "https://example.com",
  socialImage: "/social-card.svg",
  accent: "steel blue"
};

export type Lang = "zh" | "en";

export const SITE_COPY = {
  zh: {
    eyebrow: "三市場每日情報",
    tagline: "美國、台灣、馬來西亞。",
    coverageLabel: "分析維度",
    topics: ["美國", "台灣", "馬來西亞", "基本面", "技術面", "籌碼"]
  },
  en: {
    eyebrow: "Three-Market Daily Intelligence",
    tagline: "United States. Taiwan. Malaysia.",
    coverageLabel: "Analysis dimensions",
    topics: ["United States", "Taiwan", "Malaysia", "Fundamentals", "Technicals", "Positioning"]
  }
} satisfies Record<Lang, {
  eyebrow: string;
  tagline: string;
  coverageLabel: string;
  topics: string[];
}>;

export const NAV_ITEMS = {
  zh: [
    { label: "每日簡報", href: "/briefs/" },
    { label: "關於", href: "/about/" }
  ],
  en: [
    { label: "Briefs", href: "/briefs/" },
    { label: "About", href: "/about/" }
  ]
} satisfies Record<Lang, { label: string; href: string }[]>;
