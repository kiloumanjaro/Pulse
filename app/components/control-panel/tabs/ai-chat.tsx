'use client';

import { MagicStar } from 'iconsax-reactjs';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';
import { Body, Button } from '@/app/components/ds';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/components/ui/empty';

const SUGGESTIONS = [
  'How does Pulse protect my location?',
  'Is my chat really private?',
  'How do I start a call?',
];

interface AiChatTabProps {
  messages: ChatMessage[];
  onSuggest?: (text: string) => void;
}

// AI assistant. Empty → an intro with suggested prompts; otherwise the shared
// ChatPanel thread (header + composer are hosted by the top bar / footer).
export function AiChatTab({ messages, onSuggest }: AiChatTabProps) {
  if (messages.length === 0) {
    return (
      <Empty className="min-h-full justify-center border-none">
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
        <div className="flex w-full flex-col items-stretch gap-2">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              full
              className="justify-start text-left"
              onClick={() => onSuggest?.(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </Empty>
    );
  }

  return (
    <ChatPanel messages={messages} connected showHeader={false} showInput={false} />
  );
}
