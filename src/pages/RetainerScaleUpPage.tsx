import RetainerLayout from "@/components/RetainerLayout";

const RetainerScaleUpPage = () => (
  <RetainerLayout
    headline={
      <>
        Senior strategy leadership<br /><em className="text-accent italic">without the full-time hire</em>.
      </>
    }
    subtitle="Experienced narrative and messaging direction on retainer, for established organisations scaling a brand or launching a new vertical who need strategic clarity at pace."
    pricing={{
      label: "Scale-ups & established orgs",
      dayRate: "£900–£1,000+",
      cadence: "1–2 days / week",
      monthlyRange: "~£4,500–£8,900+",
    }}
    pricingNote="Start with a short initial term, then review together. The cadence adjusts around what the business actually needs — lighter when things are steady, more intensive around key milestones. Additional days or short launch intensives can be added at an agreed rate."
  />
);

export default RetainerScaleUpPage;
