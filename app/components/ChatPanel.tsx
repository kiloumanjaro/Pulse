"use client";

import { useEffect, useRef, useState } from "react";
import { YStack, XStack, Paragraph, Text, Button, Input } from "tamagui";

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
}

export default function ChatPanel({
  messages,
  connected,
  videoBusy,
  onSend,
  onStartVideo,
  onEnd,
}: {
  messages: ChatMessage[];
  connected: boolean;
  videoBusy: boolean;
  onSend: (text: string) => void;
  onStartVideo: () => void;
  onEnd: () => void;
}) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !connected) return;
    onSend(text);
    setDraft("");
  }

  return (
    <YStack
      position="absolute"
      top={0}
      bottom={0}
      right={0}
      zIndex={20}
      width="100%"
      maxWidth={448}
      borderLeftWidth={1}
      borderColor="$zinc800"
      backgroundColor="$zinc950"
      // shadow-2xl
      style={{ boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
    >
      <XStack
        tag="header"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="$zinc800"
        paddingHorizontal="$s4"
        paddingVertical="$s3"
      >
        <YStack>
          <Paragraph
            fontSize={16}
            lineHeight={24}
            fontWeight="600"
            color="$zinc100"
            style={{ fontFamily: "inherit" }}
          >
            Stranger
          </Paragraph>
          <Paragraph
            fontSize={12}
            lineHeight={16}
            color="$zinc500"
            style={{ fontFamily: "inherit" }}
          >
            {connected ? "Connected" : "Connecting…"}
          </Paragraph>
        </YStack>
        <XStack gap="$s2">
          {/* unstyled Button: Tamagui token-driven style props reproduce the look 1:1 */}
          <Button
            unstyled
            onPress={onStartVideo}
            disabled={!connected || videoBusy}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius="$round"
            borderWidth={1}
            borderColor="$zinc700"
            backgroundColor="transparent"
            paddingHorizontal="$s3"
            paddingVertical="$s1_5"
            fontSize={14}
            color="$zinc100"
            hoverStyle={{ borderColor: "$zinc500" }}
            disabledStyle={{ opacity: 0.4 }}
            style={{ fontFamily: "inherit" }}
          >
            Video
          </Button>
          <Button
            unstyled
            onPress={onEnd}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius="$round"
            backgroundColor="$red500"
            paddingHorizontal="$s3"
            paddingVertical="$s1_5"
            fontSize={14}
            fontWeight="500"
            color="$white"
            hoverStyle={{ backgroundColor: "$red400" }}
            style={{ fontFamily: "inherit" }}
          >
            End
          </Button>
        </XStack>
      </XStack>

      <YStack
        flex={1}
        gap="$s2"
        padding="$s4"
        style={{ overflowY: "auto" }}
      >
        {messages.length === 0 && (
          <Paragraph
            marginTop="$s8"
            fontSize={14}
            lineHeight={20}
            color="$zinc500"
            textAlign="center"
            style={{ fontFamily: "inherit" }}
          >
            Say hello. Messages are peer-to-peer and never stored.
          </Paragraph>
        )}
        {messages.map((m) => (
          <XStack
            key={m.id}
            justifyContent={m.mine ? "flex-end" : "flex-start"}
          >
            <Text
              maxWidth="80%"
              borderRadius="$card"
              paddingHorizontal="$s3"
              paddingVertical="$s2"
              fontSize={14}
              lineHeight={20}
              backgroundColor={m.mine ? "$emerald400" : "$zinc800"}
              color={m.mine ? "$zinc950" : "$zinc100"}
              style={{ fontFamily: "inherit" }}
            >
              {m.text}
            </Text>
          </XStack>
        ))}
        {/* Plain scroll anchor for scrollIntoView — non-visual layout marker, not a UI primitive */}
        <div ref={endRef} />
      </YStack>

      <XStack
        tag="form"
        onSubmit={submit}
        gap="$s2"
        borderTopWidth={1}
        borderColor="$zinc800"
        padding="$s3"
      >
        {/* unstyled Input: Tamagui token-driven style props reproduce the look 1:1.
            focus:ring is approximated with a 1px emerald outline (see tamagui-gaps.md) */}
        <Input
          unstyled
          value={draft}
          onChangeText={(text) => setDraft(text)}
          placeholder={connected ? "Type a message…" : "Connecting…"}
          placeholderTextColor="$zinc600"
          disabled={!connected}
          flex={1}
          borderRadius="$round"
          backgroundColor="$zinc900"
          paddingHorizontal="$s4"
          paddingVertical="$s2"
          fontSize={14}
          color="$zinc100"
          outlineWidth={0}
          focusStyle={{
            outlineWidth: 1,
            outlineColor: "$emerald400",
            outlineStyle: "solid",
          }}
          disabledStyle={{ opacity: 0.5 }}
          style={{ fontFamily: "inherit" }}
        />
        <Button
          unstyled
          type="submit"
          disabled={!connected || !draft.trim()}
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
          disabledStyle={{ opacity: 0.4 }}
          style={{ fontFamily: "inherit" }}
        >
          Send
        </Button>
      </XStack>
    </YStack>
  );
}
