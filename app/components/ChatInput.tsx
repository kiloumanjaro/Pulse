"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input } from "./ds";

// The message composer (input + Send). Lives in its own component so both the
// standalone ChatPanel (live page) and the control-panel footer can host it.
// The caller supplies the surrounding band styling via `className`.
export default function ChatInput({
  connected,
  onSend,
  className,
}: {
  connected: boolean;
  onSend: (text: string) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !connected) return;
    onSend(text);
    setDraft("");
  }

  const sendDisabled = !connected || !draft.trim();

  return (
    <form
      onSubmit={submit}
      className={cn("flex w-full flex-row items-center gap-2", className)}
    >
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={connected ? "Type a message…" : "Connecting…"}
        disabled={!connected}
        className={cn("min-w-0 flex-1", connected ? "opacity-100" : "opacity-50")}
      />
      <Button
        variant="primary"
        type="submit"
        disabled={sendDisabled}
        className={cn("shrink-0", sendDisabled ? "opacity-40" : "opacity-100")}
      >
        Send
      </Button>
    </form>
  );
}
