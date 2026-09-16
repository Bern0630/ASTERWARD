import type { CollectionEntry } from "astro:content";
import type { Lang } from "@/data/site";

type AnyEntry =
  | CollectionEntry<"briefs">
  | CollectionEntry<"trends">
  | CollectionEntry<"crossignal">
  | CollectionEntry<"second-order">
  | CollectionEntry<"deep-dives">;

type TranslationEntry = {
  id: string;
  data: {
    lang?: Lang;
    translationKey?: string;
    date: Date;
  };
};

export function sortByDateDesc<T extends AnyEntry>(entries: T[]) {
  return entries.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}

export function latest<T extends AnyEntry>(entries: T[], count = 1) {
  return sortByDateDesc([...entries]).slice(0, count);
}

export function byLang<T extends AnyEntry>(entries: T[], lang: Lang) {
  return entries.filter((entry) => entryLang(entry) === lang);
}

export function entryLang(entry: { data: { lang?: Lang } }): Lang {
  return entry.data.lang ?? "zh";
}

export function formatDate(date: Date, style: "short" | "long" = "short", lang: Lang = "en") {
  if (style === "long") {
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-TW" : "en", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
    .format(date)
    .toUpperCase();
}

export function slugFromId(id: string) {
  return id.replace(/.mdx?$/, "");
}

export function baseSlugFromId(id: string) {
  const slug = slugFromId(id);
  return slug.startsWith("en/") ? slug.slice(3) : slug;
}

export function langPrefix(lang: Lang) {
  return lang === "en" ? "/en" : "";
}

export function localizedPath(path: string, lang: Lang) {
  const normalized = path.startsWith("/") ? path : "/" + path;
  return langPrefix(lang) + normalized;
}

export function entryUrl(collection: string, id: string, lang: Lang = "zh") {
  return localizedPath("/" + collection + "/" + baseSlugFromId(id) + "/", lang);
}

export function findTranslation<T extends TranslationEntry>(
  entries: T[],
  entry: T,
  targetLang: Lang,
  collection: string
) {
  const key = entry.data.translationKey;
  if (!key) return undefined;

  const match = entries.find(
    (candidate) =>
      candidate.data.translationKey === key && entryLang(candidate) === targetLang
  );

  return match ? entryUrl(collection, match.id, targetLang) : undefined;
}
