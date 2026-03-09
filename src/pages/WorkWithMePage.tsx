import { useEffect, useState } from "react";
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
      <Index />
      <ContactDrawer open={drawerOpen} onOpenChange={setDrawerOpen} source="work-with-me" />
    </>
  );
};

export default WorkWithMePage;
