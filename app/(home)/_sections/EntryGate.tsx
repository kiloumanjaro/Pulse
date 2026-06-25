"use client";

import { useRouter } from "next/navigation";
import { Divider, Section } from "../../components/ds";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatementSection from "./StatementSection";
import BentoIntroSection from "./BentoIntroSection";
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
      <FeaturesSection />
      <Divider />
      <StatementSection />
      <Section className="pt-24">
        <StickyScrollScrub />
      </Section>
      <BentoIntroSection />
      <BentoSection />
      <FooterSection />
    </div>
  );
}
