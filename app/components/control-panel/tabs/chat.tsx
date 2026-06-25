'use client';

import { MessageRemove } from 'iconsax-reactjs';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';
import ConnectionPrompt from '@/app/components/ConnectionPrompt';
import { Body, Button } from '@/app/components/ds';
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
  onCancel?: () => void;
  onFindNew?: () => void;
}

// Text chat with the connected stranger. The header (Stranger/status/Video/End)
// lives in the top bar; the composer in the footer.
export function ChatTab({
  conn,
  messages,
  onAccept,
  onDecline,
  onCancel,
  onFindNew,
}: ChatTabProps) {
  if (conn === 'connected') {
    return (
      <ChatPanel
        messages={messages}
        connected
        showHeader={false}
        showInput={false}
        embedded
      />
    );
  }

  if (conn === 'incoming') {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the overlay (and its centered
      // card) spans the full panel instead of being pushed left by it.
      <div className="relative -mr-3.5 min-h-full">
        <ConnectionPrompt
          title="Stranger wants to connect"
          subtitle="Accept to open a peer-to-peer chat."
          acceptLabel="Accept"
          declineLabel="Decline"
          onAccept={() => onAccept?.()}
          onDecline={() => onDecline?.()}
        />
      </div>
    );
  }

  if (conn === 'requesting' || conn === 'connecting') {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the centered column sits at
      // the panel's true center instead of being pushed left by it.
      <div className="-mr-3.5 flex min-h-full flex-col items-center justify-center gap-3 p-6">
        <Spinner className="size-5 text-gray-50" />
        <Body size="sm" tone="muted">
          {conn === 'requesting' ? 'Requesting…' : 'Connecting…'}
        </Body>
        {conn === 'requesting' && (
          <Button variant="ghost" size="sm" onClick={() => onCancel?.()}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  if (conn === 'ended') {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the centered content sits at
      // the panel's true center instead of being pushed left by it.
      <Empty className="-mr-3.5 min-h-full justify-center border-none">
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
    // -mr-3.5 offsets the 14px scrollbar gutter so the centered column sits at
    // the panel's true center instead of being pushed left by it.
    <div className="-mr-3.5 flex min-h-full flex-col items-center justify-center gap-4 p-6">
      <Body size="sm" tone="muted" className="text-center">
        Tap a dot on the map to start talking to a stranger.
      </Body>
    </div>
  );
}
