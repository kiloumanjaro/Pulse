"use client";

import { useRouter } from "next/navigation";
import { Section } from "./ds";
import HeroSection from "./HeroSection";
import PartnersSection from "./PartnersSection";
import StatementSection from "./StatementSection";
import BentoSection from "./BentoSection";
import FooterSection from "./FooterSection";
import StickyScrollScrub from "./StickyScrollScrub";

export default function EntryGate() {
  const router = useRouter();

  // Pure marketing — no permission prompt here. The location flow lives on
  // /live, so entering pushes a history entry and Back returns to this page.
  function enter() {
    router.push("/live");
  }

  return (
    <div className="flex flex-col bg-background">
      <HeroSection onEnter={enter} />
      <PartnersSection />
      <StatementSection />
      <Section className="pt-24">
        <StickyScrollScrub />
      </Section>
      <BentoSection />
      <FooterSection />
    </div>
  );
}
