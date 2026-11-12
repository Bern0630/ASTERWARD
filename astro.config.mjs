import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const site = process.env.SITE ?? "https://example.com";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  devToolbar: {
    enabled: false
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
