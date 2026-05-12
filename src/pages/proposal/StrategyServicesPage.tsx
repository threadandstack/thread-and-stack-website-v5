import ServicesOnePager, { Offer } from "./ServicesOnePager";

const offers: Offer[] = [
  {
    num: "1",
    title: "Strategy Session",
    shape: "Rapid Intervention",
    scope: "60-minute focused session",
    emotional:
      "A single, focused session to pressure-test a positioning question, unblock a stuck launch, or get a second opinion that has nothing to lose. Useful when the team has been turning a problem over for too long and wants someone outside the room to name it cleanly.",
    concrete:
      "You leave with a recording, a full transcript, and a bulleted action plan you can take straight into the next week.",
    bestFor:
      "Founders and marketing leads who need a sharp second opinion or a reset on a single, defined question.",
  },
  {
    num: "2",
    title: "Brand repair and evolution",
    shape: "Concentrated Project",
    scope: "Typical scope 4 to 8 weeks",
    emotional:
      "For when the story you have been telling about yourselves has quietly stopped matching what you actually do. The audience has moved on, the team has grown into something new, the work has deepened, and the words have stayed where they were.",
    concrete:
      "We rebuild the narrative from the inside, working with the people who carry the brand day to day, not just the assets on the shelf.",
    includes: [
      "Positioning audit and stakeholder discovery",
      "Narrative architecture and messaging framework",
      "Voice and tone reset",
      "Creative direction handover",
    ],
    bestFor:
      "Organisations five to fifteen years in, where the brand has matured but the language hasn't kept pace.",
  },
  {
    num: "3",
    title: "Product launch and piloting",
    shape: "Concentrated Project",
    scope: "6 to 12 weeks, staged around the launch window",
    emotional:
      "For when there is a new thing in the world, or about to be, and the question is whether it will find the audience it is built for. Launches are mostly an exercise in patience and signal, not noise.",
    concrete:
      "We design the launch in a way that lets you learn what is actually true about the market while still putting something credible into it.",
    includes: [
      "Launch narrative and audience definition",
      "Messaging frameworks and channel sequencing",
      "Pilot design and feedback loops",
      "Post-launch positioning shifts",
    ],
    bestFor:
      "Founders, marketing leaders, or product teams bringing something new to a defined audience.",
  },
  {
    num: "4",
    title: "Journey design and experience",
    shape: "Concentrated Project",
    scope: "Typical scope 4 to 8 weeks",
    emotional:
      "There is usually a moment in a customer journey where someone decides whether they trust you or not, and it is rarely the moment the marketing team is looking at.",
    concrete:
      "We map the actual path your customers take, find the friction and the gaps, and rebuild the moments that matter most.",
    includes: [
      "Customer journey audit and moment mapping",
      "Touchpoint design across the lifecycle",
      "Content and message coordination across channels",
      "Internal alignment workshops",
    ],
    bestFor:
      "Organisations where marketing, sales, product, and service have grown apart, and the customer is feeling the seams.",
  },
  {
    num: "5",
    title: "Fractional Strategy Director",
    shape: "Ongoing Partnership",
    scope: "Bespoke monthly retainer",
    emotional:
      "Embedded strategic and creative leadership on a monthly basis. Brand positioning, campaign direction, creative oversight — the conversations you would have with a senior in-house strategist if you had one, without the overhead of bringing one in.",
    includes: [
      "Monthly strategy sessions and ongoing Slack access",
      "Positioning and messaging continuity",
      "Campaign and marketing system guidance",
      "Quarterly reviews and scaleable commitment",
    ],
    bestFor:
      "Founders and marketing leads who want a senior voice in the room without the full-time cost.",
  },
];

const StrategyServicesPage = () => (
  <ServicesOnePager
    metaTitle="Strategy & Narrative Services · Thread & Stack"
    kicker="Services · Strategy & Narrative"
    headline={
      <>
        Stories that <span className="text-[#FF6200]">land</span>. Positioning that holds.
      </>
    }
    intro="For the brand, the positioning, the message, and the way an organisation makes itself understood. Useful when something has stopped landing the way it used to, or when something new is about to land for the first time."
    trackTitle="Strategy & Narrative"
    trackBlurb="Five named ways to work — from a single pressure-test session through to embedded fractional leadership. Every engagement starts with a scoping conversation so we shape the work around what's actually in front of you."
    offers={offers}
    startBlurb="The lowest-friction first step is a Strategy Session. Most engagements begin there and develop into a project or a retainer from that conversation. For ongoing partnerships, we usually run a planning conversation first to map the utopia state of the business, so the retainer is shaped around what you actually need."
  />
);

export default StrategyServicesPage;
