import type { WritingItem } from "./journalFeed";

export function groupCalendarPosts(posts: WritingItem[]) {
  const groups = new Map<string, WritingItem[]>();
  for (const post of posts) {
    const valid = post.date && /^\d{4}-\d{2}-\d{2}/.test(post.date) && !Number.isNaN(Date.parse(post.date));
    const key = valid ? post.date?.slice(0, 10) || "undated" : "undated";
    groups.set(key, [...(groups.get(key) || []), post]);
  }
  return [...groups.entries()].sort(([a], [b]) => a === "undated" ? 1 : b === "undated" ? -1 : b.localeCompare(a));
}