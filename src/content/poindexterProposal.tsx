import type { ReactNode, ComponentType } from "react";
import IconNotion from "@/assets/proposal/icons/notion.png";
import IconNotionAI from "@/assets/proposal/icons/notion-ai.png";
import IconLassie from "@/assets/proposal/icons/lassie.png";
import IconSlack from "@/assets/proposal/icons/slack.svg";
import IconNotionCalendarAsset from "@/assets/proposal/icons/notion-calendar-v2.png.asset.json";
import IconNotionMailAsset from "@/assets/proposal/icons/notion-mail-v2.png.asset.json";
import IconNotionAppAsset from "@/assets/proposal/icons/notion-app.png.asset.json";
import IconNotionAutomationsAsset from "@/assets/proposal/icons/notion-automations.png.asset.json";
import IconNotionSkillsAsset from "@/assets/proposal/icons/notion-skills.png.asset.json";
import IconApolloAsset from "@/assets/proposal/icons/apollo.png.asset.json";
import IconAttioAsset from "@/assets/proposal/icons/attio.png.asset.json";
import IconKondoAsset from "@/assets/proposal/icons/kondo.png.asset.json";
import IconLumaAsset from "@/assets/proposal/icons/luma.png.asset.json";
import IconGoogleWorkspaceAsset from "@/assets/proposal/icons/google-workspace.png.asset.json";
import IconNotionMeetingNotesAsset from "@/assets/proposal/icons/notion-meeting-notes.gif.asset.json";


export const IconNotionCalendar = IconNotionCalendarAsset.url;
export const IconNotionMail = IconNotionMailAsset.url;
export const IconNotionApp = IconNotionAppAsset.url;
export const IconNotionAutomations = IconNotionAutomationsAsset.url;
export const IconNotionSkills = IconNotionSkillsAsset.url;
export const IconApollo = IconApolloAsset.url;
export const IconAttio = IconAttioAsset.url;
export const IconKondo = IconKondoAsset.url;
export const IconLuma = IconLumaAsset.url;
export const IconGoogleWorkspace = IconGoogleWorkspaceAsset.url;
export const IconNotionMeetingNotes = IconNotionMeetingNotesAsset.url;
export { IconNotion, IconNotionAI, IconLassie, IconSlack };


export const proposalMeta = {
  ref: "PDL1",
  date: "23 July 2026",
  client: "Poindexter Labs",
  contact: "Jocelyn D'Arcy",
  title: "Held, so you don't have to.",
  subtitle:
    "One relationship system, held in Notion, that consolidates LinkedIn, email, events and meeting history into searchable contact records. You reach it by asking, not by browsing.",
};

export const atAGlanceRows: Array<[string, string]> = [
  ["What", "A Notion relationship system with agents you reach from your phone. Contacts, activity history, pipelines, and three custom agents."],
  ["Timeline", "Six to eight weeks to build, then two months of supported adoption included."],
  ["Investment", "£11,605 net of your diagnostic credit. 40% on signature, then three monthly instalments."],
  ["From you", "Decisions on tagging and field mapping, access to Attio, LinkedIn, Gmail and Luma, and a signed NDA before anything starts."],
  ["Not in this phase", "WhatsApp capture, team rollout, the Google Drive restructure, and Attio records older than January 2026."],
];

export const briefCards = [
  { word: "One spine", body: "LinkedIn, email, events and meeting history consolidated into searchable contact records tagged by opportunity type and skill." },
  { word: "Reached by asking", body: "When someone approaches you, you get a summary. When you're about to ask a favour, you get the full log." },
  { word: "Forget safely", body: "You can forget people safely, then find and reactivate them on purpose. That's the outcome." },
];

export const runningAgentsNote =
  "Agents consume credits on your Notion plan, and consumption scales with how much they watch rather than how much they help. Agents that continuously monitor channels are expensive and can slow noticeably at busy periods. Agents that wake on request are cheap and fast. We can agree an appetite for your monthly credit spend and optimise to sit below that. Keep in mind credits can spike; to prevent that, we can take advantage of Notion's built-in agent caps.";

