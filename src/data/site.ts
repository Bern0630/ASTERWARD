export const SITE = {
  name: "ASTERWARD",
  eyebrow: "Question-Led Market Research",
  tagline: "Questions. Evidence. Follow-through.",
  description:
    "Independent market research built around questions, evidence, commercialization milestones, and explicit invalidation conditions.",
  url: "https://bern0630.github.io/ASTERWARD/",
  socialImage: "/social-card.svg",
  accent: "steel blue"
};

export type Lang = "zh" | "en";

export const SITE_COPY = {
  zh: {
    eyebrow: "問題驅動的市場研究",
    tagline: "從感興趣的問題，走到可以驗證的判斷。",
    coverageLabel: "研究方法",
    topics: ["問題驅動", "原始資料", "商業化進度", "失效條件"]
  },
  en: {
    eyebrow: "Question-Led Market Research",
    tagline: "From an interesting question to a testable view.",
    coverageLabel: "Research method",
    topics: ["Questions", "Primary Sources", "Commercialization", "Invalidation"]
  }
} satisfies Record<Lang, {
  eyebrow: string;
  tagline: string;
  coverageLabel: string;
  topics: string[];
}>;

export const NAV_ITEMS = {
  zh: [
    { label: "研究", href: "/trends/" },
    { label: "關於", href: "/about/" }
  ],
  en: [
    { label: "Research", href: "/trends/" },
    { label: "About", href: "/about/" }
  ]
} satisfies Record<Lang, { label: string; href: string }[]>;
