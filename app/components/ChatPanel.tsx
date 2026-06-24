"use client";

import { useEffect, useRef, useState } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Body, Button, Input } from "./ui";

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
      borderColor="$gray20"
      backgroundColor="$background"
    >
      <XStack
        tag="header"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderColor="$gray20"
        paddingHorizontal={16}
        paddingVertical={12}
      >
        <YStack>
          <Text
            fontFamily="$body"
            fontSize={16}
            lineHeight={24}
            fontWeight="500"
            color="$foreground"
          >
            Stranger
          </Text>
          <Text fontFamily="$mono" fontSize={12} lineHeight={16} color="$gray50">
            {connected ? "Connected" : "Connecting…"}
          </Text>
        </YStack>
        <XStack gap={8}>
          <Button
            variant="outline"
            height={36}
            paddingHorizontal={14}
            onPress={onStartVideo}
            disabled={!connected || videoBusy}
            opacity={!connected || videoBusy ? 0.4 : 1}
          >
            Video
          </Button>
          <Button
            variant="danger"
            height={36}
            paddingHorizontal={14}
            onPress={onEnd}
          >
            End
          </Button>
        </XStack>
      </XStack>

      <YStack flex={1} gap={8} padding={16} style={{ overflowY: "auto" }}>
        {messages.length === 0 && (
          <Body size="sm" tone="muted" textAlign="center" marginTop={32}>
            Say hello. Messages are peer-to-peer and never stored.
          </Body>
        )}
        {messages.map((m) => (
          <XStack key={m.id} justifyContent={m.mine ? "flex-end" : "flex-start"}>
            <Text
              maxWidth="80%"
              borderRadius={0}
              borderWidth={m.mine ? 0 : 1}
              borderColor="$gray20"
              paddingHorizontal={12}
              paddingVertical={8}
              fontFamily="$body"
              fontSize={14}
              lineHeight={20}
              backgroundColor={m.mine ? "$foreground" : "$gray12"}
              color={m.mine ? "$background" : "$foreground"}
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
        borderColor="$gray20"
        padding={12}
      >
        <Input
          value={draft}
          onChangeText={(text: string) => setDraft(text)}
          placeholder={connected ? "Type a message…" : "Connecting…"}
          disabled={!connected}
          flex={1}
          opacity={connected ? 1 : 0.5}
        />
        <Button
          variant="primary"
          type="submit"
          disabled={!connected || !draft.trim()}
          opacity={!connected || !draft.trim() ? 0.4 : 1}
        >
          Send
        </Button>
      </XStack>
    </YStack>
  );
}
