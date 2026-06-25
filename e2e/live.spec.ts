import { test, expect } from '@playwright/test';
import { expectCollapsed } from './helpers';

// Smoke test for the real /live integration. Geolocation is granted (config) and
// the coordination API is stubbed so the page reaches its "live" state instantly
// and deterministically — no DB or Mapbox tiles needed for the panel to mount.
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
    // Rail appears once geolocation resolves, join() returns, and geo === "live".
    await expect(page.getByRole('button', { name: 'People' })).toBeVisible({
      timeout: 20_000,
    });
  });

  test('rail shows only the wired tabs (people/chat/call)', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'People' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Chat' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Call' })).toBeVisible();

    // ai-chat / requests / settings are hidden until their backends exist.
    await expect(page.getByRole('button', { name: 'AI' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Requests' })).toHaveCount(0);
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
});
