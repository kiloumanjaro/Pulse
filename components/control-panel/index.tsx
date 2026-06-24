'use client';

import { XStack, YStack } from 'tamagui';
import type { ControlPanelProps } from './types';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ContentRenderer } from './content-renderer';

// Floating control panel — a square, near-black card (Unkey design system):
// a nav rail, a top bar, and a (currently blank) content area per tab.
export function ControlPanel({
  activeTab,
  onTabChange,
  onSearch,
}: ControlPanelProps) {
  return (
    <XStack
      position="absolute"
      margin={20}
      height={600}
      width={384}
      overflow="hidden"
      borderRadius={0}
      borderWidth={1}
      borderColor="$gray20"
      backgroundColor="$background"
    >
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      <YStack flex={1} overflow="hidden">
        <TopBar activeTab={activeTab} onSearch={onSearch} />
        <div className="control-panel-scroll relative flex-1 overflow-auto">
          <ContentRenderer activeTab={activeTab} />
        </div>
      </YStack>
    </XStack>
  );
}
