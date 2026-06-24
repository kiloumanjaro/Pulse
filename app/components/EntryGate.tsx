"use client";

import { YStack } from "tamagui";
import { useRouter } from "next/navigation";
import { Section } from "./ui";
import HeroSection from "./HeroSection";
import PartnersSection from "./PartnersSection";
import StatementSection from "./StatementSection";
import StickyScrollScrub from "./StickyScrollScrub";

export default function EntryGate() {
  const router = useRouter();

  // Pure marketing — no permission prompt here. The location flow lives on
  // /live, so entering pushes a history entry and Back returns to this page.
  function enter() {
    router.push("/live");
  }

  return (
    <YStack backgroundColor="$background">
      <HeroSection onEnter={enter} />
      <PartnersSection />
      <StatementSection />
      <Section paddingTop={96} paddingBottom={140}>
        <StickyScrollScrub />
      </Section>
    </YStack>
  );
}
