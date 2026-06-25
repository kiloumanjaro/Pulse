'use client';

import {
  MagicStar,
  People,
  Notification,
  Messages,
  Video,
  Setting2,
  type IconProps,
} from 'iconsax-reactjs';
import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import type { ControlPanelTab } from './types';

interface SideNavigationProps {
  activeTab: ControlPanelTab;
  onTabChange: (tab: ControlPanelTab) => void;
  requestCount?: number;
  // Which tabs to render. Defaults to all six.
  tabs?: ControlPanelTab[];
}

interface Tab {
  id: ControlPanelTab;
  label: string;
  icon: ComponentType<IconProps>;
}

// AI assistant is pinned to the top; the rest follow the session journey.
const AI_TAB: Tab = { id: 'ai-chat', label: 'AI', icon: MagicStar };
const TABS: Tab[] = [
  { id: 'people', label: 'People', icon: People },
  { id: 'requests', label: 'Requests', icon: Notification },
  { id: 'chat', label: 'Chat', icon: Messages },
  { id: 'call', label: 'Call', icon: Video },
  { id: 'settings', label: 'Settings', icon: Setting2 },
];

export function SideNavigation({
  activeTab,
  onTabChange,
  requestCount = 0,
  tabs,
}: SideNavigationProps) {
  const showAi = !tabs || tabs.includes(AI_TAB.id);
  const bottomTabs = tabs ? TABS.filter((t) => tabs.includes(t.id)) : TABS;
  const renderTab = (tab: Tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    // Linear when idle, Bold when active — a fill-on-active affordance while the
    // currentColor still drives white (active) vs gray-40 (idle).
    const variant: 'Bold' | 'Linear' = isActive ? 'Bold' : 'Linear';
    const showBadge = tab.id === 'requests' && requestCount > 0;

    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        aria-label={tab.label}
        title={tab.label}
        className={cn(
          'relative flex w-full cursor-pointer items-center justify-center transition-colors duration-200 hover:text-foreground',
          isActive ? 'text-foreground' : 'text-gray-40',
        )}
      >
        <span className="relative">
          <Icon size={20} variant={variant} color="currentColor" />
          {showBadge && (
            <span className="absolute -top-0.5 -right-1 h-[5px] w-[5px] rounded-full bg-foreground" />
          )}
        </span>

        {isActive && <span className="absolute right-0 h-9 w-0.5 bg-foreground" />}
      </button>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center pt-1.5">
      {/* AI assistant pinned to the top */}
      {showAi && (
        <div className="flex w-full flex-col items-center">{renderTab(AI_TAB)}</div>
      )}

      {/* Spacer pushes the rest to the bottom */}
      <div className="flex-1" />

      <div className="flex w-full flex-col items-center gap-5">
        {bottomTabs.map((tab) => renderTab(tab))}
      </div>
    </div>
  );
}