export const lumaNote =
  "Luma's API gives clean programmatic access to registrations and check-ins, and it would keep event data flowing without you thinking about it. It also requires a Luma Plus subscription on the calendar, currently $59 per month billed annually. Given how often you run events, that is likely poor value. Luma's free tier exports a complete guest CSV per event, which imports into Notion in minutes and preserves the registered-versus-attended distinction you actually need, which was the whole point of the Seoul example. My recommendation is CSV per event to begin with, and we revisit the API if your event cadence grows enough to justify the cost. If you already hold Luma Plus for other reasons, we use the API from day one and this decision disappears.";

export type JourneyStep = { title: string; body: string; state: "done" | "current" | "upcoming" };

export const journeySteps: JourneyStep[] = [
  { title: "Diagnostic", body: "Complete. Confirmed the current setup, the failure modes you named, and the direction worth taking.", state: "done" },
  { title: "NDA", body: "Agreed in principle on the call. Signed by both sides before any access is granted.", state: "upcoming" },
  { title: "This blueprint", body: "Confirm the scope and investment, and we lock a start date.", state: "current" },
  { title: "Access and inventory", body: "Added to Attio, LinkedIn (via Kondo), Gmail and Luma as needed to assess the sources and confirm export formats. Nothing changes underneath you.", state: "upcoming" },
  { title: "Build", body: "The workspace, CRM, activity layer, channel connections and agents take shape. You review as it develops.", state: "upcoming" },
  { title: "Handover, then supported adoption", body: "A working session at the end of the build, then two months of tuning the taxonomy against real use, delivered however suits you.", state: "upcoming" },
];

export type TimelineEntry = {
  label: string;
  when: string;
  owner: string;
  isLaunch: boolean;
  isComplete: boolean;
  note: string;
};

export const timeline: TimelineEntry[] = [
  { label: "Diagnostic. Complete.", when: "July 2026", owner: "Both", isLaunch: false, isComplete: true, note: "Confirmed the current setup, the specific failure modes, and the shape of the system worth building." },
  { label: "Build", when: "Six to eight weeks from sign-off", owner: "Thread & Stack, with Jocelyn's input", isLaunch: false, isComplete: false, note: "The workspace, the CRM, the activity layer, the channel connections and the agents take shape. You'll see it as it develops and shape it as we go. Nothing you currently rely on changes underneath you." },
  { label: "Handover", when: "End of build", owner: "Both", isLaunch: true, isComplete: false, note: "A working session where the system becomes yours: how to ask the agents for things, how the tagging works, how to correct it when it's wrong." },
  { label: "Supported adoption", when: "The two months that follow", owner: "Thread & Stack and Poindexter", isLaunch: false, isComplete: false, note: "Included in the fee. This is where the tagging taxonomy gets tuned against real use, because the first version of any taxonomy is a guess. Delivered however suits you: short calls, async messages, or working alongside you." },
  { label: "From there", when: "Month to month thereafter", owner: "Both", isLaunch: false, isComplete: false, note: "The system runs on its own. We scope the next phase, Slack capture and anything else that's earned its place, once your migration lands and the team structure settles. Optional rolling support at £1,200/month keeps me alongside until you hire an operations owner." },
];

export type StackLayer = {
  icon?: string;
  lucide?: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tag?: string;
};

