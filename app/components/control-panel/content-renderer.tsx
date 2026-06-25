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
  onAiSend?: (text: string) => void;
  onSettingsChange?: (patch: Partial<SettingsValues>) => void;
}

export function ContentRenderer({
  state,
  query,
  onAiSend,
  onSettingsChange,
}: ContentRendererProps) {
  switch (state.activeTab) {
    case 'ai-chat':
      return <AiChatTab messages={state.aiMessages} onSuggest={onAiSend} />;
    case 'people':
      return <PeopleTab people={state.people} query={query} />;
    case 'requests':
      return <RequestsTab requests={state.requests} />;
    case 'chat':
      return <ChatTab conn={state.conn} messages={state.messages} />;
    case 'call':
      return <CallTab video={state.video} />;
    case 'settings':
      return (
        <SettingsTab values={state.settings} onChange={onSettingsChange} />
      );
    default:
      return null;
  }
}
