'use client';

import { People } from 'iconsax-reactjs';
import { cn } from '@/lib/utils';
import { Body, Button } from '@/app/components/ds';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/components/ui/empty';
import type { Stranger } from '../types';

interface PeopleTabProps {
  people: Stranger[];
  query?: string;
  onConnect?: (id: string) => void;
}

function initials(handle: string) {
  // "Stranger-7QF" → "7Q"; fall back to the first two chars.
  const tail = handle.split('-')[1] ?? handle;
  return tail.slice(0, 2).toUpperCase();
}

// Nearby anonymous strangers — a non-map way to browse who's online.
export function PeopleTab({ people, query, onConnect }: PeopleTabProps) {
  const term = (query ?? '').trim().toLowerCase();
  const rows = term
    ? people.filter((p) => p.handle.toLowerCase().includes(term))
    : people;

  if (rows.length === 0) {
    return (
      <Empty className="min-h-full justify-center border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-gray-12 rounded-none">
            <People size={22} variant="Bold" color="currentColor" />
          </EmptyMedia>
          <EmptyTitle>{term ? 'No matches' : 'No one nearby'}</EmptyTitle>
          <EmptyDescription>
            <Body size="sm" tone="muted">
              {term
                ? 'No online strangers match that search.'
                : "You're the only Pulse in this area right now."}
            </Body>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col">
      {rows.map((p) => (
        <li
          key={p.id}
          className={cn(
            'flex flex-row items-center gap-3 px-4 py-3',
            p.busy && 'opacity-50',
          )}
        >
          <Avatar className="h-9 w-9 rounded-none border border-gray-20">
            <AvatarFallback className="rounded-none bg-gray-8 font-mono text-xs text-gray-70">
              {initials(p.handle)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-sans text-sm font-medium text-foreground">
              {p.handle}
            </span>
            <Body size="sm" tone="muted" className="text-xs">
              {p.busy ? 'In a chat' : `~${p.distanceKm} km away`}
            </Body>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={p.busy}
            hatchDisabled
            // -mr-3.5 offsets the 14px scrollbar-gutter so the button's right
            // edge lines up with the search bar (which sits outside the gutter).
            className="-mr-3.5 h-8 px-4 text-xs"
            onClick={() => onConnect?.(p.id)}
          >
            Connect
          </Button>
        </li>
      ))}
    </ul>
  );
}
