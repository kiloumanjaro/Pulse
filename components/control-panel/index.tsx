'use client';

import type { ControlPanelProps } from './types';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ContentRenderer } from './content-renderer';

// Floating control panel — a square, near-black card (design system):
// a nav rail, a top bar, and a (currently blank) content area per tab.
export function ControlPanel({
  activeTab,
  onTabChange,
  onSearch,
}: ControlPanelProps) {
  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-96 overflow-hidden rounded-none border border-gray-20 bg-background">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeTab={activeTab} onSearch={onSearch} />
        <div className="control-panel-scroll relative flex-1 overflow-auto">
          <ContentRenderer activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
