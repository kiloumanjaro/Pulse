'use client';

import { Video, PhoneOff, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ds';

interface ChatControlsProps {
  mode: 'chat' | 'call';
  connected: boolean;
  videoBusy: boolean;
  onStartVideo: () => void;
  onEnd: () => void;
}

// Chat link bar — "Stranger" anchors the left; Connected/Video/End collapse to
// icons. Sized to the 34px (h-8.5) top-bar slot: 28px square buttons, 16px glyphs.
// Chat carries the Video/End actions (footer is a plain composer); call carries
// only the connectivity glyph since its footer already ends the call.
export function ChatControls({
  mode,
  connected,
  videoBusy,
  onStartVideo,
  onEnd,
}: ChatControlsProps) {
  const videoDisabled = !connected || videoBusy;

  return (
    <div className="flex h-8.5 w-full flex-row items-center justify-between">
      <span className="font-sans text-sm font-medium text-foreground">
        Stranger
      </span>
      <div className="flex flex-row items-center gap-1.5">
        {mode === 'call' ? (
          // Connectivity strength — non-interactive; reserved for a future
          // signal indicator. Chat omits it: a drop swaps the body to "Chat ended".
          <span
            role="img"
            aria-label={connected ? 'Connected' : 'Connecting…'}
            title={connected ? 'Connected' : 'Connecting…'}
            className={cn(
              'flex h-7 w-7 items-center justify-center',
              connected ? 'text-foreground' : 'text-gray-50',
            )}
          >
            {connected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </span>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onStartVideo}
              disabled={videoDisabled}
              aria-label="Start video"
              title="Start video"
              className={cn(
                'h-7 w-7',
                videoDisabled ? 'opacity-40' : 'opacity-100',
              )}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              variant="danger"
              size="icon"
              onClick={onEnd}
              aria-label="End chat"
              title="End chat"
              className="h-7 w-7"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
