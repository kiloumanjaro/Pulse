'use client';

// Look-only preview of the drAIn control panel rendered with mock data.
// Step 1: mimic the original (light shadcn) look. Tamagui / design-system pass
// comes later. The `control-panel-theme` class scopes the light palette to this
// subtree so the global dark canvas (home page) stays dark.

import { useState } from 'react';
import { ControlPanel } from '@/components/control-panel';
import { AuthProvider } from '@/components/context/AuthProvider';
import { MOCK_REPORTS } from '@/lib/supabase/report';
import type {
  Inlet,
  Outlet,
  Drain,
  Pipe,
  DatasetType,
} from '@/components/control-panel/types';

const INITIAL_OVERLAYS = [
  { id: 'man_pipes-layer', name: 'Pipes', color: '#2563eb', visible: true },
  { id: 'storm_drains-layer', name: 'Storm Drains', color: '#16a34a', visible: true },
  { id: 'inlets-layer', name: 'Inlets', color: '#9333ea', visible: true },
  { id: 'outlets-layer', name: 'Outlets', color: '#ea580c', visible: true },
  { id: 'reports-layer', name: 'Reports', color: '#dc2626', visible: true },
  { id: 'flood_hazard-layer', name: 'Flood Hazard', color: '#0891b2', visible: true },
  { id: 'mandaue_population-layer', name: 'Population', color: '#0288d1', visible: false },
];

const INITIAL_FLOOD_PRONE = [
  { id: 'downstream_south_area', name: 'Downstream South', color: '#DC2626', visible: false },
  { id: 'mc_briones_highway', name: 'Briones Highway', color: '#059669', visible: false },
  { id: 'lh_prime_area', name: 'LH Prime', color: '#0284C7', visible: false },
  { id: 'rolling_hills_area', name: 'Rolling Hills', color: '#EA580C', visible: false },
];

export default function ControlPanelDemoPage() {
  const [activeTab, setActiveTab] = useState('overlays');
  const [dataset, setDataset] = useState<DatasetType>('inlets');
  const [selectedInlet, setSelectedInlet] = useState<Inlet | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedDrain, setSelectedDrain] = useState<Drain | null>(null);
  const [selectedPipe, setSelectedPipe] = useState<Pipe | null>(null);
  const [overlays, setOverlays] = useState(INITIAL_OVERLAYS);
  const [floodProneAreas, setFloodProneAreas] = useState(INITIAL_FLOOD_PRONE);
  const [selectedFloodScenario, setSelectedFloodScenario] = useState('5YR');

  const overlaysVisible = overlays.some((o) => o.visible);

  const clearSelections = () => {
    setSelectedInlet(null);
    setSelectedOutlet(null);
    setSelectedDrain(null);
    setSelectedPipe(null);
  };

  return (
    <AuthProvider>
      {/* `control-panel-theme` scopes the shadcn light palette here only.
          Stand-in for the map background the panel normally floats over. */}
      <main className="control-panel-theme relative h-screen w-full bg-[#e0e0d1]">
        <ControlPanel
          activeTab={activeTab}
          dataset={dataset}
          selectedInlet={selectedInlet}
          selectedOutlet={selectedOutlet}
          selectedDrain={selectedDrain}
          selectedPipe={selectedPipe}
          onTabChange={setActiveTab}
          onDatasetChange={setDataset}
          onSelectInlet={(i) => {
            clearSelections();
            setSelectedInlet(i);
          }}
          onSelectOutlet={(o) => {
            clearSelections();
            setSelectedOutlet(o);
          }}
          onSelectDrain={(d) => {
            clearSelections();
            setSelectedDrain(d);
          }}
          onSelectPipe={(p) => {
            clearSelections();
            setSelectedPipe(p);
          }}
          onBack={() => {
            clearSelections();
            setActiveTab('stats');
          }}
          overlaysVisible={overlaysVisible}
          onToggle={() => {
            const next = !overlaysVisible;
            setOverlays((prev) => prev.map((o) => ({ ...o, visible: next })));
          }}
          overlays={overlays}
          onToggleOverlay={(id) =>
            setOverlays((prev) =>
              prev.map((o) => (o.id === id ? { ...o, visible: !o.visible } : o))
            )
          }
          floodProneAreas={floodProneAreas}
          onToggleFloodProneArea={(id) =>
            setFloodProneAreas((prev) =>
              prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a))
            )
          }
          selectedFloodScenario={selectedFloodScenario}
          onChangeFloodScenario={setSelectedFloodScenario}
          reports={MOCK_REPORTS}
          allReportsData={MOCK_REPORTS}
          onRefreshReports={async () => {}}
          isRefreshingReports={false}
          isFloodScenarioLoading={false}
        />
      </main>
    </AuthProvider>
  );
}
