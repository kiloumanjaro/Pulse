'use client';

import { useState } from 'react';
import type { ControlPanelProps } from './types';
import type { ChatMessage } from '@/app/components/ChatPanel';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ContentRenderer } from './content-renderer';
import { Footer } from './footer';

const SEED: ChatMessage[] = [
  { id: 1, mine: false, text: 'Hey there 👋' },
  { id: 2, mine: true, text: 'Hi! This is the chatbot tab.' },
];

// Floating control panel — a square, near-black card (design system):
// a nav rail, a top bar, a content area per tab, and an optional footer.
export function ControlPanel({
  activeTab,
  onTabChange,
  onSearch,
}: ControlPanelProps) {
  // Demo chat state — the top bar hosts the Stranger/Connected/Video/End
  // controls and the footer hosts the composer, so chat state lives here and
  // feeds the bar, the content panel, and the footer.
  const [connected] = useState(true);
  const [videoBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const startVideo = () => {};
  const endChat = () => {};
  const sendMessage = (text: string) =>
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, mine: true, text },
    ]);

  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-96 overflow-hidden rounded-none border border-gray-20 bg-background">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          activeTab={activeTab}
          onSearch={onSearch}
          connected={connected}
          videoBusy={videoBusy}
          onStartVideo={startVideo}
          onEnd={endChat}
        />
        <div className="control-panel-scroll relative flex-1 overflow-auto">
          <ContentRenderer
            activeTab={activeTab}
            connected={connected}
            messages={messages}
          />
        </div>
        <Footer
          activeTab={activeTab}
          connected={connected}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
