"use client";

import { XStack, YStack } from "tamagui";
import { useRouter } from "next/navigation";
import { Body, Button, Display, Divider, Eyebrow, Hatch } from "./ui";
import Header from "./Header";
import Radar from "./Radar";
import StickyScrollScrub from "./StickyScrollScrub";

const GITHUB_URL = "https://github.com/kiloumanjaro/Pulse";

export default function EntryGate() {
  const router = useRouter();

  // Pure marketing — no permission prompt here. The location flow lives on
  // /live, so entering pushes a history entry and Back returns to this page.
  function enter() {
    router.push("/live");
  }

  return (
    <YStack backgroundColor="$background">
      {/* Hero — full-viewport radar with the floating header over it. */}
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
            color="#def135"
            backgroundColor="#040406"
            falloff={3}
            brightness={0.4}
            enableMouseInteraction={false}
          />
        </YStack>

        <YStack
          flex={1}
          position="relative"
          zIndex={10}
          paddingHorizontal={24}
          $sm={{ paddingHorizontal: 48 }}
        >
          <Header onEnter={enter} paddingHorizontal={0} />

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
                  Pulse
                </Display>
                <Body size="md" tone="muted" maxWidth={420}>
                  A living globe of anonymous strangers. No sign-up, nothing
                  stored — gone the moment you leave.
                </Body>
              </YStack>

              <YStack alignItems="flex-start" gap={12}>
                <XStack alignItems="center" gap={12} flexWrap="wrap">
                  <Button variant="primary" size="md" onPress={enter}>
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
        </YStack>
      </YStack>

      {/* Future partners — reserved logo grid, empty cells hatched (§8). */}
      <YStack
        width="100%"
        paddingHorizontal={24}
        $sm={{ paddingHorizontal: 48 }}
        paddingTop={120}
        paddingBottom={96}
        gap={32}
        alignItems="center"
      >
        <XStack
          width="100%"
          borderTopWidth={1}
          borderLeftWidth={1}
          borderColor="$gray20"
          flexWrap="wrap"
        >
          {[0, 1, 2, 3].map((i) => (
            <YStack
              key={i}
              width="50%"
              $sm={{ width: "25%" }}
              height={120}
              borderRightWidth={1}
              borderBottomWidth={1}
              borderColor="$gray20"
              position="relative"
              overflow="hidden"
              alignItems="center"
              justifyContent="center"
            >
              <Hatch position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.5} />
              <Eyebrow color="$gray30">Logo</Eyebrow>
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Horizontal rule separating partners from the statement. */}
      <YStack width="100%" paddingHorizontal={24} $sm={{ paddingHorizontal: 48 }}>
        <Divider orientation="horizontal" />
      </YStack>

      {/* The statement — vertical rules enclosing the why-Pulse copy. */}
      <YStack width="100%" paddingHorizontal={24} $sm={{ paddingHorizontal: 48 }}>
        <YStack
          borderLeftWidth={1}
          borderRightWidth={1}
          borderColor="$gray20"
          paddingVertical={80}
          paddingHorizontal={28}
          $sm={{ paddingHorizontal: 64 }}
          gap={20}
        >
          <Eyebrow>Why Pulse</Eyebrow>
          <Display tag="h2" size="lg" maxWidth={760}>
            One living map of real people — with nothing kept, and nothing
            tracked.
          </Display>
          <Body size="lg" tone="muted" maxWidth={620}>
            Stop trading your identity for a conversation. Most apps make you sign
            up, build a profile, and leave a permanent trail behind. Pulse drops
            you onto a global radar as an anonymous dot — talk, video-call
            peer-to-peer, then disappear without a record.
          </Body>
        </YStack>
      </YStack>

      {/* Sticky-scroll scrub — the Pulse lifecycle, step by step. */}
      <YStack
        width="100%"
        paddingHorizontal={24}
        $sm={{ paddingHorizontal: 48 }}
        paddingTop={96}
        paddingBottom={140}
      >
        <StickyScrollScrub />
      </YStack>
    </YStack>
  );
}
