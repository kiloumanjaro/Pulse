import type { ChatMessage } from '@/app/components/ChatPanel';
import type {
  ConnectionRequest,
  ControlPanelState,
  SettingsValues,
  Stranger,
} from '@/app/components/control-panel/types';

// --- Messages -------------------------------------------------------------

const FEW: ChatMessage[] = [
  { id: 1, mine: false, text: 'Hey there 👋' },
  { id: 2, mine: true, text: 'Hi! Where are you pinging from?' },
  { id: 3, mine: false, text: 'A dot somewhere near the coast. You?' },
];

export type MessagePreset = 'empty' | 'few' | 'many';

export function messages(preset: MessagePreset): ChatMessage[] {
  if (preset === 'empty') return [];
  if (preset === 'few') return FEW;
  // many — exercise the scroll area.
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    mine: i % 2 === 1,
    text:
      i % 2 === 1
        ? `Reply number ${i + 1} from me.`
        : `Message ${i + 1} from the stranger — just testing scroll.`,
  }));
}

export const AI_INTRO: ChatMessage[] = [];
export const AI_THREAD: ChatMessage[] = [
  { id: 1, mine: true, text: 'How does Pulse protect my location?' },
  {
    id: 2,
    mine: false,
    text: 'Your dot is offset 1–3 km from your real position and re-rolled every session, so the map is useful without exposing where you are.',
  },
];

// --- People ---------------------------------------------------------------

const HANDLES = ['7QF', 'K3M', 'X9P', 'B2T', 'R5L', 'M8W'];

function stranger(i: number, busy = false): Stranger {
  return {
    id: `peer-${i}`,
    handle: `Stranger-${HANDLES[i % HANDLES.length]}`,
    distanceKm: Math.round((1 + i * 1.7) * 10) / 10,
    busy,
  };
}

export type PeoplePreset = 'empty' | 'some' | 'busy';

export function people(preset: PeoplePreset): Stranger[] {
  if (preset === 'empty') return [];
  if (preset === 'busy')
    return Array.from({ length: 5 }, (_, i) => stranger(i, true));
  return Array.from({ length: 5 }, (_, i) => stranger(i, i === 2));
}

// --- Requests -------------------------------------------------------------

export type RequestPreset = 'none' | 'incoming' | 'outgoing' | 'declined';

export function requests(preset: RequestPreset): ConnectionRequest[] {
  if (preset === 'none') return [];
  if (preset === 'incoming')
    return [
      { id: 'r1', handle: 'Stranger-K3M', direction: 'incoming', distanceKm: 2.4 },
      { id: 'r2', handle: 'Stranger-X9P', direction: 'incoming', distanceKm: 8.1 },
    ];
  if (preset === 'outgoing')
    return [
      { id: 'r3', handle: 'Stranger-B2T', direction: 'outgoing', distanceKm: 3.3 },
    ];
  return [
    { id: 'r4', handle: 'Stranger-R5L', direction: 'declined', distanceKm: 5.0 },
  ];
}

// --- Settings -------------------------------------------------------------

export const DEFAULT_SETTINGS: SettingsValues = {
  cameraId: 'cam-default',
  micId: 'mic-default',
  speakerId: 'spk-default',
  soundOnRequest: true,
  allowVideo: true,
  appearOnMap: true,
};

// --- Default state --------------------------------------------------------

export const DEFAULT_STATE: ControlPanelState = {
  activeTab: 'ai-chat',
  conn: 'idle',
  video: 'none',
  messages: FEW,
  aiMessages: AI_INTRO,
  people: people('some'),
  requests: requests('incoming'),
  settings: DEFAULT_SETTINGS,
};
