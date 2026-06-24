"use client";

import { useState } from "react";
import { XStack, YStack } from "tamagui";
import { Body, Button, Display } from "./ui";
import Header from "./Header";
import Radar from "./Radar";

const GITHUB_URL = "https://github.com/kiloumanjaro/Pulse";

export default function EntryGate({
  onReady,
}: {
  onReady: (lat: number, lng: number) => void;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");
  const [error, setError] = useState<string>("");

  function enter() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => onReady(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      // High accuracy + maximumAge:0 forces a fresh fix (Wi-Fi/GPS scan)
      // instead of reusing the browser's cached IP-based location.
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }

  return (
    <YStack
      position="relative"
      height="100vh"
      overflow="hidden"
      backgroundColor="$background"
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

      <Header onEnter={enter} />

      <YStack
        flex={1}
        position="relative"
        zIndex={10}
        justifyContent="flex-end"
        paddingHorizontal={24}
        paddingBottom={32}
        $sm={{ paddingHorizontal: 48, paddingBottom: 48 }}
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
            {status === "error" && (
              <Body size="sm" maxWidth={320} color="$danger">
                {error}
              </Body>
            )}
            <XStack alignItems="center" gap={12} flexWrap="wrap">
              <Button
                variant="primary"
                size="md"
                onPress={enter}
                disabled={status === "locating"}
                opacity={status === "locating" ? 0.6 : 1}
              >
                {status === "locating" ? "Locating…" : "Enter Pulse"}
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
  );
}
