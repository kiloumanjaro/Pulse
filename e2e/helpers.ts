import { expect, type Page } from '@playwright/test';

// The flyout is the animated-width column of the ControlPanel. Collapsed it is
// 0px wide (overflow-hidden clips the 356px inner frame), open it is ~356px.
// Asserting on its measured width is robust where toBeHidden() is not — clipped
// content keeps a non-empty layout box, so Playwright still reports it visible.
const flyout = (page: Page) => page.locator('.transition-\\[width\\]').first();

async function flyoutWidth(page: Page): Promise<number> {
  const box = await flyout(page).boundingBox();
  return box?.width ?? 0;
}

export async function expectCollapsed(page: Page): Promise<void> {
  await expect.poll(() => flyoutWidth(page)).toBeLessThan(2);
}

export async function expectExpanded(page: Page): Promise<void> {
  await expect.poll(() => flyoutWidth(page)).toBeGreaterThan(100);
}
