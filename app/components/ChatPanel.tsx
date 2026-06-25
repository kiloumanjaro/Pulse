"use client";

import { useEffect, useRef } from "react";
import { Video, PhoneOff, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Body, Button } from "./ds";
import ChatInput from "./ChatInput";

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
}

export default function ChatPanel({
  messages,
  connected,
  onSend,
  // Header and input are optional: standalone surfaces (e.g. the live page) host
  // the Stranger/Connected/Video/End controls and the composer here. The
  // control-panel chatbot tab hides both — its top bar and footer host them.
  showHeader = true,
  showInput = true,
  // Embedded surfaces (the control-panel tabs) live inside the panel's own
  // styled scroll container, so the panel must not be pinned or own its scroll —
  // otherwise the messages list spawns a second, unstyled scrollbar.
  embedded = false,
  videoBusy = false,
  onStartVideo,
  onEnd,
}: {
  messages: ChatMessage[];
  connected: boolean;
  onSend?: (text: string) => void;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
  videoBusy?: boolean;
  onStartVideo?: () => void;
  onEnd?: () => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const videoDisabled = !connected || videoBusy;

  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        embedded
          ? "min-h-full w-full"
          : "absolute top-0 bottom-0 right-0 z-20 w-full max-w-[448px] border-l border-gray-20",
      )}
    >
      {showHeader && (
        // Single-row link bar: "Stranger" anchors the left; Connected/Video/End
        // collapse to icons on the right. Fixed h-16 keeps a stable header height.
        <header className="flex h-16 flex-row items-center justify-between border-b border-gray-20 px-4">
          <span className="font-sans text-base leading-6 font-medium text-foreground">
            Stranger
          </span>
          <div className="flex flex-row items-center gap-2">
            {/* Status only — non-interactive; state shown by glyph + color + tooltip. */}
            <span
              role="img"
              aria-label={connected ? "Connected" : "Connecting…"}
              title={connected ? "Connected" : "Connecting…"}
              className={cn(
                "mr-1 flex h-9 w-9 items-center justify-center",
                connected ? "text-foreground" : "text-gray-50",
              )}
            >
              {connected ? (
                <Wifi className="h-[18px] w-[18px]" />
              ) : (
                <WifiOff className="h-[18px] w-[18px]" />
              )}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={onStartVideo}
              disabled={videoDisabled}
              aria-label="Start video"
              title="Start video"
              className={cn("h-9 w-9", videoDisabled ? "opacity-40" : "opacity-100")}
            >
              <Video className="h-[18px] w-[18px]" />
            </Button>
            <Button
              variant="danger"
              size="icon"
              onClick={onEnd}
              aria-label="End chat"
              title="End chat"
              className="h-9 w-9"
            >
              <PhoneOff className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </header>
      )}

      <div
        className={cn(
          "flex flex-1 flex-col gap-2 py-4 pl-4",
          embedded ? "pr-2" : "overflow-y-auto pr-4",
        )}
      >
        {messages.length === 0 && (
          <Body size="sm" tone="muted" className="text-center mt-8">
            Say hello. Messages are peer-to-peer and never stored.
          </Body>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex flex-row", m.mine ? "justify-end" : "justify-start")}
          >
            <span
              className={cn(
                "max-w-[80%] rounded-none px-3 py-2 font-sans text-sm leading-5",
                m.mine
                  ? "bg-foreground text-background"
                  : "border border-gray-20 bg-gray-12 text-foreground",
              )}
            >
              {m.text}
            </span>
          </div>
        ))}
        {/* Plain scroll anchor for scrollIntoView — non-visual layout marker. */}
        <div ref={endRef} />
      </div>

      {showInput && onSend && (
        <ChatInput
          connected={connected}
          onSend={onSend}
          className="border-t border-gray-20 px-4 py-3"
        />
      )}
    </div>
  );
}
