'use client';

import { Notification } from 'iconsax-reactjs';
import { Body, Button } from '@/app/components/ds';
import { Spinner } from '@/app/components/ui/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/components/ui/empty';
import type { ConnectionRequest } from '../types';

interface RequestsTabProps {
  requests: ConnectionRequest[];
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

// Pending connection requests — the home for the accept/decline loop.
export function RequestsTab({
  requests,
  onAccept,
  onDecline,
  onCancel,
  onDismiss,
}: RequestsTabProps) {
  if (requests.length === 0) {
    return (
      <Empty className="min-h-full justify-center border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-gray-12 rounded-none">
            <Notification size={22} variant="Bold" color="currentColor" />
          </EmptyMedia>
          <EmptyTitle>No pending requests</EmptyTitle>
          <EmptyDescription>
            <Body size="sm" tone="muted">
              Connection requests appear here. Accept one to open a chat.
            </Body>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col">
      {requests.map((r) => (
        <li
          key={r.id}
          className="flex flex-col gap-3 px-4 py-3"
        >
          {r.direction === 'incoming' && (
            <>
              <div className="flex flex-col">
                <span className="font-sans text-sm font-medium text-foreground">
                  A stranger wants to connect
                </span>
                <Body size="sm" tone="muted" className="text-xs">
                  {r.handle} · ~{r.distanceKm} km away
                </Body>
              </div>
              {/* -mr-3.5 offsets the 14px scrollbar-gutter so the Accept
                  button's right edge aligns with the panel's right inset. */}
              <div className="-mr-3.5 flex flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  full
                  className="h-8 flex-1 text-xs"
                  onClick={() => onDecline?.(r.id)}
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  full
                  className="h-8 flex-1 text-xs"
                  onClick={() => onAccept?.(r.id)}
                >
                  Accept
                </Button>
              </div>
            </>
          )}

          {r.direction === 'outgoing' && (
            <div className="flex flex-row items-center gap-3">
              <Spinner className="text-gray-50" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-sans text-sm font-medium text-foreground">
                  Requesting…
                </span>
                <Body size="sm" tone="muted" className="text-xs">
                  {r.handle} · ~{r.distanceKm} km away
                </Body>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onCancel?.(r.id)}
              >
                Cancel
              </Button>
            </div>
          )}

          {r.direction === 'declined' && (
            <div className="flex flex-row items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col">
                <Body size="sm" tone="muted">
                  Request declined
                </Body>
                <Body size="sm" tone="muted" className="text-xs">
                  {r.handle}
                </Body>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onDismiss?.(r.id)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
