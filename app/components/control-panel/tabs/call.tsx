'use client';

import { Video } from 'iconsax-reactjs';
import ConnectionPrompt from '@/app/components/ConnectionPrompt';
import { Body, Button, Hatch, Placeholder } from '@/app/components/ds';
import { Spinner } from '@/app/components/ui/spinner';
import type { VideoPhase } from '../types';

interface CallTabProps {
  video: VideoPhase;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}

// Video / audio call surface. The end-call controls live in the footer when a
// call is active.
export function CallTab({ video, onAccept, onDecline, onCancel }: CallTabProps) {
  if (video === 'incoming') {
    return (
      <ConnectionPrompt
        title="Stranger wants to start a video call"
        subtitle="Your camera and mic will turn on."
        acceptLabel="Accept"
        declineLabel="Decline"
        onAccept={() => onAccept?.()}
        onDecline={() => onDecline?.()}
      />
    );
  }

  if (video === 'requesting') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-6">
        <Spinner className="size-5 text-gray-50" />
        <Body size="sm" tone="muted" className="text-center">
          Calling… waiting for the stranger to accept.
        </Body>
        <Button variant="ghost" size="sm" onClick={() => onCancel?.()}>
          Cancel
        </Button>
      </div>
    );
  }

  if (video === 'active') {
    // Skeleton stand-in for VideoPanel (which needs real MediaStreams). Remote
    // fills the area; local sits picture-in-picture.
    return (
      <div className="relative h-full min-h-full w-full bg-gray-8">
        <Hatch className="absolute inset-0 opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Body size="sm" tone="muted">
            Stranger&rsquo;s video
          </Body>
        </div>
        <div className="absolute right-3 bottom-3 flex h-28 w-20 items-center justify-center border border-gray-20 bg-gray-5">
          <Video size={20} variant="Linear" color="currentColor" className="text-gray-50" />
        </div>
      </div>
    );
  }

  // none — no active call.
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6">
      <Placeholder label="NO ACTIVE CALL" className="h-28 w-full" />
      <Body size="sm" tone="muted" className="text-center">
        Start a call from an active chat.
      </Body>
    </div>
  );
}
