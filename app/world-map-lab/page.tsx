'use client';

// Dev-only state lab for the world map. Drives the real WorldMap (+ KineticGrid
// backdrop and the live connection overlays) through every dot scenario from a
// side dock — alone, a crowd, busy dots, a click, an incoming request, and two
// people connected — without a second machine or WebRTC. 404s in production.

import { notFound } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import WorldMap from '@/app/components/WorldMap';
import KineticGrid, { type GlowSource } from '@/app/components/KineticGrid';
import ConnectionPrompt from '@/app/components/ConnectionPrompt';
import ChatPanel, { type ChatMessage } from '@/app/components/ChatPanel';
import { Body, Button, Divider, Eyebrow } from '@/app/components/ds';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Switch } from '@/app/components/ui/switch';
import { useBrandColor } from '@/lib/useBrandColor';
import type { PeerDot } from '@/lib/types';
import { CROWD_COUNT, ME, PARTNER, peers, type CrowdPreset } from './fixtures';

const CROWDS: CrowdPreset[] = ['alone', 'few', 'some', 'many', 'crowded'];

type Sim =
  | { kind: 'idle' }
  | { kind: 'requesting'; peerId: string }
  | { kind: 'incoming'; peerId: string }
  | { kind: 'connected'; peerId: string };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow>{label}</Eyebrow>
      {children}
    </div>
  );
}

function Radio<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as T)}
      className="grid-cols-2 gap-1.5"
    >
      {options.map((o) => (
        <label
          key={o}
          className="flex cursor-pointer flex-row items-center gap-2 text-sm text-gray-80"
        >
          <RadioGroupItem value={o} />
          {o}
        </label>
      ))}
    </RadioGroup>
  );
}

