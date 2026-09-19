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

const briefs = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("daily"),
    edition: z.enum(["trading-day", "market-closed"]).default("trading-day")
  })
});

const trends = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("trend")
  })
});

const crossignal = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("crossignal")
  })
});

const secondOrder = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("second-order")
  })
});

const deepDives = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("deep-dive")
  })
});

export const collections = {
  briefs,
  trends,
  crossignal,
  "second-order": secondOrder,
  "deep-dives": deepDives
};
