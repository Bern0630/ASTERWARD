import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  type: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  lang: z.enum(["zh", "en"]).default("zh"),
  translationKey: z.string().optional(),
  featured: z.boolean().optional(),
  updated: z.coerce.date().optional(),
  author: z.string().optional()
});

const trends = defineCollection({
  loader: glob({ base: "./src/content/trends", pattern: "**/*.{md,mdx}" }),
  schema: baseSchema.extend({
    type: z.literal("trend")
  })
});

export const collections = {
  trends
};
