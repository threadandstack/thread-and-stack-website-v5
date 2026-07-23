import { useEffect, type ReactNode } from "react";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import NotionBadges from "@/assets/notion-badges.png";
import {
  proposalMeta,
  atAGlanceRows,
  briefCards,
  journeySteps,
  timeline,
  stack,
  connectedSources,
  scopeGroups,
  exclusionsList,
  exclusionsFootnote,
  beforeWeStartList,
  investmentRows,
  paymentScheduleRows,
  paymentScheduleNote,
  subscriptionsIntro,
  subscriptionsList,
  termsMain,
  termsExpandable,
  whatsappCards,
  metaWhatsAppDocsUrl,
  whatsappReasons,
  whatsappClosing,
  complianceParagraphs,
  successMeasuresIntro,
  successMeasures,
  successMeasuresClosing,
  section09Paragraphs,
  runningAgentsNote,
  lumaNote,
} from "@/content/poindexterProposal";

/* ---------- Print-only primitives ---------- */

const SectionTitle = ({ num, eyebrow, title }: { num: string; eyebrow?: string; title: string }) => (
  <div className="pd-section-title">
    {eyebrow && <div className="pd-eyebrow">{eyebrow}</div>}
    <h2>
      <span className="pd-num">{num}</span>
      <span>{title}</span>
    </h2>
    <div className="pd-rule" />
  </div>
);

const H3 = ({ children }: { children: ReactNode }) => <h3 className="pd-h3">{children}</h3>;
const P = ({ children }: { children: ReactNode }) => <p className="pd-p">{children}</p>;

const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="pd-list">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

const Callout = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="pd-callout">
    <div className="pd-callout-label">{label}</div>
    <div>{children}</div>
  </div>
);

