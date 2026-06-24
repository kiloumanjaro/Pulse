"use client";

import { XStack, YStack } from "tamagui";
import { Body, Display, Eyebrow, Section } from "./ui";
import { STATEMENT } from "../content/landing";

// The statement — the why-Pulse copy.
export default function StatementSection() {
  return (
    <Section>
      <YStack
        paddingVertical={80}
        paddingHorizontal={28}
        $sm={{ paddingHorizontal: 64 }}
        gap={20}
      >
        <XStack
          gap={48}
          $sm={{ gap: 80 }}
          flexWrap="wrap"
          alignItems="flex-start"
        >
          <YStack flexGrow={1.6} flexBasis={420} flexShrink={1} gap={20}>
            <Eyebrow>{STATEMENT.eyebrow}</Eyebrow>
            <Display tag="h2" size="lg">
              {STATEMENT.headline}
            </Display>
          </YStack>
          <YStack flexGrow={1} flexBasis={280} flexShrink={1}>
            <Body size="lg" tone="muted">
              {STATEMENT.body}
            </Body>
          </YStack>
        </XStack>
      </YStack>
    </Section>
  );
}
