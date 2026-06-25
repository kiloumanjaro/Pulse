'use client';

// Dev-only state lab. Drives every control-panel state from a side dock so each
// tab + phase can be eyeballed without a second machine. Never linked in nav and
// 404s in production.

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { ControlPanel } from '@/app/components/control-panel';
import type {
  ControlPanelState,
  ControlPanelTab,
  ConnPhase,
  VideoPhase,
  SettingsValues,
} from '@/app/components/control-panel/types';
import { Body, Divider, Eyebrow } from '@/app/components/ds';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import {
  AI_INTRO,
  AI_THREAD,
  DEFAULT_STATE,
  messages as messagesPreset,
  people as peoplePreset,
  requests as requestsPreset,
  type MessagePreset,
  type PeoplePreset,
  type RequestPreset,
} from './fixtures';

const TABS: ControlPanelTab[] = [
  'ai-chat',
  'people',
  'requests',
  'chat',
  'call',
  'settings',
];
const CONN: ConnPhase[] = [
  'idle',
  'requesting',
  'incoming',
  'connecting',
  'connected',
  'ended',
];
const VIDEO: VideoPhase[] = ['none', 'requesting', 'incoming', 'active'];

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

function PresetSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className="h-9 w-full rounded-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function ControlPanelLabPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  const [state, setState] = useState<ControlPanelState>(DEFAULT_STATE);
  const [msgPreset, setMsgPreset] = useState<MessagePreset>('few');
  const [ppl, setPpl] = useState<PeoplePreset>('some');
  const [reqs, setReqs] = useState<RequestPreset>('incoming');
  const [aiThread, setAiThread] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const patch = (p: Partial<ControlPanelState>) =>
    setState((s) => ({ ...s, ...p }));

  const onSettingsChange = (p: Partial<SettingsValues>) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...p } }));

  const onSend = (text: string) =>
    setState((s) => ({
      ...s,
      messages: [...s.messages, { id: s.messages.length + 1, mine: true, text }],
    }));

  const onAiSend = (text: string) =>
    setState((s) => {
      const base = s.aiMessages.length;
      return {
        ...s,
        aiMessages: [
          ...s.aiMessages,
          { id: base + 1, mine: true, text },
          {
            id: base + 2,
            mine: false,
            text: 'This is a stubbed reply — the assistant is UI-only for now.',
          },
        ],
      };
    });

  return (
    <main className="control-panel-theme flex h-screen w-full flex-row bg-[#040406]">
      {/* Control dock */}
      <aside className="control-panel-scroll flex w-72 shrink-0 flex-col gap-4 overflow-auto border-r border-gray-20 bg-gray-5 p-4">
        <div className="flex flex-col gap-1">
          <Body size="sm" tone="bright" className="font-medium text-foreground">
            Control Panel — State Lab
          </Body>
          <Body size="sm" tone="muted" className="text-xs">
            Dev-only. Drives every panel state.
          </Body>
        </div>
        <Divider />

        <Field label="Panel">
          <label className="flex flex-row items-center justify-between text-sm text-gray-80">
            Collapsed
            <Switch checked={collapsed} onCheckedChange={setCollapsed} />
          </label>
        </Field>
        <Divider />

        <Field label="Tab">
          <Radio
            value={state.activeTab}
            options={TABS}
            onChange={(activeTab) => patch({ activeTab })}
          />
        </Field>
        <Divider />

        <Field label="Connection phase (→ Chat)">
          <Radio
            value={state.conn}
            options={CONN}
            onChange={(conn) => patch({ conn, activeTab: 'chat' })}
          />
        </Field>
        <Divider />

        <Field label="Video phase (→ Call)">
          <Radio
            value={state.video}
            options={VIDEO}
            onChange={(video) => patch({ video, activeTab: 'call' })}
          />
        </Field>
        <Divider />

        <Field label="Messages (→ Chat)">
          <PresetSelect
            value={msgPreset}
            options={['empty', 'few', 'many'] as const}
            onChange={(p) => {
              setMsgPreset(p);
              patch({
                messages: messagesPreset(p),
                conn: 'connected',
                activeTab: 'chat',
              });
            }}
          />
        </Field>

        <Field label="AI thread (→ AI)">
          <div className="flex flex-row items-center justify-between">
            <Body size="sm" tone="muted" className="text-xs">
              {aiThread ? 'Sample thread' : 'Intro / empty'}
            </Body>
            <Switch
              checked={aiThread}
              onCheckedChange={(v) => {
                setAiThread(v);
                patch({
                  aiMessages: v ? AI_THREAD : AI_INTRO,
                  activeTab: 'ai-chat',
                });
              }}
            />
          </div>
        </Field>
        <Divider />

        <Field label="People (→ People)">
          <PresetSelect
            value={ppl}
            options={['empty', 'some', 'busy'] as const}
            onChange={(p) => {
              setPpl(p);
              patch({ people: peoplePreset(p), activeTab: 'people' });
            }}
          />
        </Field>

        <Field label="Requests (→ Requests)">
          <PresetSelect
            value={reqs}
            options={['none', 'incoming', 'outgoing', 'declined'] as const}
            onChange={(p) => {
              setReqs(p);
              patch({ requests: requestsPreset(p), activeTab: 'requests' });
            }}
          />
        </Field>
        <Divider />

        <Field label="Settings">
          <div className="flex flex-col gap-2">
            {(
              [
                ['soundOnRequest', 'Sound on request'],
                ['allowVideo', 'Allow video'],
                ['appearOnMap', 'Appear on map'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex flex-row items-center justify-between text-sm text-gray-80"
              >
                {label}
                <Switch
                  checked={state.settings[key]}
                  onCheckedChange={(v) => onSettingsChange({ [key]: v })}
                />
              </label>
            ))}
          </div>
        </Field>
      </aside>

      {/* Panel stage */}
      <div className="relative flex-1">
        <ControlPanel
          state={state}
          autoCollapse={false}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onTabChange={(activeTab) => patch({ activeTab })}
          onSend={onSend}
          onAiSend={onAiSend}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </main>
  );
}
