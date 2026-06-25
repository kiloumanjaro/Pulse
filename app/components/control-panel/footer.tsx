'use client';

import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatInput from '@/app/components/ChatInput';
import { Button } from '@/app/components/ds';
import type { ControlPanelTab, ConnPhase, VideoPhase } from './types';

interface FooterProps {
  activeTab: ControlPanelTab;
  conn: ConnPhase;
  video: VideoPhase;
  muted?: boolean;
  cameraOff?: boolean;
  onSend: (text: string) => void;
  onAiSend: (text: string) => void;
  onEndCall: () => void;
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
}

// Bottom chrome — optional, mirrors TopBar. Composer for ai/chat tabs; an
// end-call band for an active call. Mic/camera reflect the live local track
// state owned by the parent.
export function Footer({
  activeTab,
  conn,
  video,
  muted = false,
  cameraOff = false,
  onSend,
  onAiSend,
  onEndCall,
  onToggleMute,
  onToggleCamera,
}: FooterProps) {
  if (activeTab === 'ai-chat') {
    return (
      <div className="flex flex-row items-center gap-2 border-t border-gray-20 px-4 py-3">
        <ChatInput connected onSend={onAiSend} />
      </div>
    );
  }

  if (activeTab === 'chat') {
    return (
      <div className="flex flex-row items-center gap-2 border-t border-gray-20 px-4 py-3">
        <ChatInput connected={conn === 'connected'} onSend={onSend} />
      </div>
    );
  }

  if (activeTab === 'call' && video === 'active') {
    return (
      <div className="flex flex-row items-center justify-center gap-2 border-t border-gray-20 px-4 py-3">
        <Button
          variant="outline"
          size="icon"
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Unmute' : 'Mute'}
          className={cn('h-9 w-9', muted && 'bg-gray-12')}
          onClick={onToggleMute}
        >
          {muted ? <MicOff className="h-[18px] w-[18px]" /> : <Mic className="h-[18px] w-[18px]" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label={cameraOff ? 'Turn camera on' : 'Turn camera off'}
          title={cameraOff ? 'Turn camera on' : 'Turn camera off'}
          className={cn('h-9 w-9', cameraOff && 'bg-gray-12')}
          onClick={onToggleCamera}
        >
          {cameraOff ? (
            <VideoOff className="h-[18px] w-[18px]" />
          ) : (
            <Video className="h-[18px] w-[18px]" />
          )}
        </Button>
        <Button
          variant="danger"
          size="md"
          className="ml-1 gap-2"
          onClick={onEndCall}
        >
          <PhoneOff className="h-[18px] w-[18px]" />
          End call
        </Button>
      </div>
    );
  }

  return null;
}
