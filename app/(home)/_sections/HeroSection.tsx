"use client";

import { Body, Button, Display, Section } from "../../components/ds";
import Radar from "../../components/Radar";
import { GITHUB_URL, HERO, RADAR_BACKGROUND } from "../../content/landing";
import { useBrandColor } from "@/lib/useBrandColor";

// Full-viewport radar hero (the sticky header sits above it, in EntryGate).
export default function HeroSection({ onEnter }: { onEnter: () => void }) {
  const radarColor = useBrandColor();
  return (
    <div className="relative flex flex-col h-screen overflow-hidden border-b border-gray-20">
      <div className="absolute inset-0 flex flex-col">
        <Radar
          speed={0.7}
          scale={0.6}
          ringCount={8}
          spokeCount={10}
          ringThickness={0.02}
          spokeThickness={0.005}
          sweepSpeed={0.7}
          sweepWidth={2}
          sweepLobes={1}
          color={radarColor}
          backgroundColor={RADAR_BACKGROUND}
          falloff={3}
          brightness={0.4}
          enableMouseInteraction={true}
          mouseInfluence={0.015}
        />
      </div>

      <Section className="flex-1 relative z-10">
        <div className="flex flex-col flex-1 justify-end pb-8 sm:pb-12">
          <div className="flex flex-row items-end justify-between gap-8 flex-wrap">
            <div className="flex flex-col gap-4 max-w-[480px] shrink">
              <Display
                as="h1"
                size="xl"
                className="sm:text-[64px] sm:leading-[72px] sm:tracking-[-1.3px]"
              >
                {HERO.title}
              </Display>
              <Body size="md" tone="muted" className="max-w-[420px]">
                {HERO.body}
              </Body>
            </div>

            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-row items-center gap-3 flex-wrap">
                <Button variant="primary" size="md" onClick={onEnter}>
                  Enter Pulse
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-black hover:bg-gray-8 active:bg-gray-5"
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
