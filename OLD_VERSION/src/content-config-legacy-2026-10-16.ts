import { defineCollection, z } from "astro:content";

const baseSchema = z.object({
  title: z.string(),
  date: z.date(),
  type: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  lang: z.enum(["zh", "en"]).default("zh"),
  translationKey: z.string().optional(),
  featured: z.boolean().optional(),
  updated: z.date().optional(),
  author: z.string().optional()
});

const trends = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("trend")
  })
});

export const collections = {
  trends
};
