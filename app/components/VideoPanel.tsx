"use client";

import { useEffect, useRef } from "react";
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
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      <div className="relative flex flex-col flex-1">
        {/* Remote (full screen). */}
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
          className="absolute bottom-4 right-4 h-40 w-28 object-cover border border-gray-20 bg-gray-8"
        />
      </div>
      <div className="flex flex-row justify-center bg-background p-4">
        <Button variant="danger" size="md" onClick={onEnd}>
          End video
        </Button>
      </div>
    </div>
  );
}
