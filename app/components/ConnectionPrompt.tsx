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
      backgroundColor="rgba(0,0,0,0.6)"
      padding={24}
    >
      <YStack
        width="100%"
        maxWidth={320}
        borderRadius={16}
        backgroundColor="#18181b"
        padding={24}
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
          color="#f4f4f5"
          textAlign="center"
          margin={0}
          style={{ fontFamily: "inherit" }}
        >
          {title}
        </H2>
        {subtitle && (
          <Paragraph
            marginTop={4}
            fontSize={14}
            lineHeight={20}
            color="#a1a1aa"
            textAlign="center"
            style={{ fontFamily: "inherit" }}
          >
            {subtitle}
          </Paragraph>
        )}
        <XStack marginTop={20} gap={12}>
          {/* unstyled Button: Tamagui style props reproduce the Tailwind look 1:1 */}
          <Button
            unstyled
            onPress={onDecline}
            flex={1}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius={9999}
            borderWidth={1}
            borderColor="#3f3f46"
            backgroundColor="transparent"
            paddingHorizontal={16}
            paddingVertical={8}
            fontSize={14}
            fontWeight="500"
            color="#d4d4d8"
            hoverStyle={{ borderColor: "#71717a" }}
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
            borderRadius={9999}
            backgroundColor="#34d399"
            paddingHorizontal={16}
            paddingVertical={8}
            fontSize={14}
            fontWeight="600"
            color="#09090b"
            hoverStyle={{ backgroundColor: "#6ee7b7" }}
            style={{ fontFamily: "inherit" }}
          >
            {acceptLabel}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
