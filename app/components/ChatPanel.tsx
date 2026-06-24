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
      borderColor="#27272a"
      backgroundColor="#09090b"
      // shadow-2xl
      style={{ boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
    >
      <XStack
        tag="header"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="#27272a"
        paddingHorizontal={16}
        paddingVertical={12}
      >
        <YStack>
          <Paragraph
            fontSize={16}
            lineHeight={24}
            fontWeight="600"
            color="#f4f4f5"
            style={{ fontFamily: "inherit" }}
          >
            Stranger
          </Paragraph>
          <Paragraph
            fontSize={12}
            lineHeight={16}
            color="#71717a"
            style={{ fontFamily: "inherit" }}
          >
            {connected ? "Connected" : "Connecting…"}
          </Paragraph>
        </YStack>
        <XStack gap={8}>
          {/* unstyled Button: Tamagui style props reproduce the Tailwind look 1:1 */}
          <Button
            unstyled
            onPress={onStartVideo}
            disabled={!connected || videoBusy}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            borderRadius={9999}
            borderWidth={1}
            borderColor="#3f3f46"
            backgroundColor="transparent"
            paddingHorizontal={12}
            paddingVertical={6}
            fontSize={14}
            color="#f4f4f5"
            hoverStyle={{ borderColor: "#71717a" }}
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
            borderRadius={9999}
            backgroundColor="#ef4444"
            paddingHorizontal={12}
            paddingVertical={6}
            fontSize={14}
            fontWeight="500"
            color="#ffffff"
            hoverStyle={{ backgroundColor: "#f87171" }}
            style={{ fontFamily: "inherit" }}
          >
            End
          </Button>
        </XStack>
      </XStack>

      <YStack
        flex={1}
        gap={8}
        padding={16}
        style={{ overflowY: "auto" }}
      >
        {messages.length === 0 && (
          <Paragraph
            marginTop={32}
            fontSize={14}
            lineHeight={20}
            color="#71717a"
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
              borderRadius={16}
              paddingHorizontal={12}
              paddingVertical={8}
              fontSize={14}
              lineHeight={20}
              backgroundColor={m.mine ? "#34d399" : "#27272a"}
              color={m.mine ? "#09090b" : "#f4f4f5"}
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
        gap={8}
        borderTopWidth={1}
        borderColor="#27272a"
        padding={12}
      >
        {/* unstyled Input: Tamagui style props reproduce the Tailwind look 1:1.
            focus:ring is approximated with a 1px emerald outline (see tamagui-gaps.md) */}
        <Input
          unstyled
          value={draft}
          onChangeText={(text) => setDraft(text)}
          placeholder={connected ? "Type a message…" : "Connecting…"}
          placeholderTextColor={"#52525b" as never}
          disabled={!connected}
          flex={1}
          borderRadius={9999}
          backgroundColor="#18181b"
          paddingHorizontal={16}
          paddingVertical={8}
          fontSize={14}
          color="#f4f4f5"
          outlineWidth={0}
          focusStyle={{
            outlineWidth: 1,
            outlineColor: "#34d399",
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
          borderRadius={9999}
          backgroundColor="#34d399"
          paddingHorizontal={16}
          paddingVertical={8}
          fontSize={14}
          fontWeight="600"
          color="#09090b"
          disabledStyle={{ opacity: 0.4 }}
          style={{ fontFamily: "inherit" }}
        >
          Send
        </Button>
      </XStack>
    </YStack>
  );
}
