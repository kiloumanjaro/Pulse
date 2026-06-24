"use client";

import { useEffect, useRef } from "react";
import { YStack, XStack } from "tamagui";
import { Body, Button } from "./ui";

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
      backgroundColor="$background"
    >
      <YStack position="relative" flex={1}>
        {/* Remote (full screen) — <video> has no Tamagui equivalent (see design-system.md §14) */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          style={{ backgroundColor: "#121317" }}
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
            <Body tone="muted">Waiting for stranger&rsquo;s video…</Body>
          </YStack>
        )}
        {/* Local (picture-in-picture) — square, gray-20 border to match the system */}
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 h-40 w-28 object-cover"
          style={{ border: "1px solid #2e3038", backgroundColor: "#121317" }}
        />
      </YStack>
      <XStack justifyContent="center" backgroundColor="$background" padding={16}>
        <Button variant="danger" size="md" onPress={onEnd}>
          End video
        </Button>
      </XStack>
    </YStack>
  );
}
