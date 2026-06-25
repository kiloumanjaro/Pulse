import {
  test,
  expect,
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';

// Two-session Requests-tab handshake. Exercises the real coordination signaling
// (request / accept / decline / cancel) but NOT the WebRTC media path — accept
// only needs to flip both peers into the connecting/chat phase, which happens
// before ICE. That makes this far more reliable than the full media test, but
// it still hits the live DB, so it's gated:
//   RUN_P2P=1 npx playwright test e2e/requests-flow.spec.ts
const BASE = 'http://localhost:3000';
const suite = process.env.RUN_P2P ? test.describe : test.describe.skip;

suite('requests handshake (two real peers)', () => {
  let browser: Browser;
  test.beforeAll(async () => {
    browser = await chromium.launch();
  });
  test.afterAll(async () => {
    await browser?.close();
  });

  let ctxA: BrowserContext;
  let ctxB: BrowserContext;
  let A: Page;
  let B: Page;
  let handleB: string;

  test.beforeEach(async () => {
    test.setTimeout(90_000);
    ctxA = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 40.7128, longitude: -74.006 },
    });
    ctxB = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: { latitude: 40.7138, longitude: -74.007 },
    });
    A = await ctxA.newPage();
    B = await ctxB.newPage();

    const joinB = B.waitForRequest(
      (r) => r.url().includes('/api/join') && r.method() === 'POST',
    );
    await B.goto(`${BASE}/live`);
    const idB = JSON.parse((await joinB).postData() ?? '{}').id as string;
    handleB = `Stranger-${idB.slice(-3).toUpperCase()}`;

    await A.goto(`${BASE}/live`);
    await expect(A.getByRole('button', { name: 'People' })).toBeVisible({ timeout: 25_000 });
    await expect(B.getByRole('button', { name: 'People' })).toBeVisible({ timeout: 25_000 });
  });

  test.afterEach(async () => {
    await ctxA?.close();
    await ctxB?.close();
  });

  // A discovers B in the People list and requests a connection.
  const connect = async () => {
    await A.getByRole('button', { name: 'People' }).click();
    const rowB = A.locator('li', { hasText: handleB });
    await expect(rowB).toBeVisible({ timeout: 15_000 });
    await rowB.getByRole('button', { name: 'Connect' }).click();
  };

  const requestsBadge = (page: Page) =>
    page.getByRole('button', { name: 'Requests' }).locator('span.rounded-full');

  test('outgoing + incoming rows surface in Requests with badges; decline notifies the requester', async () => {
    await connect();

    // Requester: outgoing row auto-surfaced in Requests + rail badge.
    await expect(A.getByText(/requesting/i)).toBeVisible({ timeout: 15_000 });
    await expect(A.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(requestsBadge(A)).toBeVisible();

    // Recipient: incoming row with Accept/Decline + rail badge.
    await expect(B.getByText(/a stranger wants to connect/i)).toBeVisible({ timeout: 15_000 });
    await expect(B.getByRole('button', { name: 'Decline' })).toBeVisible();
    await expect(requestsBadge(B)).toBeVisible();

    // Decline → the requester is told.
    await B.getByRole('button', { name: 'Decline' }).click();
    await expect(A.getByText(/request declined/i)).toBeVisible({ timeout: 15_000 });
  });

  test('cancel clears the outgoing request', async () => {
    await connect();
    await expect(A.getByText(/requesting/i)).toBeVisible({ timeout: 15_000 });
    await expect(requestsBadge(A)).toBeVisible();

    await A.getByRole('button', { name: 'Cancel' }).click();

    // The pending request is gone — badge clears and no outgoing row remains.
    // (Asserted tab-independently: a busy shared DB can surface other state.)
    await expect(requestsBadge(A)).toBeHidden({ timeout: 10_000 });
    await expect(A.getByText(/requesting/i)).toBeHidden();
  });

  test('accept moves both peers from Requests to the chat tab', async () => {
    await connect();
    await expect(B.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 15_000 });

    await B.getByRole('button', { name: 'Accept' }).click();

    // Both leave the handshake for the chat/connection phase (no ICE needed).
    await expect(A.getByText(/connecting/i)).toBeVisible({ timeout: 20_000 });
    await expect(B.getByText(/connecting/i)).toBeVisible({ timeout: 20_000 });
  });
});
