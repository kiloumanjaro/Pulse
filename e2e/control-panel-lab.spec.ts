import { test, expect, type Page } from '@playwright/test';
import { expectCollapsed, expectExpanded } from './helpers';

// The lab drives every panel state from a side dock, so it can exercise the
// wired chat/call/people tabs without a peer, a backend, or WebRTC. It mounts
// expanded (autoCollapse off) with controlled collapse.

// Dock fields share the same class; scope radio clicks by the field's heading
// so ambiguous values ("incoming" lives in both conn and video) are unambiguous.
const field = (page: Page, heading: string) =>
  page.locator('div.flex.flex-col.gap-2').filter({ hasText: heading });

test.beforeEach(async ({ page }) => {
  await page.goto('/control-panel-lab');
  await expect(page.getByRole('button', { name: 'Chat' })).toBeVisible();
});

test('chat tab renders and the composer sends a message', async ({ page }) => {
  await field(page, 'Connection phase').getByText('connected', { exact: true }).click();

  const composer = page.getByPlaceholder('Type a message');
  await expect(composer).toBeEnabled();
  await composer.fill('hello from playwright');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByText('hello from playwright')).toBeVisible();
});

test('call tab renders a real video surface with call controls', async ({ page }) => {
  await field(page, 'Video phase').getByText('active', { exact: true }).click();

  // The embedded VideoPanel mounts real <video> elements (remote + local PiP).
  await expect(page.locator('video').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'End call' })).toBeVisible();
  await expect(page.getByRole('button', { name: /mute/i })).toBeVisible();
});

test('incoming connection shows the accept/decline prompt', async ({ page }) => {
  await field(page, 'Connection phase').getByText('incoming', { exact: true }).click();

  await expect(page.getByText(/stranger wants to connect/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Decline' })).toBeVisible();
});

test('people tab lists strangers with a connect action', async ({ page }) => {
  await page.getByRole('button', { name: 'People' }).click();
  await expect(page.getByRole('button', { name: 'Connect' }).first()).toBeVisible();
});

test('the collapse toggle hides and reveals the flyout', async ({ page }) => {
  await page.getByRole('button', { name: 'People' }).click();
  await expectExpanded(page);

  const collapse = page.locator('label', { hasText: 'Collapsed' }).getByRole('switch');
  await collapse.click();
  await expectCollapsed(page);

  await collapse.click();
  await expectExpanded(page);
});
