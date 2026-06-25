'use client';

import { MessageRemove } from 'iconsax-reactjs';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';
import ConnectionPrompt from '@/app/components/ConnectionPrompt';
import { Body, Button, Placeholder } from '@/app/components/ds';
import { Spinner } from '@/app/components/ui/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/components/ui/empty';
import type { ConnPhase } from '../types';

interface ChatTabProps {
  conn: ConnPhase;
  messages: ChatMessage[];
  onAccept?: () => void;
  onDecline?: () => void;
  onFindNew?: () => void;
}

// Text chat with the connected stranger. The header (Stranger/status/Video/End)
// lives in the top bar; the composer in the footer.
export function ChatTab({
  conn,
  messages,
  onAccept,
  onDecline,
  onFindNew,
}: ChatTabProps) {
  if (conn === 'connected') {
    return (
      <ChatPanel
        messages={messages}
        connected
        showHeader={false}
        showInput={false}
      />
    );
  }

  if (conn === 'incoming') {
    return (
      <ConnectionPrompt
        title="Stranger wants to connect"
        subtitle="Accept to open a peer-to-peer chat."
        acceptLabel="Accept"
        declineLabel="Decline"
        onAccept={() => onAccept?.()}
        onDecline={() => onDecline?.()}
      />
    );
  }

  if (conn === 'requesting' || conn === 'connecting') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-6">
        <Spinner className="size-5 text-gray-50" />
        <Body size="sm" tone="muted">
          {conn === 'requesting' ? 'Requesting…' : 'Connecting…'}
        </Body>
      </div>
    );
  }

  if (conn === 'ended') {
    return (
      <Empty className="min-h-full justify-center border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-gray-12 rounded-none">
            <MessageRemove size={22} variant="Bold" color="currentColor" />
          </EmptyMedia>
          <EmptyTitle>Chat ended</EmptyTitle>
          <EmptyDescription>
            <Body size="sm" tone="muted">
              The stranger disconnected.
            </Body>
            <Body size="sm" tone="muted" className="mt-1 text-xs">
              Messages were peer-to-peer and never stored.
            </Body>
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" size="sm" onClick={() => onFindNew?.()}>
          Find someone new
        </Button>
      </Empty>
    );
  }

  // idle — nothing started yet.
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6">
      <Placeholder label="NO ACTIVE CHAT" className="h-28 w-full" />
      <Body size="sm" tone="muted" className="text-center">
        Tap a dot on the map to start talking to a stranger.
      </Body>
    </div>
  );
}
