"use client";

import { XStack, YStack } from "tamagui";
import { Body, Display, Eyebrow } from "../components/ui";
import PageShell from "../components/PageShell";

const PREMISE = [
  {
    k: "01",
    t: "Anonymous by default",
    d: "No sign-up, no login, no profiles. On the map you are a dot and nothing more.",
  },
  {
    k: "02",
    t: "Ephemeral by design",
    d: "Closing the tab ends the session. Everything about you disappears — there is no history to delete.",
  },
  {
    k: "03",
    t: "Location-aware, not location-exact",
    d: "Your dot lands 1–3 km from your real position, randomized fresh every session.",
  },
  {
    k: "04",
    t: "Peer-to-peer",
    d: "Chat messages and video never pass through the server — only the connection handshake does.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Pulse"
      title="A living globe of anonymous strangers."
      intro="Pulse is an anonymous, real-time connection app. Every online user appears as a dot on a world map. Tap a dot, get connected for text chat or a video call — no accounts, no history, nothing stored."
    >
      <YStack borderWidth={1} borderColor="$gray20">
        {PREMISE.map((p, i) => (
          <XStack
            key={p.k}
            padding={24}
            gap={20}
            borderTopWidth={i === 0 ? 0 : 1}
            borderColor="$gray20"
            $xs={{ flexDirection: "column", gap: 8 }}
          >
            <Eyebrow marginTop={3} minWidth={28}>
              {p.k}
            </Eyebrow>
            <YStack gap={6} flex={1}>
              <Display size="xs" tag="h2">
                {p.t}
              </Display>
              <Body tone="muted" maxWidth={620}>
                {p.d}
              </Body>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </PageShell>
  );
}
