import RetainerLayout from "@/components/RetainerLayout";
import { PageSeo } from "@/components/seo/PageSeo";

const RetainerScaleUpPage = () => (
  <>
    <PageSeo
      title="Scale-Up Retainer — senior strategy without the full-time hire"
      description="Experienced narrative and messaging direction on retainer, for established organisations scaling a brand or launching a new vertical at pace."
      path="/retainer/scaleup"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Scale-Up Retainer",
        provider: { "@type": "Organization", name: "Thread & Stack" },
        areaServed: "Worldwide",
        serviceType: "Fractional strategy retainer",
      }}
    />
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
  </>
);

export default RetainerScaleUpPage;
