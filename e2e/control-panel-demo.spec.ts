import { test, expect } from '@playwright/test';
import { expectCollapsed, expectExpanded } from './helpers';

// The demo page mounts ControlPanel with its defaults: starts collapsed
// (rail only), opens on an icon click, and dismisses on outside interaction.
test.describe('control panel — flyout behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/control-panel-demo');
    // The rail (and its tab icons) is always present.
    await expect(page.getByRole('button', { name: 'People' })).toBeVisible();
  });

  test('starts collapsed, opens to a tab on icon click', async ({ page }) => {
    await expectCollapsed(page);

    await page.getByRole('button', { name: 'People' }).click();

    await expectExpanded(page);
    // Flyout open: the People list (DEFAULT_STATE seeds several strangers) shows.
    await expect(page.getByRole('button', { name: 'Connect' }).first()).toBeVisible();
  });

  test('outside interaction collapses it again', async ({ page }) => {
    await page.getByRole('button', { name: 'People' }).click();
    await expectExpanded(page);

    // Click the map/background, well clear of the top-left panel.
    const size = page.viewportSize()!;
    await page.mouse.click(size.width - 20, size.height - 20);

    await expectCollapsed(page);
  });

  test('switches between tabs', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat' }).click();
    // Idle chat tab prompts the user to tap a dot.
    await expect(page.getByText(/tap a dot on the map/i)).toBeVisible();

    await page.getByRole('button', { name: 'People' }).click();
    await expect(page.getByRole('button', { name: 'Connect' }).first()).toBeVisible();
  });
});
