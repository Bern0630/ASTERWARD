import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/data/site";
import { entryUrl, sortByDateDesc } from "@/lib/content";

export async function GET(context: { site: URL }) {
  const collections = await Promise.all([
    getCollection("briefs"),
    getCollection("trends"),
    getCollection("crossignal"),
    getCollection("second-order"),
    getCollection("deep-dives")
  ]);

  const entries = sortByDateDesc(collections.flat()).slice(0, 25);

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: entryUrl(entry.collection, entry.id, entry.data.lang)
    }))
  });
}
