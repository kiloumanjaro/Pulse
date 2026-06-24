"use client";

import { useState } from "react";
import { YStack } from "tamagui";
import { Body, Button, Display, Eyebrow } from "./ui";
import Radar from "./Radar";

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
      alignItems="center"
      justifyContent="center"
      gap={32}
      padding={24}
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

      <YStack position="relative" zIndex={10} alignItems="center" gap={32}>
        <YStack alignItems="center" gap={16}>
          <Eyebrow>Anonymous · Ephemeral</Eyebrow>
          <Display
            tag="h1"
            size="xl"
            textAlign="center"
            $sm={{ fontSize: 64, lineHeight: 72, letterSpacing: -1.3 }}
          >
            Pulse
          </Display>
          <Body
            size="lg"
            tone="muted"
            maxWidth={384}
            textAlign="center"
          >
            A living globe of anonymous strangers. Drop onto the map and connect.
          </Body>
        </YStack>

        <Button
          variant="primary"
          size="md"
          onPress={enter}
          disabled={status === "locating"}
          opacity={status === "locating" ? 0.6 : 1}
        >
          {status === "locating" ? "Locating…" : "Enter Pulse"}
        </Button>

        {status === "error" && (
          <Body size="sm" maxWidth={384} textAlign="center" color="$danger">
            {error}
          </Body>
        )}

        <Body size="sm" tone="muted" maxWidth={384} textAlign="center">
          No sign-up. Your dot is placed 1–3&nbsp;km from your real location.
          Nothing is stored — closing the tab ends everything.
        </Body>
      </YStack>
    </YStack>
  );
}
