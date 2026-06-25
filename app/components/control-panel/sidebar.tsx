'use client';

import { cn } from '@/lib/utils';
import { SideNavigation } from './side-navigation';
import type { ControlPanelTab } from './types';

interface SidebarProps {
  activeTab: ControlPanelTab;
  onTabChange: (tab: ControlPanelTab) => void;
  requestCount?: number;
  collapsed?: boolean;
  tabs?: ControlPanelTab[];
}

export function Sidebar({
  activeTab,
  onTabChange,
  requestCount,
  collapsed,
  tabs,
}: SidebarProps) {
  return (
    // 58px nav rail (matches the top bar's height) — flat gray-8 (#121317)
    // canvas, 1px gray-20 divider on the right (§6). Collapsed, the rail is the
    // whole card, so drop the divider to avoid doubling the card's own border.
    <div
      className={cn(
        'flex h-full w-[58px] flex-col items-center justify-between bg-gray-8 py-3',
        !collapsed && 'border-r border-gray-20',
      )}
    >
      <SideNavigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        requestCount={requestCount}
        tabs={tabs}
      />
    </div>
  );
}
