import type { JournalItem } from "./journalFeed";
export function groupCalendarPosts(items: JournalItem[]) {
  const groups = new Map<string, JournalItem[]>();
  const expanded = items.flatMap(item => item.kind === "buildGroup" ? item.releases : [item]);
  for (const item of expanded) {
    const date = item.date?.slice(0, 10);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) continue;
    groups.set(date, [...(groups.get(date) || []), item]);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}
