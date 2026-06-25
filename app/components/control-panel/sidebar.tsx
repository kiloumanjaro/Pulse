'use client';

import { SideNavigation } from './side-navigation';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    // 44px nav rail — flat gray-8 (#121317) canvas, 1px gray-20 divider on the
    // right (§6).
    <div className="flex flex-col h-full w-11 items-center justify-between border-r border-gray-20 bg-gray-8 py-3">
      <SideNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
