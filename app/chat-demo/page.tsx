'use client';

// Temporary preview of the chat panel for tweaking in isolation. Feeds
// ChatPanel mock messages and stubbed handlers so it renders standalone.

import { useState } from 'react';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';

const SEED: ChatMessage[] = [
  { id: 1, mine: false, text: 'Hey there 👋' },
  { id: 2, mine: true, text: 'Hi! This is a preview page.' },
  { id: 3, mine: false, text: 'Tweak away — nothing here is wired to a peer.' },
];

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);

  return (
    <main className="relative h-screen w-full bg-[#040406]">
      <ChatPanel
        messages={messages}
        connected
        onSend={(text) =>
          setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, mine: true, text },
          ])
        }
      />
    </main>
  );
}
