"use client";

import { YStack, XStack } from "tamagui";
import { Body, Button, Card, Display } from "./ui";

// Reusable centered prompt for "someone wants to connect" and
// "someone wants to start video".
export default function ConnectionPrompt({
  title,
  subtitle,
  acceptLabel,
  declineLabel,
  onAccept,
  onDecline,
}: {
  title: string;
  subtitle?: string;
  acceptLabel: string;
  declineLabel: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={20}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$scrim"
      padding={24}
    >
      <Card
        surface="popover"
        pad="md"
        width="100%"
        maxWidth={320}
      >
        <Display tag="h2" size="xs" textAlign="center">
          {title}
        </Display>
        {subtitle && (
          <Body size="sm" tone="muted" textAlign="center" marginTop={4}>
            {subtitle}
          </Body>
        )}
        <XStack marginTop={20} gap={12}>
          <Button variant="outline" size="md" full flex={1} onPress={onDecline}>
            {declineLabel}
          </Button>
          <Button variant="primary" size="md" full flex={1} onPress={onAccept}>
            {acceptLabel}
          </Button>
        </XStack>
      </Card>
    </YStack>
  );
}
