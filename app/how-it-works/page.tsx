"use client";

import { XStack, YStack } from "tamagui";
import { Body, Eyebrow } from "../components/ui";
import PageShell from "../components/PageShell";

const STEPS = [
  "Your browser asks for location permission.",
  "A privacy-offset coordinate is sent to the server and your dot appears on the map.",
  "You see other live dots and tap one to send a connection request.",
  "The other person gets an accept or decline prompt — nothing reaches them until they accept.",
  "On accept, a WebRTC data channel opens and text chat begins.",
  "Either person can escalate to a peer-to-peer video call (camera + mic).",
  "Either person disconnects and the other's chat and video end immediately.",
  "Close the tab and your dot is removed from every map within ~15 seconds.",
];

export default function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="How it works"
      title="From a dot to a conversation."
      intro="From permission to peer-to-peer in a few seconds. Here is the full lifecycle of a Pulse session — no accounts, no waiting rooms, no traces left behind."
    >
      <YStack borderWidth={1} borderColor="$gray20">
        {STEPS.map((step, i) => (
          <XStack
            key={i}
            alignItems="center"
            gap={20}
            paddingHorizontal={24}
            paddingVertical={18}
            borderTopWidth={i === 0 ? 0 : 1}
            borderColor="$gray20"
          >
            <Eyebrow minWidth={28} color="$yellow">
              {String(i + 1).padStart(2, "0")}
            </Eyebrow>
            <Body flex={1}>{step}</Body>
          </XStack>
        ))}
      </YStack>
    </PageShell>
  );
}
