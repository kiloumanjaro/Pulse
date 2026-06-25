'use client';

import ChatInput from '@/app/components/ChatInput';

interface FooterProps {
  activeTab: string;
  connected: boolean;
  onSend: (text: string) => void;
}

// Bottom chrome — the counterpart to TopBar: same band + 1px gray-20 hairline,
// but optional. Only tabs that need a footer render one; others get nothing.
export function Footer({ activeTab, connected, onSend }: FooterProps) {
  const showChatInput = activeTab === 'chatbot';
  if (!showChatInput) return null;

  return (
    <div className="flex flex-row items-center gap-2 py-3 px-4 border-t border-gray-20">
      <ChatInput connected={connected} onSend={onSend} />
    </div>
  );
}
