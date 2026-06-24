"use client";

import { useState } from "react";
import { YStack, H1, Paragraph, Button } from "tamagui";
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
      gap="$s8"
      padding="$s6"
    >
      <YStack position="absolute" top={0} left={0} right={0} bottom={0}>
        <Radar
          speed={0.7}
          scale={0.60}
          ringCount={8}
          spokeCount={10}
          ringThickness={0.02}
          spokeThickness={0.005}
          sweepSpeed={0.7}
          sweepWidth={2}
          sweepLobes={1}
          color="#00d492"
          backgroundColor="#000000"
          falloff={3}
          brightness={0.4}
          enableMouseInteraction={false}
        />
      </YStack>

      <YStack position="relative" zIndex={10} alignItems="center" gap="$s8">
        <YStack alignItems="center">
          <H1
            fontSize={36}
            lineHeight={40}
            fontWeight="700"
            letterSpacing={-0.9}
            color="$zinc100"
            textAlign="center"
            margin={0}
            style={{ fontFamily: "inherit" }}
          >
            Pulse
          </H1>
          <Paragraph
            marginTop="$s2"
            maxWidth={384}
            fontSize={16}
            lineHeight={24}
            color="$zinc400"
            textAlign="center"
            style={{ fontFamily: "inherit" }}
          >
            A living globe of anonymous strangers. Drop onto the map and connect.
          </Paragraph>
        </YStack>

        {/* unstyled Button: Tamagui token-driven style props reproduce the look 1:1.
            Font props (color/size/weight) are forwarded to the wrapped label text. */}
        <Button
          unstyled
          onPress={enter}
          disabled={status === "locating"}
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          borderRadius="$round"
          backgroundColor="$emerald400"
          paddingHorizontal="$s8"
          paddingVertical="$s3"
          fontSize={16}
          fontWeight="600"
          color="$zinc950"
          hoverStyle={{ backgroundColor: "$emerald300" }}
          disabledStyle={{ opacity: 0.6 }}
          style={{ fontFamily: "inherit", transition: "background-color 150ms" }}
        >
          {status === "locating" ? "Locating…" : "Enter Pulse"}
        </Button>

        {status === "error" && (
          <Paragraph
            maxWidth={384}
            fontSize={14}
            lineHeight={20}
            color="$red400"
            textAlign="center"
            style={{ fontFamily: "inherit" }}
          >
            {error}
          </Paragraph>
        )}

        <Paragraph
          maxWidth={384}
          fontSize={12}
          lineHeight={16}
          color="$zinc500"
          textAlign="center"
          style={{ fontFamily: "inherit" }}
        >
          No sign-up. Your dot is placed 1–3&nbsp;km from your real location.
          Nothing is stored — closing the tab ends everything.
        </Paragraph>
      </YStack>
    </YStack>
  );
}
