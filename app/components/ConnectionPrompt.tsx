"use client";

import { YStack, XStack, H2, Paragraph, Button } from "tamagui";

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
      padding="$s6"
    >
      <YStack
        width="100%"
        maxWidth={320}
        borderRadius="$card"
        backgroundColor="$zinc900"
        padding="$s6"
        // shadow-xl
        style={{
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <H2
          fontSize={18}
          lineHeight={28}
          fontWeight="600"
          color="$zinc100"
          textAlign="center"
          margin={0}
          style={{ fontFamily: "inherit" }}
        >
          {title}
        </H2>
        {subtitle && (
          <Paragraph
            marginTop="$s1"
            fontSize={14}
            lineHeight={20}
            color="$zinc400"
            textAlign="center"
            style={{ fontFamily: "inherit" }}
          >
            {subtitle}
          </Paragraph>
        )}
        <XStack marginTop="$s5" gap="$s3">
          {/* unstyled Button: Tamagui token-driven style props reproduce the look 1:1 */}
          <Button
            unstyled
            onPress={onDecline}
            flex={1}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius="$round"
            borderWidth={1}
            borderColor="$zinc700"
            backgroundColor="transparent"
            paddingHorizontal="$s4"
            paddingVertical="$s2"
            fontSize={14}
            fontWeight="500"
            color="$zinc300"
            hoverStyle={{ borderColor: "$zinc500" }}
            style={{ fontFamily: "inherit" }}
          >
            {declineLabel}
          </Button>
          <Button
            unstyled
            onPress={onAccept}
            flex={1}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius="$round"
            backgroundColor="$emerald400"
            paddingHorizontal="$s4"
            paddingVertical="$s2"
            fontSize={14}
            fontWeight="600"
            color="$zinc950"
            hoverStyle={{ backgroundColor: "$emerald300" }}
            style={{ fontFamily: "inherit" }}
          >
            {acceptLabel}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