export const stack: StackLayer[] = [
  { icon: IconNotion, title: "Notion workspace", body: "One permissioned home for contacts, activity, pipelines, tasks and meetings." },
  { icon: IconLassie, title: "Notion AI", body: "Plain-English questions answered from inside your own records." },
  { icon: IconNotionMeetingNotes, title: "Notion AI Meeting Notes", body: "Calls transcribed and summarised onto a Notion page and attached to the right contact. No bot joins the call." },
  { icon: IconNotionAI, title: "Custom agents", body: "The relationship agent, the pre-meeting brief, the triage agent. Small, single-purpose, invoked when needed.", tag: "Three agents included" },
  { icon: IconNotionApp, title: "The Notion apps", body: "Notion and Notion Agents on your phone. Where you reach all of it, in conversation, wherever you happen to be." },

  { icon: IconNotionCalendar, title: "Notion Calendar", body: "Meetings connected to the people in them and the history behind them." },
  { icon: IconNotionMail, title: "Notion mail connector", body: "Email reached on request and on a scheduled sweep, rather than mirrored wholesale." },
  { icon: IconNotionAutomations, title: "Notion automations", body: "The native triggers that move records between states without anyone remembering to." },
  { icon: IconNotionSkills, title: "Notion Skills database", body: "The agents' working instructions in plain language, readable and editable by you." },
];

export type ConnectedSource = {
  icon?: string;
  lucide?: ComponentType<{ className?: string }>;
  title: string;
  body: ReactNode;
};

export const connectedSources: ConnectedSource[] = [
  { icon: IconKondo, title: "Kondo + LinkedIn", body: "DM and connection sync, roughly $50/month. The only reliable route into LinkedIn, and one I use daily on my own workspace." },
  { icon: IconAttio, title: "Attio", body: "A source rather than a destination. Both platforms expose MCP connectors, so the migration runs agent to agent, and Attio is retired afterwards." },
  { icon: IconLuma, title: "Luma", body: "Event registrations and check-ins. See the note below, because the sensible answer here saves you money." },
  { icon: IconApollo, title: "Enrichment provider", body: "Company, role, profile detail and job-change tracking. Selected during the build against your real contacts rather than chosen now on reputation." },
  { icon: IconGoogleWorkspace, title: "Google Workspace", body: "Calendar, contacts and mail sit behind the mail connector and Notion Calendar, so the workspace reads from Google without pulling every message into Notion." },
  { icon: IconSlack, title: "Slack", body: "Not connected in this phase. Notion integrates with it natively, so it becomes straightforward once your migration completes." },
];

export type ScopeGroup = { label: string; summary: string; intro?: string; items: ReactNode[] };

