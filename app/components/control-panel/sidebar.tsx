'use client';

import { SideNavigation } from './side-navigation';
import type { ControlPanelTab } from './types';

interface SidebarProps {
  activeTab: ControlPanelTab;
  onTabChange: (tab: ControlPanelTab) => void;
  requestCount?: number;
}

export function Sidebar({ activeTab, onTabChange, requestCount }: SidebarProps) {
  return (
    // 58px nav rail (matches the top bar's height) — flat gray-8 (#121317)
    // canvas, 1px gray-20 divider on the right (§6).
    <div className="flex h-full w-[58px] flex-col items-center justify-between border-r border-gray-20 bg-gray-8 py-3">
      <SideNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        requestCount={requestCount}
      />
    </div>
  );
}
