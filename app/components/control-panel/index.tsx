'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ControlPanelProps, ControlPanelTab } from './types';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ContentRenderer } from './content-renderer';
import { Footer } from './footer';

// Floating control panel — a square, near-black card (design system). The nav
// rail is always visible; the content column is an ephemeral flyout that opens
// on an icon click and (when `autoCollapse`) tucks away the moment the user
// touches the app behind it. Fully controlled: the parent owns `state`.
export function ControlPanel({
  state,
  autoCollapse = true,
  collapsed: collapsedProp,
  onCollapsedChange,
  onTabChange,
  onSend,
  onAiSend,
  onSearch,
  onSettingsChange,
}: ControlPanelProps) {
  // Local search term drives the People filter without leaking into domain state.
  const [query, setQuery] = useState('');
  // Rail-only until an icon is clicked. Controlled when `collapsed` is supplied
  // (the dev lab drives it from a switch); otherwise self-managed, seeded from
  // autoCollapse.
  const [internalCollapsed, setInternalCollapsed] = useState(autoCollapse);
  const collapsed = collapsedProp ?? internalCollapsed;
  const panelRef = useRef<HTMLDivElement>(null);

  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const handleSearch = (term: string) => {
    setQuery(term);
    onSearch?.(term);
  };

  // Click an icon to open/switch; click the active icon again to tuck it away.
  const handleTabClick = (tab: ControlPanelTab) => {
    if (autoCollapse && !collapsed && tab === state.activeTab) {
      setCollapsed(true);
      return;
    }
    onTabChange(tab);
    setCollapsed(false);
  };

  // Any pointer-down outside the panel collapses it — armed only while open, so
  // the rail (inside the ref) never dismisses the gesture that just opened it.
  useEffect(() => {
    if (!autoCollapse || collapsed) return;
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setCollapsed(true);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [autoCollapse, collapsed]);

  const noop = () => {};

  return (
    <div
      ref={panelRef}
      className="absolute m-5 flex h-[600px] flex-row overflow-hidden rounded-none border border-gray-20 bg-background"
    >
      <Sidebar
        activeTab={state.activeTab}
        onTabChange={handleTabClick}
        requestCount={state.requests.length}
        collapsed={collapsed}
      />

      {/* Ephemeral flyout: animate only this column's width. The inner frame is
          frozen at 356px so the content glides behind the rail instead of
          reflowing; the card auto-sizes to follow. */}
      <div
        className={cn(
          'overflow-hidden transition-[width] duration-300 ease-out',
          collapsed ? 'w-0' : 'w-[356px]',
        )}
      >
        <div className="flex h-full w-[356px] flex-col">
          <TopBar
            activeTab={state.activeTab}
            conn={state.conn}
            video={state.video}
            onSearch={handleSearch}
            onStartVideo={noop}
            onEnd={noop}
          />
          <div className="control-panel-scroll relative flex-1 overflow-x-hidden overflow-y-auto">
            <ContentRenderer
              state={state}
              query={query}
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
    </div>
  );
}