export const scopeGroups: ScopeGroup[] = [
  {
    label: "A. The workspace foundation",
    summary: "Private workspace, personal dashboard, a light task database and calendar.",
    items: [
      <><strong>A private workspace structured around how you actually operate</strong>, with the relationship system separate from anything the team will later need. The CRM stays yours.</>,
      <><strong>Personal dashboard:</strong> your week, your meetings, your open threads, filtered to you.</>,
      <><strong>A task database</strong> linked to contacts, so a follow-up generated by a relationship lands somewhere other than your head. Deliberately light. Team task infrastructure waits until roles settle, as you asked.</>,
      <><strong>Notion Calendar connected</strong> for meeting context and follow-up.</>,
    ],
  },
  {
    label: "B. Contacts: the relationship spine",
    summary: "Stable identifiers, three-track tagging, skills, connection strength, referral source and cold storage.",
    items: [
      <><strong>The Contacts database</strong>, built on stable internal identifiers so a person survives changing their name, email or company. Every record carries opportunity type, connection strength, skills, company and referral source.</>,
      <><strong>Three-track tagging</strong>, built as tags rather than exclusive stages, because your categories overlap by design: fundraising, customer acquisition, recruitment, and not interesting. A researcher who becomes a hire who brings a data contract stays one record throughout.</>,
      <><strong>Skills and subject tagging</strong> so you can search by what someone can do rather than by a name you've forgotten. The taxonomy starts from your own vocabulary and gets refined during adoption.</>,
      <><strong>Connection strength</strong> recorded separately from opportunity type: strong for warm introductions, direct outreach and real conversations, weak for event registrations and unanswered connection requests.</>,
      <><strong>Referral source as a linked field</strong>, pointing at the introducer's own record, so Tilly's introduction to Jack is visible from both sides.</>,
      <><strong>Cold storage with a reactivate-on date</strong>, so "not right now, check back in a couple of months" becomes something the system surfaces rather than something you have to remember.</>,
    ],
  },
  {
    label: "C. The activity database",
    summary: "Every interaction as a record, in date order, with event attendance flagged.",
    items: [
      <><strong>Every interaction as a record</strong>, related to the contact: LinkedIn messages, emails, meetings, event attendance, and anything you capture manually. Full text stored, not only summaries, so the log is reviewable before you ask for something.</>,
      <><strong>Chronological history per contact</strong>, which is what turns "have I already asked this person for something" into a five second check.</>,
      <><strong>Event participation flagged distinctly</strong>, so registrations that never became attendance don't pollute your relationship lists. This was your requirement and it's built in from the start.</>,
    ],
  },
  {
    label: "D. Pipelines",
    summary: "Opportunities, recruitment and fundraising, each on its own lifecycle.",
    items: [
      <><strong>An opportunities pipeline</strong> for customer acquisition and partnerships.</>,
      <><strong>A recruitment pipeline</strong> for exceptional talent, running separately from the standard Poindexter contractor flow.</>,
      <><strong>A fundraising view</strong> running on its own lifecycle, with the reactivate-on dates doing the work between raises.</>,
    ],
  },
  {
    label: "E. Channel capture",
    summary: "LinkedIn via Kondo, email on demand, meeting capture, Luma events, the Attio migration and enrichment.",
    items: [
      <><strong>LinkedIn via Kondo.</strong> DM sync into Notion, with new connections landing in a triage state rather than straight into the active CRM. After an event that adds a hundred people at once, that distinction is the difference between a system you trust and a list you ignore.</>,
      <><strong>Email</strong>, reached through Notion's mail connector and your agents rather than mirrored wholesale into the workspace. You ask for what you need, and a scheduled sweep pulls correspondence with people already in the CRM into their activity record. Two reasons for that design: a complete copy of your mailbox sitting inside Notion would be a liability under your ISO work, and agent consumption scales with the volume of mail being read, so a targeted sweep costs a fraction of a full sync. Showing you how to trigger a sweep when you want one is part of handover.</>,
      <><strong>Luma event data</strong>, registrations and check-ins, so attendance is a fact in the record rather than a guess. Delivered by guest CSV per event on Luma's free tier, or through the Luma API if you hold Luma Plus. See the note further down.</>,
      <><strong>Meeting capture through Notion AI Meeting Notes.</strong> This replaces what Attio currently does for you. Recordings transcribe and summarise onto a Notion page that attaches to the relevant contact, so the activity log keeps filling after Attio is retired and the pre-meeting brief agent always has something recent to work from. No bot joins your calls and no third-party transcription service sits between your conversations and your workspace. Worth knowing how it behaves: the phone app records in the background, so in-person meetings and events are covered from your pocket, but for a remote video call the desktop app is the only mode that captures the other person's audio as well as your own. There is no speaker identification and no automatic joining from your calendar, so starting a recording stays a deliberate act.</>,
      <><strong>Attio migration.</strong> Both Attio and Notion expose MCP connectors, so the transfer runs through an agent rather than by hand. Your 175 meeting transcripts come across as relationship history, attached to the right contacts. Contact and company records created from 1 January 2026 onwards are included. Anything older is a considerably larger job than the transcripts and sits outside this phase, though I'll give you a volume estimate once I've seen the export so you can decide whether it's worth doing.</>,

      <><strong>Data enrichment</strong> for company, role and profile detail, plus periodic refresh so job changes surface without depending on people updating their own headlines. Provider recommendation and costs set out below.</>,
    ],
  },
  {
    label: "F. The agents",
    summary: "Relationship, pre-meeting brief and triage, plus the Skills database behind them.",
    intro: "Small, single-purpose, invoked when needed. The system waits to be asked, with one deliberate exception on your calendar.",
    items: [
      <><strong>A relationship agent</strong> you can ask in plain English, from the Notion app on your phone: who you know with a given skill, who you know at a given company, what the history is with a given person.</>,
      <><strong>A pre-meeting brief agent</strong>, triggered by your calendar. Who they are, how you met, who introduced you, what was last said, and a prompt when it has no idea who this person is.</>,
      <><strong>A triage agent</strong> that takes newly captured contacts and asks the questions needed to classify them properly, so the tagging stays current without you maintaining it.</>,
      <><strong>A Skills database</strong> holding the agents' working instructions in plain language, so you can read what they do, change how they behave, and add new procedures yourself. Combined with custom instructions carrying your standing context and vocabulary.</>,
    ],
  },
  {
    label: "G. Adoption and support",
    summary: "Handover, two months of supported adoption, optional rolling support afterwards.",
    items: [
      <>A handover working session at the end of the build.</>,
      <>Two months of supported adoption included, focused on tuning the taxonomy against real use.</>,
      <>Optional rolling support afterwards at <strong>£1,200/month</strong>, no fixed term, cancellable by either side with 30 days' notice. This covers refinement and support of the system as built. New capability is scoped separately.</>,
    ],
  },
];

