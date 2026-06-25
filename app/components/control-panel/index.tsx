'use client';

import { useState } from 'react';
import type { ControlPanelProps } from './types';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ContentRenderer } from './content-renderer';
import { Footer } from './footer';

// Floating control panel — a square, near-black card (design system): a nav
// rail, a top bar, a content area per tab, and an optional footer. Fully
// controlled: the parent owns `state` and the handlers.
export function ControlPanel({
  state,
  onTabChange,
  onSend,
  onAiSend,
  onSearch,
  onSettingsChange,
}: ControlPanelProps) {
  // Local search term drives the People filter without leaking into domain state.
  const [query, setQuery] = useState('');

  const handleSearch = (term: string) => {
    setQuery(term);
    onSearch?.(term);
  };

  const noop = () => {};

  return (
    <div className="absolute m-5 flex h-[600px] w-[26rem] flex-row overflow-hidden rounded-none border border-gray-20 bg-background">
      <Sidebar
        activeTab={state.activeTab}
        onTabChange={onTabChange}
        requestCount={state.requests.length}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          activeTab={state.activeTab}
          conn={state.conn}
          video={state.video}
          requestCount={state.requests.length}
          onSearch={handleSearch}
          onStartVideo={noop}
          onEnd={noop}
        />
        <div className="control-panel-scroll relative flex-1 overflow-auto">
          <ContentRenderer
            state={state}
            query={query}
            onAiSend={onAiSend}
            onSettingsChange={onSettingsChange}
          />
        </div>
        <Footer
          activeTab={state.activeTab}
          conn={state.conn}
          video={state.video}
          onSend={onSend ?? noop}
          onAiSend={onAiSend ?? noop}
          onEndCall={noop}
        />
      </div>
    </div>
  );
}
