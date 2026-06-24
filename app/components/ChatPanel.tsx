"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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

  const videoDisabled = !connected || videoBusy;
  const sendDisabled = !connected || !draft.trim();

  return (
    <div className="absolute top-0 bottom-0 right-0 z-20 flex flex-col w-full max-w-[448px] border-l border-gray-20 bg-background">
      <header className="flex flex-row items-center justify-between border-b border-gray-20 px-4 py-3">
        <div className="flex flex-col">
          <span className="font-sans text-base leading-6 font-medium text-foreground">
            Stranger
          </span>
          <span className="font-mono text-xs leading-4 text-gray-50">
            {connected ? "Connected" : "Connecting…"}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            onClick={onStartVideo}
            disabled={videoDisabled}
            className={cn("h-9 px-3.5", videoDisabled ? "opacity-40" : "opacity-100")}
          >
            Video
          </Button>
          <Button variant="danger" onClick={onEnd} className="h-9 px-3.5">
            End
          </Button>
        </div>
      </header>

      <div className="flex flex-col flex-1 gap-2 p-4 overflow-y-auto">
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

      <form
        onSubmit={submit}
        className="flex flex-row gap-2 border-t border-gray-20 p-3"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={connected ? "Type a message…" : "Connecting…"}
          disabled={!connected}
          className={cn("flex-1", connected ? "opacity-100" : "opacity-50")}
        />
        <Button
          variant="primary"
          type="submit"
          disabled={sendDisabled}
          className={sendDisabled ? "opacity-40" : "opacity-100"}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