export const exclusionsList: ReactNode[] = [
  <><strong>Attio contact and company records created before 1 January 2026.</strong> The meeting transcripts come across in full. Older account records are a larger migration and are scoped separately once we've both seen what the export actually contains.</>,
  <><strong>WhatsApp capture</strong>, for the reasons set out below.</>,
  <><strong>The Google Drive restructure.</strong> Moving from personal Drive folders to Shared Drives, with 300 people's access to untangle, carries its own risks and deserves its own attention. I'll look at the structure so file links point correctly, and I would recommend doing the restructure, but not inside this build.</>,
  <><strong>Team rollout.</strong> Shared task management, team meeting notes and multi-person workflows wait until roles settle, as you asked.</>,
  <><strong>Slack capture</strong>, which becomes worth scoping once your migration completes.</>,
  <><strong>Automated job-change tracking beyond what enrichment provides.</strong> LinkedIn's own signals are unreliable, and I'd rather not promise accuracy I can't hold.</>,
  <><strong>Poindexter contractor management.</strong> The 250 Poindexters stay on your platform for now, though the opportunity for integrating the systems is strong.</>,
];

export const exclusionsFootnote: ReactNode = (
  <>
    Two dependencies worth naming, because they affect timing rather than scope. The build needs{" "}
    <strong>decisions from you at a few specific points</strong>, principally the tagging taxonomy and
    the field mapping, and you are the only person who can make them. If those stall, the build stalls.
    And if scope changes materially once we are underway, we'll agree the effect on time and cost in
    writing before anything moves.
  </>
);

export const beforeWeStartList: string[] = [
  "The NDA signed on both sides, ahead of anything else.",
  "Access to your Attio account, to assess the 175 transcripts and confirm export format.",
  "Sample LinkedIn threads and Gmail correspondence, to confirm the sync scope and how far back to reach.",
  "Luma export or API access.",
  "Confirmation of your Notion plan and entitlement.",
  "A view of your Google Drive structure, so we know whether file linking belongs in this phase or the next.",
  "Your best current guess at the Slack migration timing, since it determines when channel capture becomes worth scoping.",
];

export const investmentRows: Array<[ReactNode, ReactNode]> = [
  ["Relationship system build (6 to 8 week build + 2 month supported adoption)", "£12,000"],
  ["Diagnostic fee, already paid", <span className="text-gradient-warm font-semibold">–£395 credited</span>],
  [<strong>Net investment</strong>, <strong>£11,605</strong>],
];

export const paymentScheduleRows: Array<[ReactNode, ReactNode]> = [
  ["On signature (40% deposit, diagnostic credit applied)", "£4,405"],
  ["End of month one", "£2,400"],
  ["End of month two", "£2,400"],
  ["End of month three", "£2,400"],
  [<strong>Total</strong>, <strong>£11,605</strong>],
];

export const paymentScheduleNote =
  "The deposit is 40% of the build fee (£4,800) with the £395 diagnostic credit applied. Payment completes during supported adoption, so cost tracks alongside delivery rather than landing as one sum.";

