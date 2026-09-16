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

export const NAV_ITEMS = {
  zh: [
    { label: "Briefs", href: "/briefs/" },
    { label: "Trends", href: "/trends/" },
    { label: "Crossignal", href: "/crossignal/" },
    { label: "Second Order", href: "/second-order/" },
    { label: "Deep Dives", href: "/deep-dives/" },
    { label: "About", href: "/about/" }
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
