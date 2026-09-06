# Journal grid: one card shape, one honest layout

## What I found on the page

I captured the journal at desktop, tablet and phone widths and traced the layout code. Four separate problems, all coming from the same decision.

1. **Three different card footprints.** Writing takes one column and two rows, events take two columns and one row, builds take one column and one row. Every row of the grid is a jigsaw, so whenever the remaining pieces don't fit, the grid leaves a hole. That is exactly the gap you're seeing around 10 June / 8 June / Cognitive Overload / Death of Notion Mail.
2. **Events clump at the end.** The spacing rule nudges events apart, but once the older half of the feed is mostly events there is nothing left to put between them, so the last stretch is event, event, event.
3. **Build cards are measly.** A build sits in a single short slot, so its picture, title and one line of text are crushed. Next to a blog card at double height it reads as a second-class item, which isn't what a build log deserves.
4. **Phone view is broken.** The wide event card keeps its side-by-side picture-and-text arrangement at phone width and its pictures overflow the screen edge, which is why everything looks like it is sliding off to the right.

## The proposal

**Every card becomes the same shape: the blog card shape.** One column wide, one fixed height, with a slightly shorter picture at the top and more room underneath for the title, tags and body text. That single decision fixes the holes, because a grid of identical tiles can never leave a gap, and it lifts builds and events up to the same visual weight as writing.

Within that shared shape each type still reads differently:

- **Writing** keeps the large picture, theme pill, reading time, headline, standfirst and byline.
- **Events** get the date block, role and format pills, headline, summary and location — the picture sits on top like everything else instead of beside the text.
- **Builds** now have real room: picture, build mark and name, update count, latest update title, version chip and a line of changelog. Same size as a blog card.

**Double width becomes something you choose, not something automatic.** Any event marked Featured in the events database spans two columns on desktop and gets a taller picture and a longer summary. Nothing else goes wide by default, so the feed stays even, and you can promote a specific event whenever it deserves the attention. Featured cards are placed at the start of a row so they never leave a stub of empty space beside them.

**Open build cards handle their picture properly.** When a build is opened it takes a full row, the picture becomes a wide, short banner across the top rather than the current squashed strip, and it grows as the update list appears. If a build has no picture, the banner is dropped entirely instead of leaving an empty band.

**Ordering stays exactly as it is** — newest first by publish date, event date, or the latest update in a build. With one uniform card size the anti-clumping nudge is no longer needed to protect the layout, so I'll relax it to a light touch: no more than two of the same type back to back, which keeps dates near-honest and stops the run of events at the bottom.

**Phone and tablet.** One column on phone, two on tablet, three on desktop. On phone every card, featured ones included, becomes a single full-width tile with the picture on top and text below, and heights become natural rather than fixed so nothing overflows or overlaps. Tablet uses the same rules with featured events falling back to single width when a two-column span would strand a gap.

## Technical notes

- `src/pages/JournalPage.tsx`: replace the mixed span logic (`spanClass`, `buildLayout`, fixed `grid-auto-rows: 13.5rem`) with a uniform grid — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, a single row height token applied only from `sm` upward, and `auto-rows-auto` below that. Expanded builds and featured events are the only items that span, and span logic is gated behind `lg:`.
- New shared `JournalCardShell` wrapper in `src/components/journal/` owning the picture ratio, padding scale and fixed-height behaviour, used by `WritingCard`, `EventCard` and `BuildGroupCard` so they can't drift apart again.
- `EventCard`: drop the `wide` side-by-side variant; add a `featured` prop that only changes column span and picture height, never the internal arrangement.
- `BuildGroupCard`: match the writing card's type scale, give the collapsed state the full body area, and switch the expanded banner from `h-28` to a responsive aspect-based banner that is omitted when there's no image.
- `src/lib/journalFeed.ts`: soften `interleaveJournalItems` to a same-type run limit of two and remove the event-specific minimum gap; carry `featured` through on events (the field is already synced).
- No backend, sync or content changes.
