'use client';

// Per-tab content. Each tab is a presentational skeleton fed a slice of the
// control-panel state.
import type { ControlPanelState, SettingsValues } from './types';
import { AiChatTab } from './tabs/ai-chat';
import { PeopleTab } from './tabs/people';
import { RequestsTab } from './tabs/requests';
import { ChatTab } from './tabs/chat';
import { CallTab } from './tabs/call';
import { SettingsTab } from './tabs/settings';

interface ContentRendererProps {
  state: ControlPanelState;
  query: string;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  onSettingsChange?: (patch: Partial<SettingsValues>) => void;
  onConnectPeer?: (id: string) => void;
  onAcceptConnect?: () => void;
  onDeclineConnect?: () => void;
  onCancelConnect?: () => void;
  onAcceptVideo?: () => void;
  onDeclineVideo?: () => void;
  onCancelVideo?: () => void;
}

export function ContentRenderer({
  state,
  query,
  localStream,
  remoteStream,
  onSettingsChange,
  onConnectPeer,
  onAcceptConnect,
  onDeclineConnect,
  onCancelConnect,
  onAcceptVideo,
  onDeclineVideo,
  onCancelVideo,
}: ContentRendererProps) {
  switch (state.activeTab) {
    case 'ai-chat':
      return <AiChatTab messages={state.aiMessages} />;
    case 'people':
      return (
        <PeopleTab
          people={state.people}
          query={query}
          onConnect={onConnectPeer}
        />
      );
    case 'requests':
      // `conn` is single-peer, so the per-row id is ignored — the handlers
      // act on the one active request.
      return (
        <RequestsTab
          requests={state.requests}
          onAccept={onAcceptConnect && (() => onAcceptConnect())}
          onDecline={onDeclineConnect && (() => onDeclineConnect())}
          onCancel={onCancelConnect && (() => onCancelConnect())}
        />
      );
    case 'chat':
      return (
        <ChatTab
          conn={state.conn}
          messages={state.messages}
          onAccept={onAcceptConnect}
          onDecline={onDeclineConnect}
          onCancel={onCancelConnect}
        />
      );
    case 'call':
      return (
        <CallTab
          video={state.video}
          localStream={localStream}
          remoteStream={remoteStream}
          onAccept={onAcceptVideo}
          onDecline={onDeclineVideo}
          onCancel={onCancelVideo}
        />
      );
    case 'settings':
      return (
        <SettingsTab values={state.settings} onChange={onSettingsChange} />
      );
    default:
      return null;
  }
}
