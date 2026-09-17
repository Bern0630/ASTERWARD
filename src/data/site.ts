export const SITE = {
  name: "SECURRENT",
  eyebrow: "Global Market Intelligence",
  tagline: "Cross-market signals. Second-order effects.",
  description:
    "Independent market intelligence focused on how macro, rates, credit, capital flows and industry fundamentals interact across global markets.",
  url: "https://example.com",
  socialImage: "/social-card.svg",
  accent: "steel blue"
};

export type Lang = "zh" | "en";

export const SITE_COPY = {
  zh: {
    eyebrow: "全球市場情報",
    tagline: "跨市場訊號。二階效應。",
    coverageLabel: "研究範圍",
    topics: ["美國", "台灣", "馬來西亞", "利率", "信用", "AI", "基礎建設"]
  },
  en: {
    eyebrow: SITE.eyebrow,
    tagline: SITE.tagline,
    coverageLabel: "Coverage areas",
    topics: ["US", "Taiwan", "Malaysia", "Rates", "Credit", "AI", "Infrastructure"]
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
    { label: "趨勢探索", href: "/trends/" },
    { label: "跨市場訊號", href: "/crossignal/" },
    { label: "二階效應", href: "/second-order/" },
    { label: "深度研究", href: "/deep-dives/" },
    { label: "關於", href: "/about/" }
  ],
  en: [
    { label: "Briefs", href: "/briefs/" },
    { label: "Trends", href: "/trends/" },
    { label: "Crossignal", href: "/crossignal/" },
    { label: "Second Order", href: "/second-order/" },
    { label: "Deep Dives", href: "/deep-dives/" },
    { label: "About", href: "/about/" }
  ]
} satisfies Record<Lang, { label: string; href: string }[]>;
