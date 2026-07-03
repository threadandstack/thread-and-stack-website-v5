// Shared, authored, current page content for crawler-visible prerender
// and the llms-full.txt dump. Update copy here when site positioning shifts.
//
// Copy rules (hard ban): no em dashes, no "X isn't Y, it's Z", no rule-of-three
// cadence, no restating the reader's situation. Lead with outcomes.

export interface PageContent {
  path: string;
  title: string; // <title> and og:title (<= 60 chars ideal)
  description: string; // <meta description> (<= 160 chars ideal)
  h1: string;
  // Body paragraphs rendered as <p>. Use short list arrays for bullet groups.
  body: Array<string | { heading: string; paragraphs?: string[]; bullets?: string[] }>;
  // Optional schema.org JSON-LD type. Defaults to WebPage.
  schemaType?: "WebPage" | "AboutPage" | "Service" | "Event" | "CollectionPage" | "ContactPage" | "FAQPage";
  // Optional pricing or event details for JSON-LD enrichment.
  eventLocation?: string;
  eventStartDate?: string;
  // If set, this URL is a legacy/redirect alias. Prerender will set canonical
  // + og:url to redirectTo, emit noindex,follow, and skip JSON-LD. Body still
  // renders so LLMs that land here get real text instead of homepage boilerplate.
  redirectTo?: string;
  // Optional breadcrumb section. Used to emit BreadcrumbList JSON-LD.
  breadcrumb?: { name: string; path: string };
}

export const SITE = "https://threadandstack.com";

