'use client';

import ConnectionPrompt from '@/app/components/ConnectionPrompt';
import VideoPanel from '@/app/components/VideoPanel';
import { Body, Button } from '@/app/components/ds';
import { Spinner } from '@/app/components/ui/spinner';
import type { VideoPhase } from '../types';

interface CallTabProps {
  video: VideoPhase;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}

const noop = () => {};

// Video / audio call surface. The end-call controls live in the footer when a
// call is active.
export function CallTab({
  video,
  localStream,
  remoteStream,
  onAccept,
  onDecline,
  onCancel,
}: CallTabProps) {
  if (video === 'incoming') {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the overlay (and its centered
      // card) spans the full panel instead of being pushed left by it.
      <div className="relative -mr-3.5 min-h-full">
        <ConnectionPrompt
          title="Stranger wants to start a video call"
          subtitle="Your camera and mic will turn on."
          acceptLabel="Accept"
          declineLabel="Decline"
          onAccept={() => onAccept?.()}
          onDecline={() => onDecline?.()}
        />
      </div>
    );
  }

  if (video === 'requesting') {
    return (
      // -mr-3.5 offsets the 14px scrollbar gutter so the centered column sits at
      // the panel's true center instead of being pushed left by it.
      <div className="-mr-3.5 flex min-h-full flex-col items-center justify-center gap-3 p-6">
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
    // Real video. Remote fills the frame; local sits picture-in-picture. The
    // end-call + mic/camera controls live in the footer. Left/top/bottom insets
    // mirror the scrollbar gutter reserved on the right, keeping the frame
    // evenly spaced from all four panel edges.
    return (
      <div className="h-full min-h-full w-full pt-[14px] pb-[14px] pl-[14px]">
        <VideoPanel
          embedded
          localStream={localStream ?? null}
          remoteStream={remoteStream ?? null}
          onEnd={noop}
        />
      </div>
    );
  }

  // none — no active call.
  return (
    // -mr-3.5 offsets the 14px scrollbar gutter so the centered column sits at
    // the panel's true center instead of being pushed left by it.
    <div className="-mr-3.5 flex min-h-full flex-col items-center justify-center gap-4 p-6">
      <Body size="sm" tone="muted" className="text-center">
        Start a call from an active chat.
      </Body>
    </div>
  );
}
