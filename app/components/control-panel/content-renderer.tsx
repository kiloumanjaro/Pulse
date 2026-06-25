'use client';

// Per-tab content. The `chatbot` tab hosts ChatPanel (header + composer live in
// the top bar / footer); every other tab renders a blank canvas.
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';

interface ContentRendererProps {
  activeTab: string;
  connected: boolean;
  messages: ChatMessage[];
}

export function ContentRenderer({
  activeTab,
  connected,
  messages,
}: ContentRendererProps) {
  if (activeTab === 'chatbot') {
    return (
      <ChatPanel
        messages={messages}
        connected={connected}
        showHeader={false}
        showInput={false}
      />
    );
  }
  return <div key={activeTab} className="h-full w-full" />;
}
