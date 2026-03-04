import RetainerLayout from "@/components/RetainerLayout";

const RetainerStartupPage = () => (
  <RetainerLayout
    headline={
      <>
        The strategy brain<br />your launch <em className="text-accent italic">actually needs</em>.
      </>
    }
    subtitle="Senior narrative and messaging leadership on retainer, for early-stage teams launching a new brand who need fast, confident decisions without the overhead of a full-time hire."
    pricing={{
      label: "Startups & growth-stage brands",
      dayRate: "£700–£850",
      cadence: "1 day / week",
      monthlyRange: "~£3,500–£4,100",
    }}
    pricingNote="Start with a short initial term, then review together. The cadence adjusts around what your team actually needs — lighter when things are steady, more intensive around launch windows or pitch prep. Additional days can be added at an agreed rate."
  />
);

export default RetainerStartupPage;
