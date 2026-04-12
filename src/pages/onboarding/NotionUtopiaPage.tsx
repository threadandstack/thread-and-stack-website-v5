import stackedLogo from "@/assets/logos/Black_TS_Stacked.svg";
import { NotionUtopiaForm } from "@/components/onboarding/NotionUtopiaForm";

const NotionUtopiaPage = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
        <img src={stackedLogo} alt="Thread & Stack stacked logo" className="h-14 w-auto" />

        <section className="w-full rounded-[2rem] border border-border bg-card/70 p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Onboarding</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Lindsay’s Notion Utopia Starter Kit
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              This quick form helps us answer a few important questions about what you need from Notion and where we
              should focus first.
            </p>
          </div>

          <div className="mt-8">
            <NotionUtopiaForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default NotionUtopiaPage;