export const subscriptionsIntro =
  "These are not part of the project fee and are paid to the providers rather than to Thread & Stack. Figures are working estimates as of July 2026 and should be confirmed before commitment.";

export const subscriptionsList: ReactNode[] = [
  <><strong>Notion.</strong> You mentioned a VC-backed startup entitlement, and I'll send the affiliate signup route as a backup. Plan choice affects which AI features are available, so worth settling early.</>,
  <><strong>Notion AI and agent consumption.</strong> Charged against your Notion plan. Expect somewhere in the region of £20 to £30 per seat per month once the agents are running, with email volume the largest single driver, since every message an agent reads costs something. This is a figure we can optimise rather than fix. The invoked-not-ambient design keeps it low, targeted sweeps keep it lower, and I'll show you where the levers are during adoption. Worth watching across the first two months rather than treating month one as representative.</>,
  <><strong>Kondo</strong>, for LinkedIn DM sync, roughly $50 per month.</>,
  <><strong>Luma.</strong> No cost on the free tier using CSV export per event. The API route requires Luma Plus at $59 per month billed annually, which I would not recommend at your current event frequency.</>,
  <><strong>Data enrichment</strong>, roughly £40 to £80 per month depending on provider. Cognism is the strongest UK option on compliance, London-based and independently certified, but is priced for enterprise teams and would be poor value for one user. Kaspr, its smaller sibling, is affordable and EU-compliant but weaker on North American data, which is where most of your network sits. Apollo covers your geography better and tracks job changes well, though API access sits on its higher tier. My recommendation is to trial two against a sample of your real contacts during the build and choose on match rate rather than on marketing.</>,
];

export const termsMain: ReactNode[] = [
  <>Thread &amp; Stack Ltd is not currently VAT registered. No VAT is applicable.</>,
  <>Payment is a 40% deposit on signature with the diagnostic credit applied, then three equal monthly instalments. <strong>15% late charge applies after 30 days.</strong></>,
];

export const termsExpandable: ReactNode[] = [
  <><strong>Company details.</strong> Thread &amp; Stack Ltd, company number 17344201.</>,
  <><strong>Insurance.</strong> Thread &amp; Stack Ltd carries professional indemnity to £2,000,000 per claim, public and products liability to £1,000,000, and cyber and data cover to £2,000,000. Certificates are available on request for your supplier records.</>,
  <><strong>Confidentiality.</strong> Thread &amp; Stack can provide a standard mutual non-disclosure agreement at no charge, signed on request and covering both directions. Where Poindexter Labs prefers to use its own agreement, it will be reviewed in good faith. Where a client agreement requires external legal review, for instance where it carries liquidated damages, indemnities or similar provisions, the cost of that review is recharged and agreed in writing before it is incurred. Nothing arrives on an invoice without having been agreed first.</>,
  <>Thread &amp; Stack Ltd is a <strong>Certified Notion Consulting Partner</strong>, but operates independently of Notion. Notion retains all rights to its own products, and responsibility for its service delivery, uptime, security and product changes sits with Notion. Thread &amp; Stack accepts no liability for the failure, outage or change of Notion's software, or of any other third-party software Poindexter Labs uses.</>,
  <>Poindexter Labs' licensing, payment and data relationships with Notion and every other provider are held directly between Poindexter Labs and those providers. Thread &amp; Stack is not a party to those agreements.</>,
];

export type WhatsAppCard = { label: string; body: ReactNode };

export const whatsappCards: WhatsAppCard[] = [
  {
    label: "Twilio is the wrong tool",
    body: "Twilio, which we discussed on the call, is built for businesses sending large volumes of outbound messages, and registering your number there would require deleting your WhatsApp account first.",
  },
  {
    label: "Meta's Coexistence feature does work",
    body: (
      <>
        You would move your existing number from consumer WhatsApp to the free WhatsApp Business app,
        keeping the number and restoring your history, then connect it to the Cloud API through an
        approved provider. On connection, Meta delivers your contact list and the previous 180 days of
        one to one messages, and mirrors every message after that in both directions with no effort
        from you.{" "}
        <a
          href="https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Meta's documentation
        </a>{" "}
        covers the full flow.
      </>
    ),
  },
  {
    label: "What it can't do",
    body: "Group chats never sync, so your contractor community stays invisible. History stops at 180 days. Turning it on permanently disables disappearing messages, view once and live location on your one to one chats. The history transfer is a single attempt inside a 24 hour window.",
  },
];

