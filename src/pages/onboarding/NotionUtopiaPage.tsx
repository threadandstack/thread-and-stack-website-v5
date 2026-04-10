import stackedLogo from "@/assets/logos/Black_TS_Stacked.svg";

const NotionUtopiaPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12">
      <img src={stackedLogo} alt="Thread & Stack" className="h-14 mb-8" />
      <div className="w-full max-w-5xl flex-1">
        <iframe
          src="https://threadandstack.notion.site/33e8863b87d48024b67ae60a3fe7a98f?pvs=105"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          className="rounded-lg border border-border min-h-[80vh]"
        />
      </div>
    </div>
  );
};

export default NotionUtopiaPage;
