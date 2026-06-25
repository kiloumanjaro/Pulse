'use client';

import { MagicStar } from 'iconsax-reactjs';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';
import { Body } from '@/app/components/ds';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/components/ui/empty';

interface AiChatTabProps {
  messages: ChatMessage[];
}

// AI assistant. Empty → a short intro; otherwise the shared ChatPanel thread
// (header + composer are hosted by the top bar / footer).
export function AiChatTab({ messages }: AiChatTabProps) {
  if (messages.length === 0) {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the centered content sits at
      // the panel's true center instead of being pushed left by it.
      <Empty className="-mr-3.5 min-h-full justify-center border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-gray-12 rounded-none">
            <MagicStar size={22} variant="Bold" color="currentColor" />
          </EmptyMedia>
          <EmptyTitle>Ask Pulse anything</EmptyTitle>
          <EmptyDescription>
            <Body size="sm" tone="muted">
              The assistant answers questions about how Pulse works — privacy,
              connecting, and calls. It never sees your conversations.
            </Body>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ChatPanel messages={messages} connected showHeader={false} showInput={false} embedded />
  );
}
