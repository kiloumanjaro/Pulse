import { test, expect, chromium } from '@playwright/test';

// REAL two-peer flow — no stubs. Two isolated browser contexts (each its own
// geolocation), fake media devices for getUserMedia, and the real coordination
// API + WebRTC. Verifies the actual peer-to-peer path the manual flow in
// docs/testing.md targets: connect → bidirectional chat → video.
//
// Prerequisites (same as the manual flow): a reachable DB (so /api/poll lists
// peers) and a valid NEXT_PUBLIC_MAPBOX_TOKEN. Run explicitly:
//   npx playwright test e2e/two-peer.spec.ts
const BASE = 'http://localhost:3000';

test('two real peers connect, chat both ways, and start video', async () => {
  // Gated: needs an ICE path that actually connects. The app ships STUN-only
  // (no TURN), so on symmetric-NAT / firewalled networks the connectivity
  // checks fail even though signaling + SDP negotiation succeed — observed on
  // this machine (ICE checking → failed). Run on a capable network with:
  //   RUN_P2P=1 npx playwright test e2e/two-peer.spec.ts
  test.skip(!process.env.RUN_P2P, 'Set RUN_P2P=1 to run the real-peer WebRTC flow (needs a connectable ICE path).');
  test.setTimeout(150_000);

  const browser = await chromium.launch({
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      // Headless Chrome hides host IPs behind mDNS .local candidates, which
      // don't resolve in automation → loopback ICE never connects. Expose raw
      // host candidates, and allow loopback (127.0.0.1) candidates so two
      // contexts on the same machine pair without crossing NAT/firewall (the
      // app ships STUN-only, no TURN).
      '--disable-features=WebRtcHideLocalIpsWithMdns',
      '--allow-loopback-in-peer-connection',
    ],
  });

  const mkContext = (latitude: number, longitude: number) =>
    browser.newContext({
      permissions: ['geolocation', 'camera', 'microphone'],
      geolocation: { latitude, longitude },
    });

  const ctxA = await mkContext(40.7128, -74.006);
  const ctxB = await mkContext(40.7138, -74.007);

  // Log RTCPeerConnection state transitions so we can see where the handshake
  // stalls (ice/connection/signaling/gathering).
  const probe = `(() => {
    const Orig = window.RTCPeerConnection;
    if (!Orig) return;
    const Wrapped = function (cfg) {
      const pc = new Orig(cfg);
      pc.addEventListener('iceconnectionstatechange', () => console.log('RTC ice=' + pc.iceConnectionState));
      pc.addEventListener('connectionstatechange', () => console.log('RTC conn=' + pc.connectionState));
      pc.addEventListener('signalingstatechange', () => console.log('RTC sig=' + pc.signalingState));
      pc.addEventListener('icegatheringstatechange', () => console.log('RTC gather=' + pc.iceGatheringState));
      pc.addEventListener('icecandidate', (e) => { if (e.candidate) console.log('RTC cand ' + (e.candidate.candidate || '').split(' ').slice(0,5).join(' ')); });
      pc.addEventListener('icecandidateerror', (e) => console.log('RTC iceerr ' + e.errorCode + ' ' + e.url));
      return pc;
    };
    Wrapped.prototype = Orig.prototype;
    window.RTCPeerConnection = Wrapped;
  })();`;
  await ctxA.addInitScript(probe);
  await ctxB.addInitScript(probe);

  const A = await ctxA.newPage();
  const B = await ctxB.newPage();

  A.on('console', (m) => console.log('[A]', m.text()));
  B.on('console', (m) => console.log('[B]', m.text()));
  A.on('pageerror', (e) => console.log('[A pageerror]', e.message));
  B.on('pageerror', (e) => console.log('[B pageerror]', e.message));

  try {
    // B joins first; capture its session id from the join request to find its
    // row in A's People list (handle is derived from the id).
    const joinB = B.waitForRequest(
      (r) => r.url().includes('/api/join') && r.method() === 'POST',
    );
    await B.goto(`${BASE}/live`);
    const idB = JSON.parse((await joinB).postData() ?? '{}').id as string;
    const handleB = `Stranger-${idB.slice(-3).toUpperCase()}`;

    await A.goto(`${BASE}/live`);

    // Both reach "live" → the rail mounts.
    await expect(A.getByRole('button', { name: 'People' })).toBeVisible({ timeout: 25_000 });
    await expect(B.getByRole('button', { name: 'People' })).toBeVisible({ timeout: 25_000 });

    // A finds B in the People list (next poll surfaces it) and connects.
    await A.getByRole('button', { name: 'People' }).click();
    const rowB = A.locator('li', { hasText: handleB });
    await expect(rowB).toBeVisible({ timeout: 15_000 });
    await rowB.getByRole('button', { name: 'Connect' }).click();

    // B gets the incoming request (auto-surfaced to the Requests tab) and accepts.
    await expect(B.getByText(/stranger wants to connect/i)).toBeVisible({ timeout: 25_000 });
    await B.getByRole('button', { name: 'Accept' }).click();

    // WebRTC handshake completes → data channel open → composer enabled on both.
    await expect(A.getByPlaceholder('Type a message')).toBeEnabled({ timeout: 30_000 });
    await expect(B.getByPlaceholder('Type a message')).toBeEnabled({ timeout: 30_000 });

    // Messages cross the P2P data channel both ways.
    const msgA = `from-A-${Date.now()}`;
    await A.getByPlaceholder('Type a message').fill(msgA);
    await A.getByRole('button', { name: 'Send' }).click();
    await expect(B.getByText(msgA)).toBeVisible({ timeout: 15_000 });

    const msgB = `from-B-${Date.now()}`;
    await B.getByPlaceholder('Type a message').fill(msgB);
    await B.getByRole('button', { name: 'Send' }).click();
    await expect(A.getByText(msgB)).toBeVisible({ timeout: 15_000 });

    // A escalates to video; B accepts the incoming call.
    await A.getByRole('button', { name: 'Start video' }).click();
    await expect(B.getByText(/wants to start a video call/i)).toBeVisible({ timeout: 15_000 });
    await B.getByRole('button', { name: 'Accept' }).click();

    // Real frames flow: each side's remote <video> reports a non-zero size.
    for (const page of [A, B]) {
      const remote = page.locator('video').first();
      await expect(remote).toBeVisible({ timeout: 25_000 });
      await expect
        .poll(() => remote.evaluate((v: HTMLVideoElement) => v.videoWidth), {
          timeout: 25_000,
        })
        .toBeGreaterThan(0);
    }
  } finally {
    await browser.close();
  }
});
