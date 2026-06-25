import type { PeerDot } from '@/lib/types';

// A fixed "you are here" anchor so the globe opens centered on the same spot
// every reload and the synthetic partner always lands a short hop away.
export const ME = { lat: 40.73, lng: -73.99 }; // New York-ish

export type CrowdPreset = 'alone' | 'few' | 'some' | 'many' | 'crowded';

export const CROWD_COUNT: Record<CrowdPreset, number> = {
  alone: 0,
  few: 3,
  some: 8,
  many: 25,
  crowded: 80,
};

// Deterministic pseudo-random so a given index always lands in the same place:
// stable ids keep dot colors fixed and stop markers churning between renders.
function rand(seed: number): number {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

export function peers(preset: CrowdPreset, busyRatio = 0): PeerDot[] {
  const n = CROWD_COUNT[preset];
  return Array.from({ length: n }, (_, i) => {
    const lng = -170 + rand(i + 1) * 340;
    const lat = -55 + rand(i + 7) * 125;
    return {
      id: `lab-peer-${i}`,
      lat: Math.round(lat * 100) / 100,
      lng: Math.round(lng * 100) / 100,
      busy: busyRatio > 0 && rand(i + 13) < busyRatio,
    };
  });
}

// A stand-in stranger parked next to ME, used to demo the request → connect
// flow (click a real dot to use that one instead).
export const PARTNER: PeerDot = {
  id: 'lab-partner',
  lat: ME.lat + 1.4,
  lng: ME.lng + 2.1,
  busy: false,
};
