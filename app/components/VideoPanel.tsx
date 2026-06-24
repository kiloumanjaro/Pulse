"use client";

import { useEffect, useRef } from "react";
import { YStack, XStack, Text, Button } from "tamagui";

export default function VideoPanel({
  localStream,
  remoteStream,
  onEnd,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEnd: () => void;
}) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localRef.current.srcObject !== localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteRef.current.srcObject !== remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={30}
      backgroundColor="#000000"
    >
      <YStack position="relative" flex={1}>
        {/* Remote (full screen) — <video> has no Tamagui equivalent (see tamagui-gaps.md) */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="h-full w-full bg-zinc-900 object-cover"
        />
        {!remoteStream && (
          <YStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              fontSize={16}
              lineHeight={24}
              color="#71717a"
              style={{ fontFamily: "inherit" }}
            >
              Waiting for stranger&rsquo;s video…
            </Text>
          </YStack>
        )}
        {/* Local (picture-in-picture) — <video> has no Tamagui equivalent (see tamagui-gaps.md) */}
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 h-40 w-28 rounded-lg border border-zinc-700 bg-zinc-800 object-cover"
        />
      </YStack>
      <XStack justifyContent="center" backgroundColor="#09090b" padding={16}>
        {/* unstyled Button: Tamagui style props reproduce the Tailwind look 1:1 */}
        <Button
          unstyled
          onPress={onEnd}
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          borderRadius={9999}
          backgroundColor="#ef4444"
          paddingHorizontal={32}
          paddingVertical={12}
          fontSize={16}
          fontWeight="600"
          color="#ffffff"
          hoverStyle={{ backgroundColor: "#f87171" }}
          style={{ fontFamily: "inherit" }}
        >
          End video
        </Button>
      </XStack>
    </YStack>
  );
}
