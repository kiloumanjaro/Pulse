"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { XStack, YStack } from "tamagui";
import { Body, Button, Display, Eyebrow } from "./ui";
import Header from "./Header";

// Shared chrome for the static concept pages (/about, /how-it-works, /privacy):
// sticky header + centered blueprint container + a single "way in" at the foot.
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <YStack minHeight="100vh" backgroundColor="$background">
      <Header />
      <YStack
        flex={1}
        width="100%"
        maxWidth={1080}
        alignSelf="center"
        paddingHorizontal={24}
        paddingTop={112}
        paddingBottom={120}
        gap={48}
      >
        <YStack gap={16} maxWidth={680}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Display tag="h1" size="lg">
            {title}
          </Display>
          <Body size="lg" tone="muted">
            {intro}
          </Body>
        </YStack>

        {children}

        <XStack paddingTop={8}>
          <Button variant="primary" onPress={() => router.push("/")}>
            Enter Pulse
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
