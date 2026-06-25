"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Body, Button } from "./ds";

export default function VideoPanel({
  localStream,
  remoteStream,
  onEnd,
  embedded = false,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEnd: () => void;
  // Embedded fills its parent (the control-panel call tab) with no End button —
  // the panel footer owns end-call. Standalone is the full-screen overlay.
  embedded?: boolean;
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
    <div
      className={cn(
        "flex flex-col bg-background",
        embedded ? "h-full w-full" : "absolute inset-0 z-30",
      )}
    >
      <div className="relative flex flex-col flex-1">
        {/* Remote fills the area. */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover bg-gray-8"
        />
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Body tone="muted">Waiting for stranger&rsquo;s video…</Body>
          </div>
        )}
        {/* Local (picture-in-picture) — square, gray-20 border to match the system. */}
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute object-cover border border-gray-20 bg-gray-8",
            embedded ? "bottom-3 right-3 h-28 w-20" : "bottom-4 right-4 h-40 w-28",
          )}
        />
      </div>
      {!embedded && (
        <div className="flex flex-row justify-center bg-background p-4">
          <Button variant="danger" size="md" onClick={onEnd}>
            End video
          </Button>
        </div>
      )}
    </div>
  );
}