export default function WorldMapLabPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  const [crowd, setCrowd] = useState<CrowdPreset>('some');
  const [busyMix, setBusyMix] = useState(false);
  const [showMe, setShowMe] = useState(true);
  const [sim, setSim] = useState<Sim>({ kind: 'idle' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const glowRef = useRef<GlowSource | null>(null);
  const brandColor = useBrandColor();

  const basePeers = useMemo(
    () => peers(crowd, busyMix ? 0.4 : 0),
    [crowd, busyMix],
  );

  // Final dot list: inject the synthetic partner when a sim targets it, and dim
  // (busy) the partner once connected — exactly how a live partner reads.
  const displayPeers = useMemo<PeerDot[]>(() => {
    const partnerId = sim.kind === 'idle' ? null : sim.peerId;
    let list = basePeers;
    if (partnerId === PARTNER.id && !list.some((p) => p.id === PARTNER.id)) {
      list = [PARTNER, ...list];
    }
    if (sim.kind === 'connected') {
      list = list.map((p) =>
        p.id === partnerId ? { ...p, busy: true } : p,
      );
    }
    return list;
  }, [basePeers, sim]);

  const connect = (peerId: string) => {
    setSim({ kind: 'connected', peerId });
    setMessages([{ id: 1, mine: false, text: 'Hey there 👋' }]);
  };

  const reset = () => {
    setSim({ kind: 'idle' });
    setMessages([]);
  };

  const inChat = sim.kind === 'connected';

  return (
    <main className="control-panel-theme flex h-screen w-full flex-row bg-[#040406]">
      {/* Control dock */}
      <aside className="control-panel-scroll flex w-72 shrink-0 flex-col gap-4 overflow-auto border-r border-gray-20 bg-gray-5 p-4">
        <div className="flex flex-col gap-1">
          <Body size="sm" tone="bright" className="font-medium text-foreground">
            World Map — State Lab
          </Body>
          <Body size="sm" tone="muted" className="text-xs">
            Dev-only. Drives the map, dots & connection flow.
          </Body>
        </div>
        <Divider />

        <Field label="Crowd">
          <Radio
            value={crowd}
            options={CROWDS}
            onChange={(c) => {
              setCrowd(c);
              reset();
            }}
          />
          <Body size="sm" tone="muted" className="text-xs">
            {CROWD_COUNT[crowd]} other dot
            {CROWD_COUNT[crowd] === 1 ? '' : 's'}
          </Body>
        </Field>

        <label className="flex flex-row items-center justify-between text-sm text-gray-80">
          Some busy (dimmed)
          <Switch checked={busyMix} onCheckedChange={setBusyMix} />
        </label>

        <label className="flex flex-row items-center justify-between text-sm text-gray-80">
          Show my pin
          <Switch checked={showMe} onCheckedChange={setShowMe} />
        </label>
        <Divider />

        <Field label="Connection">
          <Body size="sm" tone="muted" className="text-xs">
            {sim.kind === 'idle'
              ? 'Click any dot to request, or simulate one below.'
              : `Phase: ${sim.kind}`}
          </Body>
          <div className="flex flex-col gap-2">
            {sim.kind === 'idle' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setSim({ kind: 'requesting', peerId: PARTNER.id })}
                >
                  Simulate outgoing request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSim({ kind: 'incoming', peerId: PARTNER.id })}
                >
                  Simulate incoming request
                </Button>
              </>
            )}
            {sim.kind === 'requesting' && (
              <>
                <Button variant="primary" onClick={() => connect(sim.peerId)}>
                  Peer accepts → connect
                </Button>
                <Button variant="outline" onClick={reset}>
                  Cancel
                </Button>
              </>
            )}
            {sim.kind === 'incoming' && (
              <Body size="sm" tone="muted" className="text-xs">
                Use the on-map prompt to accept or decline.
              </Body>
            )}
            {sim.kind === 'connected' && (
              <Button variant="outline" onClick={reset}>
                End connection
              </Button>
            )}
          </div>
        </Field>
        <Divider />

        <Field label="Legend">
          <div className="flex flex-col gap-1.5 text-xs text-gray-80">
            <span>📍 Me — your offset pin</span>
            <span>● Pulsing dot — a stranger you can tap</span>
            <span>● Faint dot — busy (mid-connection)</span>
          </div>
        </Field>
      </aside>

      {/* Map stage */}
      <div className="relative flex-1 overflow-hidden bg-background">
        <KineticGrid
          hoverColor={brandColor}
          glowSourceRef={glowRef}
          glowStrength={2.2}
          glowFalloff={4}
          glowRadiusScale={2.5}
          glowWarp
          glowWarpStrength={3.5}
        />

        <WorldMap
          // Remount on pin toggle so the globe rebuilds with/without the pin and
          // recenters appropriately (WorldMap reads `me` only at init).
          key={showMe ? 'with-me' : 'no-me'}
          peers={displayPeers}
          me={showMe ? ME : null}
          onPeerClick={(id) => {
            if (sim.kind === 'idle') setSim({ kind: 'requesting', peerId: id });
          }}
          canConnect={sim.kind === 'idle'}
          onView={(g) => {
            glowRef.current = g;
          }}
        />

        {sim.kind === 'requesting' && (
          <div
            className="absolute left-1/2 top-20 z-30 flex flex-row items-center gap-3 border border-gray-20 bg-gray-8 px-4 py-2"
            style={{ transform: 'translateX(-50%)', backdropFilter: 'blur(8px)' }}
          >
            <Body size="sm" className="text-foreground">
              Requesting connection…
            </Body>
            <Button variant="outline" onClick={reset} className="h-[30px] px-3">
              Cancel
            </Button>
          </div>
        )}

        {sim.kind === 'incoming' && (
          <ConnectionPrompt
            title="A stranger wants to connect"
            acceptLabel="Accept"
            declineLabel="Decline"
            onAccept={() => connect(sim.peerId)}
            onDecline={reset}
          />
        )}

        {inChat && (
          <ChatPanel
            messages={messages}
            connected
            videoBusy={false}
            onSend={(text) =>
              setMessages((m) => [
                ...m,
                { id: m.length + 1, mine: true, text },
              ])
            }
            onStartVideo={() => {}}
            onEnd={reset}
          />
        )}
      </div>
    </main>
  );
}
