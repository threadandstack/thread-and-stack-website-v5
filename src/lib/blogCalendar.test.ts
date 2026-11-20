/// <reference types="node" />
import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { groupCalendarPosts } from "./blogCalendar";
import type { WritingItem } from "./journalFeed";
const post = (id: string, date: string | null): WritingItem => ({ kind: "writing", id, date, slug: id, title: id });
describe("blog calendar", () => {
  test("shows only occupied dates in newest-first order", () => {
    deepStrictEqual(groupCalendarPosts([post("a", "2026-11-01"), post("b", "2026-11-20"), post("c", "2026-11-20")]).map(([date, posts]) => [date, posts.length]), [["2026-11-20", 2], ["2026-11-01", 1]]);
  });
  test("keeps every undated blog without inventing dates", () => {
    deepStrictEqual(groupCalendarPosts([post("a", null), post("b", "2026-11-20"), post("c", null)]).map(([date, posts]) => [date, posts.length]), [["2026-11-20", 1], ["undated", 2]]);
  });
});