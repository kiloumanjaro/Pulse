'use client';

import { YStack } from 'tamagui';
import { SideNavigation } from './side-navigation';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    // 44px nav rail — canvas filled with the 135° diagonal pencil-hatch (§8),
    // 1px gray-20 divider on the right (§6). The hatch is gray-20 lines at 45%
    // opacity, 8px pitch, layered over the near-black background.
    <YStack
      height="100%"
      width={44}
      alignItems="center"
      justifyContent="space-between"
      borderRightWidth={1}
      borderColor="$gray20"
      backgroundColor="$background"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)',
      }}
      paddingVertical={12}
    >
      <SideNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </YStack>
  );
}
