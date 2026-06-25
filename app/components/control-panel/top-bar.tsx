'use client';

import { SearchBar } from './search-bar';
import { ChatControls } from './chat-controls';
import { Eyebrow } from '@/app/components/ds';
import type { ControlPanelTab, ConnPhase, VideoPhase } from './types';

interface TopBarProps {
  activeTab: ControlPanelTab;
  conn: ConnPhase;
  video: VideoPhase;
  onSearch: (term: string) => void;
  onStartVideo: () => void;
  onEnd: () => void;
}

const TITLES: Record<ControlPanelTab, string> = {
  'ai-chat': 'AI Assistant',
  people: 'People',
  requests: 'Requests',
  chat: 'Chat',
  call: 'Call',
  settings: 'Settings',
};

// Top bar chrome — a 1px gray-20 hairline below it. Each tab gets its own
// controls; everything else gets a mono eyebrow title.
export function TopBar({
  activeTab,
  conn,
  video,
  onSearch,
  onStartVideo,
  onEnd,
}: TopBarProps) {
  return (
    <div className="flex h-[58px] flex-row items-center gap-2 border-b border-gray-20 px-4 py-3">
      {activeTab === 'people' ? (
        <SearchBar onSearch={onSearch} />
      ) : activeTab === 'chat' || activeTab === 'call' ? (
        <div className="h-8.5 flex-1">
          <ChatControls
            mode={activeTab === 'call' ? 'call' : 'chat'}
            connected={conn === 'connected'}
            videoBusy={video !== 'none'}
            onStartVideo={onStartVideo}
            onEnd={onEnd}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-row items-center gap-2">
          <Eyebrow>{TITLES[activeTab]}</Eyebrow>
        </div>
      )}
    </div>
  );
}
