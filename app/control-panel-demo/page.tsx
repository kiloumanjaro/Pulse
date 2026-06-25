'use client';

// Clean preview of the control panel. `control-panel-theme` scopes the dark
// palette to the panel subtree. For stepping through every state, see
// /control-panel-lab.

import { useState } from 'react';
import { ControlPanel } from '@/app/components/control-panel';
import type {
  ControlPanelState,
  ControlPanelTab,
} from '@/app/components/control-panel/types';
import { DEFAULT_STATE } from '@/app/control-panel-lab/fixtures';

export default function ControlPanelDemoPage() {
  const [state, setState] = useState<ControlPanelState>(DEFAULT_STATE);

  const setTab = (activeTab: ControlPanelTab) =>
    setState((s) => ({ ...s, activeTab }));

  return (
    <main className="control-panel-theme relative h-screen w-full bg-[#040406]">
      <ControlPanel state={state} onTabChange={setTab} />
    </main>
  );
}
