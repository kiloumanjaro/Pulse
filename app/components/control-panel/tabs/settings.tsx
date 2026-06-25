'use client';

import { useState } from 'react';
import { ShieldSecurity } from 'iconsax-reactjs';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Body } from '@/app/components/ds';
import { Switch } from '@/app/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command';
import type { SettingsValues } from '../types';

interface SettingsTabProps {
  values: SettingsValues;
  onChange?: (patch: Partial<SettingsValues>) => void;
}

type Option = { id: string; label: string };

// Static device lists — real device enumeration is wired later.
const CAMERAS: Option[] = [
  { id: 'cam-default', label: 'Default camera' },
  { id: 'cam-front', label: 'Front camera' },
];
const MICS: Option[] = [
  { id: 'mic-default', label: 'Default microphone' },
  { id: 'mic-headset', label: 'Headset microphone' },
];
const SPEAKERS: Option[] = [
  { id: 'spk-default', label: 'Default speakers' },
  { id: 'spk-headset', label: 'Headset' },
];

function Section({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {label && (
        <Body size="sm" tone="muted" className="text-xs">
          {label}
        </Body>
      )}
      {children}
    </div>
  );
}

// Square shadcn combobox (Popover + Command) styled to match the ds Input.
function DeviceCombobox({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <div className="flex flex-col gap-1.5">
      <Body size="sm" tone="muted" className="text-xs">
        {label}
      </Body>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-none border border-gray-20 bg-gray-8 px-3',
            'font-sans text-sm text-foreground outline-none focus:border-gray-50',
          )}
        >
          <span className={cn('truncate', !selected && 'text-gray-50')}>
            {selected?.label ?? 'Select…'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] rounded-none border-gray-20 bg-gray-8 p-0 text-foreground"
        >
          <Command className="rounded-none bg-transparent text-foreground">
            <CommandList>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.id}
                    value={o.label}
                    className="rounded-none data-[selected=true]:bg-gray-12 data-[selected=true]:text-foreground"
                    onSelect={() => {
                      onValueChange(o.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === o.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="font-sans text-sm text-foreground">{label}</span>
        {hint && (
          <Body size="sm" tone="muted" className="text-xs">
            {hint}
          </Body>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function SettingsTab({
  values,
  onChange,
}: SettingsTabProps) {
  return (
    <div className="flex flex-col">
      <Section>
        <DeviceCombobox
          label="Camera"
          value={values.cameraId}
          options={CAMERAS}
          onValueChange={(v) => onChange?.({ cameraId: v })}
        />
        <DeviceCombobox
          label="Microphone"
          value={values.micId}
          options={MICS}
          onValueChange={(v) => onChange?.({ micId: v })}
        />
        <DeviceCombobox
          label="Speakers"
          value={values.speakerId}
          options={SPEAKERS}
          onValueChange={(v) => onChange?.({ speakerId: v })}
        />
      </Section>

      <Section label="Calls">
        <ToggleRow
          label="Allow video escalation"
          hint="Let a connected stranger ask to start a call."
          checked={values.allowVideo}
          onCheckedChange={(v) => onChange?.({ allowVideo: v })}
        />
      </Section>

      <Section label="Notifications">
        <ToggleRow
          label="Sound on incoming request"
          checked={values.soundOnRequest}
          onCheckedChange={(v) => onChange?.({ soundOnRequest: v })}
        />
      </Section>

      <Section label="Privacy">
        <div className="flex flex-row items-start gap-3">
          <ShieldSecurity
            size={18}
            variant="Bold"
            color="currentColor"
            className="mt-0.5 shrink-0 text-gray-50"
          />
          <Body size="sm" tone="muted" className="text-xs">
            Your dot is randomized 1–3 km from your real location, and re-rolled
            every session. Exact coordinates are never stored.
          </Body>
        </div>
      </Section>
    </div>
  );
}
