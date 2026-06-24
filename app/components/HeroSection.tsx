"use client";

import { XStack, YStack } from "tamagui";
import { Body, Button, Display, Section } from "./ui";
import Header from "./Header";
import Radar from "./Radar";
import { GITHUB_URL, HERO, RADAR_BACKGROUND, RADAR_COLOR } from "../content/landing";

// Full-viewport radar with the floating header over it.
export default function HeroSection({ onEnter }: { onEnter: () => void }) {
  return (
    <YStack
      position="relative"
      height="100vh"
      overflow="hidden"
      borderBottomWidth={1}
      borderColor="$gray20"
    >
      <YStack position="absolute" top={0} left={0} right={0} bottom={0}>
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
          color={RADAR_COLOR}
          backgroundColor={RADAR_BACKGROUND}
          falloff={3}
          brightness={0.4}
          enableMouseInteraction={false}
        />
      </YStack>

      <Section flex={1} position="relative" zIndex={10}>
        <Header onEnter={onEnter} paddingHorizontal={0} />

        <YStack
          flex={1}
          justifyContent="flex-end"
          paddingBottom={32}
          $sm={{ paddingBottom: 48 }}
        >
          <XStack
            alignItems="flex-end"
            justifyContent="space-between"
            gap={32}
            flexWrap="wrap"
          >
            <YStack gap={16} maxWidth={480} flexShrink={1}>
              <Display
                tag="h1"
                size="xl"
                $sm={{ fontSize: 64, lineHeight: 72, letterSpacing: -1.3 }}
              >
                {HERO.title}
              </Display>
              <Body size="md" tone="muted" maxWidth={420}>
                {HERO.body}
              </Body>
            </YStack>

            <YStack alignItems="flex-start" gap={12}>
              <XStack alignItems="center" gap={12} flexWrap="wrap">
                <Button variant="primary" size="md" onPress={onEnter}>
                  Enter Pulse
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  tag="a"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  backgroundColor="$black"
                  hoverStyle={{ backgroundColor: "$gray8" }}
                  pressStyle={{ backgroundColor: "$gray5" }}
                >
                  View on GitHub
                </Button>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
      </Section>
    </YStack>
  );
}
