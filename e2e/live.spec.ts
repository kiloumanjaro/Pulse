import { test, expect } from '@playwright/test';
import { expectCollapsed } from './helpers';

// Smoke test for the real /live integration. Geolocation is granted (config) and
// the coordination API is stubbed so the page reaches its "live" state instantly
// and deterministically — no DB or Mapbox tiles needed for the panel to mount.
// Peer-signaling flows (requests handshake) need two sessions — see
// requests-flow.spec.ts / two-peer.spec.ts.
test.describe('/live — control panel integration', () => {
  test.beforeEach(async ({ page }) => {
    const json = (body: unknown) => ({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
    await page.route('**/api/join', (r) => r.fulfill(json({})));
    await page.route('**/api/poll**', (r) => r.fulfill(json({ peers: [], signals: [] })));
    await page.route('**/api/signal', (r) => r.fulfill(json({})));
    await page.route('**/api/leave', (r) => r.fulfill(json({})));

    await page.goto('/live');
    await expect(page.getByRole('button', { name: 'People' })).toBeVisible({
      timeout: 20_000,
    });
  });

  test('rail shows the wired tabs (ai/people/requests/chat/call); settings hidden', async ({
    page,
  }) => {
    for (const name of ['AI', 'People', 'Requests', 'Chat', 'Call']) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }
    // settings has no backend yet, so it stays off the rail.
    await expect(page.getByRole('button', { name: 'Settings' })).toHaveCount(0);
  });

  test('flyout opens on icon click and collapses on map interaction', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'People' }).click();
    // No peers nearby (poll returns none), so the empty state shows.
    await expect(page.getByText(/no one nearby/i)).toBeVisible();

    // Interacting with the app behind the panel tucks it back to the rail.
    const size = page.viewportSize()!;
    await page.mouse.click(size.width - 30, size.height - 30);
    await expectCollapsed(page);
  });

  test('AI tab returns the canned stub reply', async ({ page }) => {
    await page.getByRole('button', { name: 'AI' }).click();
    await expect(page.getByText(/ask pulse anything/i)).toBeVisible();

    const composer = page.getByPlaceholder('Type a message');
    await composer.fill('how does pulse work?');
    await page.getByRole('button', { name: 'Send' }).click();

    // The user's line plus the fixed UI-only reply (no backend).
    await expect(page.getByText('how does pulse work?')).toBeVisible();
    await expect(
      page.getByText(/stubbed reply — the assistant is UI-only/i),
    ).toBeVisible();
  });
});