export const pages: PageContent[] = [
  {
    path: "/",
    title: "Thread & Stack — Ops, Strategy & Systems that shift culture",
    description:
      "Ops, Strategy & Systems that shift culture. Thread & Stack helps purpose-led teams — with a leaning toward creatives — build the operating layer that lets real people do their best work.",
    h1: "Ops, Strategy & Systems that shift culture.",
    schemaType: "WebPage",
    body: [
      "Thread & Stack is the studio of Brendan Rodgers, a designer, strategist, and systems partner. We help purpose-led teams — with a leaning toward creatives — build the operating layer that lets real people do their best work.",
      "Brand promise: Stories that land. Systems that stick.",
      {
        heading: "What we work on",
        paragraphs: [
          "Two pillars, no add-ons. Systems consultancy leads: we design the operating layer — workflows, documentation, and automation — that shifts how a team actually works day to day. Narrative work is retained as the second pillar, called in when the story on the outside needs to match the way the team runs on the inside.",
        ],
        bullets: [
          "Ops, Strategy & Systems Consultancy (lead pillar): operating systems, workspace design, workflow and automation, documentation that holds up under real use.",
          "Narratives & Strategy (secondary): positioning, brand story, go-to-market clarity, message architecture, launch narratives.",
        ],
      },
      {
        heading: "Who we work with",
        paragraphs: [
          "Founders and teams of roughly five to fifty people who have outgrown a folder of Google docs and a website that no longer matches the room. A leaning toward creative-led organisations — studios, agencies, purpose-driven brands — plus health, education, communities, and impact organisations.",
        ],
      },
      {
        heading: "How to start",
        paragraphs: [
          "Most engagements start with a paid diagnostic that produces a written read of where you are and what to do next. From there, fixed-scope projects, monthly retainers, or a senior strategy partner on call.",
        ],
      },
    ],
  },
  {
    path: "/about",
    title: "About Brendan Rodgers — Thread & Stack",
    description:
      "Brendan Rodgers is a designer, strategist, and certified Notion partner. Founder of Thread & Stack.",
    h1: "About Brendan Rodgers",
    schemaType: "AboutPage",
    body: [
      "Brendan Rodgers is the founder of Thread & Stack. Designer, strategist, and certified Notion partner based in the UK.",
      "His work sits at the intersection of two skills that rarely live in one head: telling the story (narrative, positioning, message architecture) and building the system that makes the story true day to day (workspaces, rituals, automation). The combination is what lets purpose-led teams move with confidence.",
      "Background spans brand, narrative, and operating-system design across enterprises, startups, charities, and impact organisations.",
    ],
  },
  {
    path: "/how-i-work",
    title: "How I work — Thread & Stack",
    description:
      "Engagements start with a short diagnostic to map where intention and execution come apart, then ship the smallest set of changes that move the team this quarter.",
    h1: "How I work",
    schemaType: "WebPage",
    body: [
      "Engagements start with a short diagnostic to map where intention and execution come apart. From there, the work is shaped around the smallest set of changes that will actually move the team this quarter.",
      {
        heading: "Principles",
        bullets: [
          "Propose the problem before the solution.",
          "Lead with outcomes, not framework names.",
          "Design for the people who will use the system, not the people who will admire the diagram.",
          "Ship in small, reviewable increments.",
          "Hand over with documentation a new joiner could follow.",
        ],
      },
    ],
  },
  {
    path: "/services",
    title: "Services — Thread & Stack",
    description:
      "Two pillars: Narratives & Strategy and Notion & Systems Consultancy. Standard terms: 50% upfront, 50% on delivery.",
    h1: "Services",
    schemaType: "Service",
    body: [
      "Two pillars only. No workshops-as-a-service, no clarity sessions, no add-ons.",
      {
        heading: "Narratives & Strategy",
        paragraphs: [
          "Positioning, brand story, go-to-market clarity, message architecture, launch narratives. For founders and leadership teams that know what they do but cannot yet say it in one breath.",
        ],
      },
      {
        heading: "Notion & Systems Consultancy",
        paragraphs: [
          "Workspace design, operating systems, automation, documentation that holds up under real use. For teams that have outgrown a folder of Google docs and need an operating layer that scales with them.",
        ],
      },
      {
        heading: "Commercial terms",
        paragraphs: [
          "50% upfront, 50% on delivery. 15% late payment charge. Not VAT registered.",
        ],
      },
    ],
  },
  {
    path: "/work-with-me",
    title: "Work with me — Thread & Stack",
    description:
      "Paid diagnostic, fixed-scope projects, monthly retainers, and fractional engagements. Pick the right starting point.",
    h1: "Work with me",
    schemaType: "WebPage",
    body: [
      "Engagement options range from a paid diagnostic (a short, structured session that produces a written read of where you are and what to do next), through fixed-scope projects, to monthly retainers and full fractional engagements.",
      "The right starting point depends on whether you need a decision, a deliverable, or a thinking partner.",
    ],
  },
  {
    path: "/workshops",
    title: "Workshops — Thread & Stack",
    description:
      "Group workshops for working teams on narrative, Notion, and the human side of AI. Concrete outcomes, not generic decks.",
    h1: "Workshops",
    schemaType: "Service",
    body: [
      "Group workshops for teams on narrative, Notion, and the human side of working with AI. Designed for working teams, not generic audiences.",
      "Outcomes are concrete: a finished artefact, a shared vocabulary, or an operating ritual the team can keep using on Monday.",
    ],
  },
  {
    path: "/intro-call",
    title: "Book an intro call — Thread & Stack",
    description:
      "Free 30-minute intro call to pressure-test the brief and see if Thread & Stack is the right fit.",
    h1: "Book an intro call",
    schemaType: "ContactPage",
    body: [
      "A free 30-minute intro call. Use it to talk through your project, pressure-test the brief, and see if Thread & Stack is the right fit. No deck, no sales script.",
    ],
  },
  {
    path: "/scorecard",
    title: "Clarity Scorecard — Thread & Stack",
    description:
      "Short self-assessment that scores your clarity, systems, and momentum, and points to where to focus next quarter.",
    h1: "Clarity Scorecard",
    schemaType: "WebPage",
    body: [
      "A short self-assessment that scores your clarity, systems, and momentum. Answer a handful of questions and receive a personal read on where to focus next quarter.",
    ],
  },
  {
    path: "/momentum-map",
    title: "Momentum Map — Thread & Stack",
    description:
      "Diagnostic for teams stuck between intention and execution. Surfaces the one shift that releases the most momentum.",
    h1: "Momentum Map",
    schemaType: "WebPage",
    body: [
      "A diagnostic for teams stuck between intention and execution. The map surfaces the one shift that will release the most momentum, then proposes the smallest move that delivers it.",
    ],
  },
  {
    path: "/collective",
    title: "The Thread & Stack Collective",
    description:
      "A small collective of trusted strategists, designers, and Notion specialists brought in by name when projects need more than one head.",
    h1: "The Thread & Stack Collective",
    schemaType: "WebPage",
    body: [
      "A small collective of trusted strategists, designers, and Notion specialists. Brought in by name on projects that need more than one head and one set of hands.",
      "Each collaborator has been worked with directly before they are invited into a client engagement.",
    ],
  },
  {
    path: "/retainer/launch",
    title: "Launch Retainer — Thread & Stack",
    description:
      "Light-touch monthly retainer for early-stage founders. Senior narrative and systems input on call.",
    h1: "Launch Retainer",
    schemaType: "Service",
    body: [
      "Light-touch monthly retainer for early-stage founders. Senior narrative and systems input on call, without the cost of a full engagement.",
      "Best for founders who need someone in the corner of the ring through a launch window or a funding round.",
    ],
  },
  {
    path: "/retainer/startup",
    title: "Startup Retainer — Thread & Stack",
    description:
      "Mid-tier retainer for growing teams. Around one day a week of senior narrative and messaging leadership.",
    h1: "Startup Retainer",
    schemaType: "Service",
    body: [
      "Mid-tier retainer for growing teams. Around one day a week of senior narrative and messaging leadership for early-stage teams launching a new brand.",
      "Day rate roughly £700 to £850. Monthly range roughly £3,500 to £4,100.",
      "Cadence flexes lighter when things are steady, more intensive around launches and pitches. Additional days can be added at an agreed rate.",
    ],
  },
  {
    path: "/retainer/scaleup",
    title: "Scale-Up Retainer — Thread & Stack",
    description:
      "Senior fractional engagement for scale-ups. One to two days a week of experienced narrative and messaging direction.",
    h1: "Scale-Up Retainer",
    schemaType: "Service",
    body: [
      "Senior fractional engagement for scale-ups. Roughly one to two days a week of experienced narrative and messaging direction.",
      "Day rate roughly £900 to £1,000+. Monthly range roughly £4,500 to £8,900+.",
      "For established organisations scaling a brand or launching a new vertical.",
    ],
  },
  {
    path: "/notion-masterclass",
    title: "Notion Masterclass — Thread & Stack",
    description:
      "Deep-dive masterclass on building Notion workspaces that hold up under real use.",
    h1: "Notion Masterclass",
    schemaType: "Service",
    body: [
      "A deep-dive masterclass on building Notion workspaces that hold up under real use.",
      "Architecture, automation, and the operating rhythms that make a workspace stick beyond the first week.",
    ],
  },
  {
    path: "/unleash-your-team",
    title: "Unleash Your Team — Thread & Stack",
    description:
      "Workshop and engagement that pairs clear narrative with operating systems so teams unblock execution.",
    h1: "Unleash Your Team",
    schemaType: "Service",
    body: [
      "A workshop and engagement that helps teams unblock execution. Pairs clear narrative with the operating systems that make work move.",
      "Output is something the team uses, not a slide deck.",
    ],
  },
  {
    path: "/blueprint/become-united",
    title: "Become United Blueprint — Thread & Stack",
    description:
      "Strategy blueprint for purpose-led organisations that want to align story, systems, and team rhythm around a single direction.",
    h1: "Become United Blueprint",
    schemaType: "Service",
    body: [
      "A strategy blueprint for purpose-led organisations that want to align story, systems, and team rhythm around a single direction.",
      "Produced as a working document the leadership team can act from.",
    ],
  },
  {
    path: "/notion-hackathon-london",
    title: "Notion Hackathon London — Thread & Stack",
    description:
      "Community Notion build day in London. Spend a focused day building real workspaces with other Notion makers.",
    h1: "Notion Hackathon London",
    schemaType: "Event",
    eventLocation: "London, United Kingdom",
    body: [
      "A community Notion build day in London. Spend a focused day building real workspaces alongside other Notion makers.",
      "Hosted by Thread & Stack.",
    ],
  },
  {
    path: "/notion-devotion-brighton",
    title: "Notion Devotion Brighton — Thread & Stack",
    description:
      "Friendly Notion community meetup in Brighton. Talks, demos, and time with other Notion makers.",
    h1: "Notion Devotion Brighton",
    schemaType: "Event",
    eventLocation: "Brighton, United Kingdom",
    body: [
      "A friendly Notion community meetup in Brighton. Talks, demos, and time with other Notion makers on the south coast.",
    ],
  },
  {
    path: "/charity-meetup-april26",
    title: "Charity Sector Meetup, April 26 — Thread & Stack",
    description:
      "Meetup for purpose-led operators working in and around the charity sector. Shared problems, practical fixes.",
    h1: "Charity Sector Meetup, April 26",
    schemaType: "Event",
    eventLocation: "United Kingdom",
    eventStartDate: "2026-04-26",
    body: [
      "A meetup for purpose-led operators working in and around the charity sector. Shared problems, practical fixes, and a chance to compare notes across organisations.",
    ],
  },
  {
    path: "/portfolio/creative",
    title: "Creative Portfolio — Thread & Stack",
    description:
      "Selected creative, narrative, and brand work. Full portfolio available on request behind a simple password gate.",
    h1: "Creative Portfolio",
    schemaType: "CollectionPage",
    body: [
      "Selected creative, narrative, and brand work.",
      "Full portfolio is available on request, behind a simple password gate for confidentiality.",
    ],
  },
  {
    path: "/portfolio/notion",
    title: "Notion Portfolio — Thread & Stack",
    description:
      "Selected Notion workspace, operating system, and automation builds.",
    h1: "Notion Portfolio",
    schemaType: "CollectionPage",
    body: ["Selected Notion workspace, operating system, and automation builds."],
  },
  {
    path: "/blog",
    title: "Thread & Stack Journal — essays on narrative and systems",
    description:
      "Essays on narrative, systems, Notion, AI, and the creative tax. The Thread & Stack Journal.",
    h1: "Thread & Stack Journal",
    schemaType: "CollectionPage",
    body: [
      "Essays on narrative, systems, Notion, AI, and the creative tax. Notes from running a small studio that builds operating layers for purpose-led teams.",
    ],
  },
  {
    path: "/favourite-fiction",
    title: "Favourite Fiction — Thread & Stack",
    description:
      "Personal reading list. Novels and short fiction that shape how Brendan thinks about narrative.",
    h1: "Favourite Fiction",
    schemaType: "WebPage",
    body: [
      "A personal reading list. The novels and short fiction that shape how Brendan thinks about narrative, character, and the systems people build to live inside.",
    ],
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Thread & Stack",
    description:
      "How Thread & Stack collects, uses, and protects personal data. GDPR-aligned.",
    h1: "Privacy Policy",
    schemaType: "WebPage",
    body: [
      "Plain-English summary of how Thread & Stack collects, uses, and protects personal data. GDPR-aligned.",
      "Lead capture forms include explicit consent. Cookies require consent before any non-essential tag fires.",
    ],
  },
  {
    path: "/data-guarantee",
    title: "Data Guarantee — Thread & Stack",
    description:
      "How client data is handled, stored, and never sold. The standards held to on every engagement.",
    h1: "Data Guarantee",
    schemaType: "WebPage",
    body: [
      "The promises Thread & Stack makes on how client data is handled, stored, and never sold.",
      "The standards held to on every engagement.",
    ],
  },
  // ---------------------------------------------------------------------------
  // Legacy / redirect aliases. The SPA serves a <Navigate> at runtime, but
  // crawlers that hit these URLs directly get a real, route-specific HTML
  // document with a canonical pointing at the current home of the content.
  // ---------------------------------------------------------------------------
  {
    path: "/notion-systems",
    redirectTo: "/services",
    title: "Notion & Systems Consultancy — Thread & Stack",
    description:
      "Notion workspace design, operating systems, automation, and documentation. Now part of the two-pillar services page.",
    h1: "Notion & Systems Consultancy",
    body: [
      "Notion & Systems Consultancy is one of two service pillars at Thread & Stack. Workspace design, operating systems, automation, and documentation that holds up under real use.",
      "Full details, tiers, and pricing live on the services page.",
    ],
  },
  {
    path: "/fractional-deep-engagement",
    redirectTo: "/services",
    title: "Fractional engagement — Thread & Stack",
    description:
      "Senior fractional narrative and systems leadership. Now offered through the retainer tiers.",
    h1: "Fractional engagement",
    body: [
      "Senior fractional narrative and systems leadership. Now offered through the Launch, Startup, and Scale-Up retainer tiers under the services page.",
    ],
  },
  {
    path: "/sessions-and-sprints",
    redirectTo: "/services",
    title: "Sessions & sprints — Thread & Stack",
    description:
      "Short engagements and working sessions. Folded into the diagnostic and fixed-scope project routes under services.",
    h1: "Sessions & sprints",
    body: [
      "Short engagements and working sessions have been folded into the paid diagnostic and fixed-scope project routes. See the services page for current options.",
    ],
  },
  {
    path: "/narratives-strategy",
    redirectTo: "/services",
    title: "Narratives & Strategy — Thread & Stack",
    description:
      "Positioning, brand story, go-to-market clarity, message architecture, launch narratives. Now part of the two-pillar services page.",
    h1: "Narratives & Strategy",
    body: [
      "Narratives & Strategy is one of two service pillars at Thread & Stack. Positioning, brand story, go-to-market clarity, message architecture, and launch narratives.",
      "Full details live on the services page.",
    ],
  },
  {
    path: "/clarity-sessions",
    redirectTo: "/services",
    title: "Clarity sessions — Thread & Stack",
    description:
      "Clarity sessions have been replaced by the paid diagnostic. See the services page for the current entry point.",
    h1: "Clarity sessions",
    body: [
      "Clarity sessions have been replaced by the paid diagnostic. See the services page for the current entry point.",
    ],
  },
  {
    path: "/mentorship-sprint",
    redirectTo: "/services",
    title: "Mentorship sprint — Thread & Stack",
    description:
      "Mentorship sprints have been folded into the retainer tiers. See the services page.",
    h1: "Mentorship sprint",
    body: [
      "Mentorship sprints have been folded into the Launch and Startup retainer tiers. See the services page.",
    ],
  },
  {
    path: "/fractional-strategy",
    redirectTo: "/services",
    title: "Fractional strategy — Thread & Stack",
    description:
      "Fractional strategy is offered through the Scale-Up retainer tier. See the services page.",
    h1: "Fractional strategy",
    body: [
      "Fractional strategy is offered through the Scale-Up retainer tier. See the services page.",
    ],
  },
  {
    path: "/deep-engagement",
    redirectTo: "/services",
    title: "Deep engagement — Thread & Stack",
    description:
      "Long-form embedded engagements are offered through the Scale-Up retainer tier. See the services page.",
    h1: "Deep engagement",
    body: [
      "Long-form embedded engagements are offered through the Scale-Up retainer tier. See the services page.",
    ],
  },
];

