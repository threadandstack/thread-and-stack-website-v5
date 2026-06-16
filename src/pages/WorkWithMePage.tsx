import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ContactDrawer } from "@/components/ContactDrawer";
import Index from "./Index";

const WorkWithMePage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Small delay to let page render before opening drawer
    const timer = setTimeout(() => setDrawerOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Work With Me | Thread &amp; Stack</title>
        <meta name="description" content="Book an intro call or explore how Thread & Stack can help your team with strategy and systems." />
        <link rel="canonical" href="https://threadandstack.com/work-with-me" />
        <meta property="og:url" content="https://threadandstack.com/work-with-me" />
        <meta property="og:title" content="Work With Me | Thread & Stack" />
        <meta property="og:description" content="Book an intro call or explore how Thread & Stack can help your team with strategy and systems." />
      </Helmet>
      <Index />
      <ContactDrawer open={drawerOpen} onOpenChange={setDrawerOpen} source="work-with-me" />
    </>
  );
};

export default WorkWithMePage;
