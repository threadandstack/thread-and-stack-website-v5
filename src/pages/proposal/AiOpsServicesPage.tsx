import ServicesOnePager, { Offer } from "./ServicesOnePager";

const offers: Offer[] = [
  {
    num: "1",
    title: "Notion Session",
    shape: "Rapid Intervention",
    scope: "60-minute triage session",
    emotional:
      "A single focused session to unblock a specific Notion problem, validate a workspace decision, or fix a broken workflow. Listed on the Notion marketplace as the Triage Session.",
    concrete:
      "You leave with a recording, full notes, and a clear action plan that tells you exactly what to do next.",
    bestFor:
      "Anyone with a stuck Notion question, a workspace decision to validate, or a workflow that has quietly broken.",
  },
  {
    num: "2",
    title: "Notion Mentorship",
    shape: "Concentrated Project",
    scope: "Six weeks of 1:1 sessions plus async access",
    emotional:
      "Coaching with Notion and AI tutoring built in. We build your systems together inside your actual workspace, session by session, so you come away with something that works and the confidence to keep developing it yourself.",
    includes: [
      "Weekly 1:1 sessions inside your workspace",
      "Async Slack access between sessions",
      "Notion and AI tutoring tailored to your goals",
      "A working system you own at the end",
    ],
    bestFor:
      "Founders and operators who learn by doing, or anyone who wants to understand what they are building rather than just receive it.",
  },
  {
    num: "3",
    title: "Workspace Architect",
    shape: "Concentrated Project",
    scope: "End-to-end systems build",
    emotional:
      "The end-to-end build for organisations carrying too many tools, too many tabs, and too many places the same information lives. We optimise the operational stack to reduce fragmentation, collapse duplicated effort, and break down the silos that have quietly grown between teams.",
    includes: [
      "Stack audit and workflow mapping across existing tools",
      "Information architecture, permissions, and admin configuration",
      "System consolidation, migration, and team workflow design",
      "Change management, documentation, training, and handover",
    ],
    bestFor:
      "Founders and teams ready to commit to a single source of truth, or anyone whose stack has sprawled and stalled.",
  },
  {
    num: "4",
    title: "Notion AI, Agents and Workflows",
    shape: "Concentrated Project",
    scope: "Discovery included",
    emotional:
      "Your Notion workspace exists. The question is whether it is actually doing any work while you are there. Through a focused discovery process we identify the workflows that matter most, then design and build the agents that run them.",
    concrete:
      "Inbox managers, pipeline trackers, content processors, briefing tools — whatever the business actually needs. You leave with custom agents, integrated workflows, and Notion AI embedded into the workspace from the start.",
    includes: [
      "Discovery sprint to identify high-leverage workflows",
      "Custom agent design and implementation",
      "Notion AI embedded across daily operations",
      "Integration with the tools you already use",
    ],
    bestFor:
      "Teams already in Notion who want to move beyond databases and into automation. Founders who want AI doing real operational work rather than sitting as a novelty.",
  },
  {
    num: "5",
    title: "Fractional Ops & Automations Director",
    shape: "Ongoing Partnership",
    scope: "Bespoke monthly retainer",
    emotional:
      "Embedded operational support on a monthly basis. Notion administration, AI automations, and a new system focus each month, with async drop-in access for ops questions in between.",
    includes: [
      "Monthly system focus and optimisation sprint",
      "Ongoing Notion administration and maintenance",
      "AI workflow design and automation support",
      "Slack access for ops questions and unblocking",
    ],
    bestFor:
      "Organisations that have completed a build and want their Notion workspace to grow and evolve alongside the business.",
  },
];

const AiOpsServicesPage = () => (
  <ServicesOnePager
    metaTitle="AI & Operations Services · Thread & Stack"
    kicker="Services · AI & Operations"
    headline={
      <>
        Systems that <span className="text-[#FF6200]">stick</span>. AI that earns its keep.
      </>
    }
    intro="For the Notion workspace, the agents that run inside it, and the operational systems that hold the work together. We build Notion environments that make the team faster, then layer AI on top in the places where it actually saves time rather than wasting it."
    trackTitle="AI & Operations"
    trackBlurb="Five named ways to work — from a single triage session through to embedded fractional ops leadership. Every engagement starts with a scoping conversation so we shape the work around what your workspace and team actually need."
    offers={offers}
    startBlurb="The lowest-friction first step is a Notion Session. Most engagements begin there and develop into a build, a mentorship, or a retainer from that conversation. For ongoing partnerships, we usually run a planning conversation first to map the utopia state of the business, so the retainer is shaped around what you actually need."
  />
);

export default AiOpsServicesPage;
