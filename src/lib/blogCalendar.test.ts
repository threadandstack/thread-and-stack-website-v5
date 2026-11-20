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
  test("omits undated entries instead of creating calendar days", () => {
    deepStrictEqual(groupCalendarPosts([post("a", null), post("b", "2026-11-20"), post("c", null)]).map(([date, posts]) => [date, posts.length]), [["2026-11-20", 1]]);
  });
  test("includes dated events and each build release", () => {
    const build = { kind: "build", id: "release", date: "2026-11-10", slug: "release", title: "Release" } as import("./journalFeed").BuildItem;
    const event = { kind: "event", id: "event", date: "2026-11-12", slug: "event", title: "Event" } as import("./journalFeed").EventItem;
    deepStrictEqual(groupCalendarPosts([event, { kind: "buildGroup", id: "group", date: build.date, slug: "build", buildName: "Build", releases: [build] }]).map(([date, entries]) => [date, entries[0].id]), [["2026-11-12", "event"], ["2026-11-10", "release"]]);
  });
});