const Table = ({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) => (
  <table className="pd-table">
    <thead>
      <tr>
        {head.map((h, i) => (
          <th key={i}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, r) => (
        <tr key={r}>
          {row.map((cell, c) => (
            <td key={c}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/* ---------- Page ---------- */

const PoindexterLabsPrintPage = () => {
  useEffect(() => {
    const title = `Thread & Stack × Poindexter Labs · Blueprint (${proposalMeta.ref}) — Print`;
    document.title = title;
    const tags: HTMLMetaElement[] = [];
    const meta = (name: string, content: string) => {
      const m = document.createElement("meta");
      m.setAttribute("name", name);
      m.content = content;
      document.head.appendChild(m);
      tags.push(m);
    };
    meta("robots", "noindex, nofollow");

    let cancelled = false;
    const trigger = () => {
      if (cancelled) return;
      try {
        window.print();
      } catch {
        /* ignore — the fallback button remains */
      }
    };
    const ready =
      typeof (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts !== "undefined"
        ? (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready
        : Promise.resolve();
    Promise.resolve(ready).then(() => window.setTimeout(trigger, 400));

    return () => {
      cancelled = true;
      tags.forEach((t) => document.head.removeChild(t));
    };
  }, []);

  return (
    <>
      <style>{PRINT_CSS}</style>

      <div className="pd-doc">
        {/* Fallback control */}
        <div className="no-print pd-fallback">
          <button type="button" onClick={() => window.print()} className="pd-print-btn">
            Print or save as PDF
          </button>
        </div>

        {/* Running footer (Chrome repeats fixed elements on each printed page) */}
        <div className="pd-running-footer">
          Thread &amp; Stack · Blueprint for {proposalMeta.client} · Ref {proposalMeta.ref}
        </div>

        {/* Cover */}
        <header className="pd-cover">
          <img src={BlackStacked} alt="Thread & Stack" className="pd-logo" />
          <div className="pd-cover-label">Blueprint</div>
          <h1 className="pd-title">{proposalMeta.title}</h1>
          <p className="pd-lede">{proposalMeta.subtitle}</p>
          <dl className="pd-meta">
            <div><dt>Client</dt><dd>{proposalMeta.client}</dd></div>
            <div><dt>Prepared for</dt><dd>{proposalMeta.contact}</dd></div>
            <div><dt>Reference</dt><dd>{proposalMeta.ref}</dd></div>
            <div><dt>Date</dt><dd>{proposalMeta.date}</dd></div>
            <div><dt>Prepared by</dt><dd>Brendan Rodgers, Thread &amp; Stack Ltd</dd></div>
          </dl>
        </header>

        {/* At a glance */}
        <section className="pd-glance">
          <div className="pd-callout-label">At a glance</div>
          <dl>
            {atAGlanceRows.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>

        {/* 01 */}
        <section>
          <SectionTitle num="01" eyebrow="Where things stand" title="Ahead of the problem." />
          <P>
            There is no system to replace. Urgent work lives in your head with full context attached,
            everything else lives in Apple Notes, and relationship intelligence lives nowhere at all
            except memory. Attio has collected 175 meeting transcripts and you have never opened the
            People tab, which is a reasonable response to a CRM whose connection strength told you Tim
            was a weak contact while you messaged him daily. You used the part that worked and ignored
            the part that was misleading you.
          </P>
          <P>
            The failures are specific and you named them: an Octopus Ventures introduction sitting
            unactioned in LinkedIn DMs, a Jack meeting at DeepMind where you couldn't recall whether
            the introduction came from Yvonne or Tilly, an RL post-training researcher who registered
            for the Seoul event and may or may not have attended, so you can't follow up without
            risking looking foolish. Every one of them is the predictable result of five channels with
            no shared spine.
          </P>
          <P>
            You said it yourself: most things are "now" and this one isn't. Building it while
            nothing is on fire is exactly why it will be built properly.
          </P>

          <H3>The brief.</H3>
          <ul className="pd-list">
            {briefCards.map((b) => (
              <li key={b.word}>
                <strong>{b.word}.</strong> {b.body}
              </li>
            ))}
          </ul>

          <H3>How this gets used.</H3>
          <P>
            The design principle running through this build: <strong>the system waits to be asked.</strong>{" "}
            You were clear on our first call that you don't want alerting or task prompts, just accurate
            records and context when you need them. So the agents are invoked rather than ambient. You
            open Notion on your phone and ask who you know working on RL post-training, or what the
            state of play is with a given investor, and you get an answer grounded in your own records.
          </P>
          <P>
            There is one deliberate exception, and it's the one you asked for: when a meeting appears
            in your calendar, the agent speaks first. It gives you the brief, the history and the
            referral source, and where it has no record of the person it asks you how you know them. A
            calendar event is a moment you're already braced for, so a prompt there is welcome rather
            than noise.
          </P>

          <Callout label="A note on running agents">{runningAgentsNote}</Callout>

          <H3>Diagnostic complete. Here's the path.</H3>
          <ul className="pd-list">
            {journeySteps.map((s) => (
              <li key={s.title}>
                <strong>
                  {s.title}, {s.state === "done" ? "complete" : s.state === "current" ? "current" : "upcoming"}.
                </strong>{" "}
                {s.body}
              </li>
            ))}
          </ul>
        </section>

        {/* 02 */}
        <section>
          <SectionTitle num="02" eyebrow="The stack" title="Notion holds it together." />
          <P>
            Everything else has to earn its place, because each external connection is a subscription,
            a dependency and a thing that can break without warning.
          </P>

          <h4 className="pd-h4">Notion-native</h4>
          <ul className="pd-list">
            {stack.map((s) => (
              <li key={s.title}>
                <strong>{s.title}.</strong> {s.body}
                {s.tag && <> <em>({s.tag})</em></>}
              </li>
            ))}
          </ul>

          <h4 className="pd-h4">Connected sources</h4>
          <ul className="pd-list">
            {connectedSources.map((s) => (
              <li key={s.title}>
                <strong>{s.title}.</strong> {s.body}
              </li>
            ))}
          </ul>

          <Callout label="A note on Luma">{lumaNote}</Callout>
        </section>

        {/* 03 */}
        <section>
          <SectionTitle num="03" eyebrow="What the next six months look like" title="A plan you can work to." />
          <ul className="pd-list pd-timeline">
            {timeline.map((t) => (
              <li key={t.label}>
                <div className="pd-timeline-head">
                  <strong>{t.label}</strong>
                  <span> · {t.when} · Owner: {t.owner}</span>
                </div>
                <div>{t.note}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* 04 */}
        <section>
          <SectionTitle num="04" eyebrow="What's in scope" title="Phase 1: the build." />
          <P>Everything below is included in the project fee.</P>

          {scopeGroups.map((group) => {
            const [letter, ...rest] = group.label.split(". ");
            const title = rest.join(". ");
            return (
              <div key={group.label} className="pd-scope-group">
                <h3 className="pd-scope-title">
                  <span className="pd-scope-letter">{letter}.</span> {title}
                </h3>
                <p className="pd-scope-summary">{group.summary}</p>
                {group.intro && <p className="pd-p">{group.intro}</p>}
                <Bullets items={group.items} />
              </div>
            );
          })}

          <Callout label="What's not included">
            <p className="pd-p">
              Everything below sits outside this phase. Some of it is sequencing. Some of it is a
              different project wearing a similar coat.
            </p>
            <Bullets items={exclusionsList} />
            <p className="pd-p">{exclusionsFootnote}</p>
          </Callout>

          <Callout label="Before we start">
            <ul className="pd-list">
              {beforeWeStartList.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </Callout>
        </section>

        {/* 05 */}
        <section>
          <SectionTitle num="05" eyebrow="Investment" title="The numbers." />
          <Table head={["Item", "Amount"]} rows={investmentRows.map((r) => [r[0], r[1]])} />

          <H3>Payment schedule</H3>
          <Table head={["When", "Amount"]} rows={paymentScheduleRows.map((r) => [r[0], r[1]])} />
          <p className="pd-p pd-muted">{paymentScheduleNote}</p>

          <H3>Subscriptions, billed to you directly</H3>
          <P>{subscriptionsIntro}</P>
          <Bullets items={subscriptionsList} />

          <H3>Terms</H3>
          <Bullets items={termsMain} />
          <H3>Company details, insurance, confidentiality and liability</H3>
          <Bullets items={termsExpandable} />
        </section>

        {/* 06 */}
        <section>
          <SectionTitle num="06" eyebrow="The WhatsApp research" title="Why WhatsApp isn't in this phase." />
          <P>
            You were right that WhatsApp holds your strongest relationships, and right that it's the
            hardest to reach. Here is what I found.
          </P>
          {whatsappCards.map((c) => (
            <Callout key={c.label} label={c.label}>
              <div>{c.body}</div>
              {c.label === "Meta's Coexistence feature does work" && (
                <div className="pd-url">Meta's documentation: {metaWhatsAppDocsUrl}</div>
              )}
            </Callout>
          ))}
          <H3>Why not now, in four points.</H3>
          <Bullets items={whatsappReasons} />
          {whatsappClosing.map((p, i) => (
            <p className="pd-p" key={i}>{p}</p>
          ))}
        </section>

        {/* 07 */}
        <section>
          <SectionTitle num="07" eyebrow="ISO 27001" title="Data, privacy and compliance." />
          {complianceParagraphs.map((p, i) => (
            <p className="pd-p" key={i}>{p}</p>
          ))}
        </section>

        {/* 08 */}
        <section>
          <SectionTitle num="08" eyebrow="Success measures" title="How we'll know it worked." />
          <P>{successMeasuresIntro}</P>
          <Bullets items={successMeasures} />
          <P>{successMeasuresClosing}</P>
        </section>

        {/* 09 */}
        <section>
          <SectionTitle num="09" eyebrow="Looking ahead" title="What this makes possible later." />
          {section09Paragraphs.map((p, i) => (
            <p className="pd-p" key={i}>{p}</p>
          ))}
        </section>

        {/* Credentials + closing */}
        <section className="pd-closing">
          <div className="pd-eyebrow">Notion credentials</div>
          <img src={NotionBadges} alt="Notion certification badges" className="pd-badges" />

          <div className="pd-contact">
            <div className="pd-eyebrow">Contact</div>
            <p className="pd-p">
              Brendan Rodgers · Thread &amp; Stack Ltd<br />
              br@brendanrodgers.uk (mailto:br@brendanrodgers.uk)<br />
              07913 566551<br />
              threadandstack.com (https://threadandstack.com)
            </p>
            <p className="pd-p pd-muted">
              Prepared for {proposalMeta.client} · Ref {proposalMeta.ref} · {proposalMeta.date}
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

const PRINT_CSS = `
  @page { size: A4; margin: 18mm 16mm 20mm; }

  html, body { background: #ffffff; }
  body { color: #000000; }
  .pd-doc {
    max-width: 170mm;
    margin: 0 auto;
    padding: 24px 16px 96px;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    color: #000000;
    background: #ffffff;
    font-size: 10.5pt;
    line-height: 1.5;
  }
  .pd-doc * { color: inherit; background: transparent; box-shadow: none !important; text-shadow: none !important; }
  .pd-doc a { color: #000000; text-decoration: underline; }

  .pd-fallback { display: flex; justify-content: flex-end; margin-bottom: 12px; }
  .pd-print-btn {
    border: 1px solid #000;
    padding: 6px 14px;
    font-size: 11pt;
    background: #fff;
    cursor: pointer;
    font-family: inherit;
  }

  .pd-cover { margin-bottom: 18px; }
  .pd-logo { height: 42px; width: auto; margin-bottom: 18px; }
  .pd-cover-label {
    font-size: 8.5pt; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700;
    margin-bottom: 10px;
  }
  .pd-title {
    font-family: "Crimson Pro", "Times New Roman", serif;
    font-style: italic; font-weight: 500; font-size: 20pt;
    line-height: 1.15; margin: 0 0 10px;
  }
  .pd-lede { font-size: 11pt; line-height: 1.55; margin: 0 0 16px; max-width: 150mm; }
  .pd-meta { display: grid; grid-template-columns: max-content 1fr; column-gap: 20px; row-gap: 4px; margin: 0 0 12px; }
  .pd-meta > div { display: contents; }
  .pd-meta dt { font-size: 8.5pt; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; padding-top: 2px; }
  .pd-meta dd { margin: 0; font-size: 10.5pt; }

  .pd-glance {
    border: 1px solid #000;
    padding: 12px 14px;
    margin: 8px 0 24px;
  }
  .pd-glance dl { display: grid; grid-template-columns: max-content 1fr; column-gap: 18px; row-gap: 6px; margin: 8px 0 0; }
  .pd-glance dl > div { display: contents; }
  .pd-glance dt { font-size: 8.5pt; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; padding-top: 2px; }
  .pd-glance dd { margin: 0; font-size: 10.5pt; line-height: 1.5; }

  .pd-eyebrow {
    font-size: 8.5pt; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700;
    margin-bottom: 6px;
  }

  section { margin-top: 22px; }
  .pd-section-title { margin: 0 0 12px; break-after: avoid; page-break-after: avoid; }
  .pd-section-title h2 {
    font-family: "Crimson Pro", "Times New Roman", serif;
    font-style: italic; font-weight: 500; font-size: 14pt;
    margin: 0; display: flex; align-items: baseline; gap: 12px;
    break-after: avoid; page-break-after: avoid;
  }
  .pd-num { font-family: "Crimson Pro", "Times New Roman", serif; font-style: italic; font-size: 14pt; font-weight: 400; }
  .pd-rule { border-bottom: 1px solid #000; margin-top: 6px; }

  .pd-p { font-size: 10.5pt; line-height: 1.5; margin: 0 0 8pt; }
  .pd-muted { color: #333; font-size: 9.5pt; }
  .pd-h3 {
    font-family: "Crimson Pro", "Times New Roman", serif;
    font-style: italic; font-weight: 500; font-size: 11.5pt;
    margin: 14pt 0 6pt; break-after: avoid; page-break-after: avoid;
  }
  .pd-h4 {
    font-size: 10.5pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.14em; margin: 12pt 0 6pt; break-after: avoid; page-break-after: avoid;
  }

  .pd-list { list-style: disc; padding-left: 18px; margin: 0 0 10pt; }
  .pd-list li { margin: 0 0 5pt; break-inside: avoid; page-break-inside: avoid; }

  .pd-callout {
    border: 1px solid #000;
    padding: 10px 12px;
    margin: 10pt 0;
    break-inside: avoid; page-break-inside: avoid;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .pd-callout-label {
    font-size: 8.5pt; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700;
    margin-bottom: 6px;
  }
  .pd-url { font-size: 9pt; color: #333; margin-top: 6px; word-break: break-all; }

  .pd-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt;
    font-size: 10pt;
  }
  .pd-table th, .pd-table td {
    border: 1px solid #000;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .pd-table th { font-weight: 700; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.12em; }
  .pd-table tr { break-inside: avoid; page-break-inside: avoid; }

  .pd-scope-group { margin: 12pt 0; break-inside: avoid; page-break-inside: avoid; }
  .pd-scope-title {
    font-family: "Crimson Pro", "Times New Roman", serif;
    font-style: italic; font-weight: 500; font-size: 12.5pt;
    margin: 0 0 4pt; break-after: avoid; page-break-after: avoid;
  }
  .pd-scope-letter { font-weight: 600; }
  .pd-scope-summary { font-size: 10pt; color: #333; margin: 0 0 6pt; }

  .pd-timeline li { margin-bottom: 8pt; }
  .pd-timeline-head { margin-bottom: 2pt; }

  .pd-closing { margin-top: 32px; break-inside: avoid; page-break-inside: avoid; }
  .pd-badges { max-width: 100%; height: auto; margin: 8px 0 16px; }
  .pd-contact { margin-top: 8px; }

  .pd-running-footer {
    position: fixed;
    bottom: 6mm;
    left: 0; right: 0;
    text-align: center;
    font-size: 8.5pt;
    color: #444;
    letter-spacing: 0.02em;
  }
  @media screen {
    .pd-running-footer { display: none; }
  }

  @media print {
    .no-print { display: none !important; }
    .pd-doc { padding: 0; max-width: none; }
  }
`;

export default PoindexterLabsPrintPage;
