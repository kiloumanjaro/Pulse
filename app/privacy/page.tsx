"use client";

import { XStack, YStack } from "tamagui";
import { Body, Display, Eyebrow } from "../components/ui";
import PageShell from "../components/PageShell";

const ROWS = [
  { what: "Exact location", how: "Offset 1–3 km in a random direction, fresh each session. Raw coordinates are never written to the database." },
  { what: "Chat messages", how: "Sent over a direct WebRTC data channel. They never touch the server." },
  { what: "Video & audio", how: "Streamed peer-to-peer over WebRTC media tracks. Never recorded, never relayed through us." },
  { what: "Session identity", how: "An ephemeral UUID generated in your browser and deleted the moment you leave." },
  { what: "History", how: "None. Nothing is logged or persisted between sessions — every visit starts blank." },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Built to forget you."
      intro="Privacy isn't a setting in Pulse — it's the architecture. Here is exactly what is protected, and how."
    >
      <YStack borderWidth={1} borderColor="$gray20">
        {ROWS.map((r, i) => (
          <XStack
            key={r.what}
            borderTopWidth={i === 0 ? 0 : 1}
            borderColor="$gray20"
            $xs={{ flexDirection: "column" }}
          >
            <YStack padding={20} width="36%" $xs={{ width: "100%" }}>
              <Eyebrow>{r.what}</Eyebrow>
            </YStack>
            <YStack
              flex={1}
              padding={20}
              borderLeftWidth={1}
              borderColor="$gray20"
              $xs={{ borderLeftWidth: 0, borderTopWidth: 1 }}
            >
              <Body tone="muted">{r.how}</Body>
            </YStack>
          </XStack>
        ))}
      </YStack>

      <YStack backgroundColor="$gray8" borderWidth={1} borderColor="$gray20" padding={28} gap={10}>
        <Display size="xs" tag="h2">
          Stateless by design
        </Display>
        <Body tone="muted" maxWidth={680}>
          No message history, no call history, no connection history. Every session starts completely
          fresh — the server holds no data about you once your session ends.
        </Body>
      </YStack>
    </PageShell>
  );
}