// URL captured explicitly for the print page so paper readers can type it out.
export const metaWhatsAppDocsUrl =
  "https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users";

export const whatsappReasons: ReactNode[] = [
  <>Your company is moving to Slack, which connects to Notion natively and covers the same need without any of this.</>,
  <>It requires a provider subscription and a Meta business relationship that neither of us controls.</>,
  <>It would pull your entire personal life into a CRM pipeline alongside your professional contacts, which is an awkward thing to be doing while you're certifying to ISO 27001.</>,
  <>It makes the most visible part of your build dependent on steps only you can complete.</>,
];

export const whatsappClosing: ReactNode[] = [
  <>Where the system has no record, the agent asks you. You described this yourself on the call: the prompt appears, you paste or screenshot the context, and the record is complete. That takes seconds and it costs nothing.</>,
  <>If you still want automated capture after the Slack migration settles, the path is documented above and we can scope it then, from a position of knowing what's actually left in WhatsApp.</>,
];

export const complianceParagraphs: ReactNode[] = [
  <>You are certifying to ISO 27001, so this belongs in the document rather than in a footnote.</>,
  <>Building this system means processing personal data belonging to several hundred people who have not been asked. Under UK GDPR that makes Poindexter Labs the controller. The position is defensible and standard for relationship management, since these are people you have met, corresponded with or been introduced to, and the processing keeps existing records accurate rather than acquiring new contacts. It does need to be written down rather than assumed: a lawful basis under legitimate interests, a legitimate interests assessment, a retention position, and an entry in your record of processing activities. I'll provide a draft of the technical description for whoever handles your certification.</>,
  <>Enrichment adds a second consideration, since the provider processes contact data on your behalf. Whoever we select needs a data processing agreement in place before we connect it. I'll confirm certifications as part of the recommendation.</>,
  <>Notion's permission model works in your favour here. Access controls what each person sees, and Notion AI respects those boundaries, so when the team grows, junior members querying the workspace cannot surface what they cannot open.</>,
  <>On the supplier side of your certification, Thread &amp; Stack Ltd carries cyber and data cover to £2,000,000 alongside professional indemnity, and holds a signed mutual NDA with you before any access is granted. Full details sit under Terms above, and certificates are available for your supplier file.</>,
];

export const successMeasuresIntro =
  "We didn't set success measures on the call and the goal, cognitive relief, resists measurement. Three checks I'd suggest, reviewed at the end of supported adoption.";

export const successMeasures: ReactNode[] = [
  <>You can answer a "who do I know who…" question in under a minute, from your phone, with enough context to act on.</>,
  <>No contact reaches a meeting without you knowing who introduced you.</>,
  <>You have reactivated at least one dormant relationship deliberately, because the system surfaced it rather than because you happened to remember.</>,
];

export const successMeasuresClosing =
  "If those three hold, the system is working. If they don't, we know precisely what to fix.";

export const section09Paragraphs: ReactNode[] = [
  <>Notion's own positioning is <strong>"Where teams and agents build together"</strong>. By establishing Notion as the core system, agents as the working layer, and the Notion app as your interface, some things open up for when your team settles in: asking what's outstanding across the team and getting a straight answer, assigning something to Gab or Isaac from your phone and having it tracked without you holding it, team meeting notes accumulating into shared context rather than living in individual heads, and client and partner conversations captured from Slack into the right records once your migration completes.</>,
  <><strong>Importantly: your relationship intelligence can stay private throughout.</strong> The CRM sits in its own permissioned teamspace, and expanding the workspace around it doesn't expose it to anyone you don't want it to.</>,
];
