'use client';

// Preview of the (minimal) control panel. `control-panel-theme` scopes the
// dark palette to the panel subtree; the parent owns the active tab.

import { useState } from 'react';
import { ControlPanel } from '@/app/components/control-panel';

export default function ControlPanelDemoPage() {
  const [activeTab, setActiveTab] = useState('overlays');

  return (
    <main className="control-panel-theme relative h-screen w-full bg-[#040406]">
      <ControlPanel
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={() => {}}
      />
    </main>
  );
}
