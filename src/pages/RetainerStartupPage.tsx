import RetainerLayout from "@/components/RetainerLayout";
import { PageSeo } from "@/components/seo/PageSeo";

const RetainerStartupPage = () => (
  <>
    <PageSeo
      title="Startup Retainer — fractional strategy for growing teams"
      description="A mid-tier monthly retainer for startups that need senior narrative and systems leadership on call, without the cost of a full-time hire."
      path="/retainer/startup"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Startup Retainer",
        provider: { "@type": "Organization", name: "Thread & Stack" },
        areaServed: "Worldwide",
        serviceType: "Fractional strategy retainer",
      }}
    />
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
  </>
);

export default RetainerStartupPage;
