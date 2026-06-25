import type { ChatMessage } from '@/app/components/ChatPanel';

// The six control-panel sections. `ai-chat` is pinned to the top of the rail;
// the rest follow the session journey: discover → connect → chat → call → settings.
export type ControlPanelTab =
  | 'ai-chat'
  | 'people'
  | 'requests'
  | 'chat'
  | 'call'
  | 'settings';

// Phase-only mirrors of the live page's Conn["kind"] / VideoState (app/live/page.tsx).
// The skeletons only need the phase, not the peerId, so these stay panel-local —
// no import from or change to the live page.
export type ConnPhase =
  | 'idle'
  | 'requesting'
  | 'incoming'
  | 'connecting'
  | 'connected'
  | 'ended'; // terminal: the stranger disconnected / the chat closed

export type VideoPhase = 'none' | 'requesting' | 'incoming' | 'active';

// A nearby anonymous stranger, as the People tab renders them.
export interface Stranger {
  id: string;
  handle: string; // generated, e.g. "Stranger-7QF"
  distanceKm: number; // for "~3 km away"
  busy: boolean; // dimmed + "in a chat", Connect disabled
}

export type RequestDirection = 'incoming' | 'outgoing' | 'declined';

export interface ConnectionRequest {
  id: string;
  handle: string;
  direction: RequestDirection;
  distanceKm: number;
}

export interface SettingsValues {
  cameraId: string;
  micId: string;
  speakerId: string;
  soundOnRequest: boolean; // notification sound on incoming request
  allowVideo: boolean; // accept video escalation
  appearOnMap: boolean; // visible vs "go invisible"
}

// Everything the skeletons need to render every state. Held by the dev harness
// today; later derived from the live page's real connection/presence state.
export interface ControlPanelState {
  activeTab: ControlPanelTab;
  conn: ConnPhase;
  video: VideoPhase;
  messages: ChatMessage[];
  aiMessages: ChatMessage[];
  people: Stranger[];
  requests: ConnectionRequest[];
  settings: SettingsValues;
}

// Controlled props. The parent owns `state` and the handlers; the panel is
// presentational.
export interface ControlPanelProps {
  state: ControlPanelState;
  // Rail-only until a tab is clicked, auto-dismiss on outside interaction.
  // Off (default true) keeps the content pinned open — used by the dev lab.
  autoCollapse?: boolean;
  // Optional controlled collapse: supply both to drive it externally (the lab).
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  // Which rail items to render. Defaults to all six.
  tabs?: ControlPanelTab[];
  // Live media for the call tab; mic/camera reflect the local track state.
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  muted?: boolean;
  cameraOff?: boolean;
  onTabChange: (tab: ControlPanelTab) => void;
  onSend?: (text: string) => void; // chat composer
  onAiSend?: (text: string) => void; // ai composer
  onSearch?: (term: string) => void;
  onSettingsChange?: (patch: Partial<SettingsValues>) => void;
  // Action handlers. The panel is presentational; the parent owns the logic.
  onConnectPeer?: (id: string) => void; // People → Connect
  onAcceptConnect?: () => void; // Chat → incoming Accept
  onDeclineConnect?: () => void; // Chat → incoming Decline
  onCancelConnect?: () => void; // Chat → cancel an outgoing request
  onStartVideo?: () => void; // Chat → escalate to video
  onEndChat?: () => void; // Chat → end the connection
  onAcceptVideo?: () => void; // Call → incoming Accept
  onDeclineVideo?: () => void; // Call → incoming Decline
  onCancelVideo?: () => void; // Call → cancel an outgoing video request
  onEndCall?: () => void; // Call → end the active video
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
}
