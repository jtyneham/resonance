import { test, expect } from '@playwright/test';

test('portrait title, all five lanes, options and saved settings', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'RESONANCE.' })).toBeVisible();
  await expect(page.locator('#arena')).toBeHidden();
  await page.screenshot({ path: 'test-results/title-phone.png' });
  await page.getByRole('button', { name: 'OPTIONS + CONTROLS' }).click();
  await page.locator('#volume').fill('35');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'GOT IT' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'OPTIONS + CONTROLS' }).click();
  await expect(page.locator('#volume')).toHaveValue('35');
  await expect(page.getByRole('checkbox')).toBeChecked();
  await page.getByRole('button', { name: 'GOT IT' }).click();
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'DUMMY BOSS' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('touch moves one lane; simultaneous jump/move; pause freezes; rotation requires resume', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await page.getByRole('button', { name: 'ENTER BATTLE' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  await expect(page.locator('#telegraphs i')).toHaveCount(5);
  await page.getByRole('button', { name: 'Move left', exact: true }).tap();
  await expect(page.locator('.game')).toHaveAttribute('data-lane', '1');
  await page.getByRole('button', { name: 'Move right', exact: true }).tap();
  await expect(page.locator('.game')).toHaveAttribute('data-lane', '2');
  const client = await page.context().newCDPSession(page);
  const jump = await page
    .getByRole('button', { name: 'Jump', exact: true })
    .boundingBox();
  const right = await page
    .getByRole('button', { name: 'Move right', exact: true })
    .boundingBox();
  const p1 = {
    x: jump!.x + jump!.width / 2,
    y: jump!.y + jump!.height / 2,
    id: 1,
  };
  const p2 = {
    x: right!.x + right!.width / 2,
    y: right!.y + right!.height / 2,
    id: 2,
  };
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [p1],
  });
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [p1, p2],
  });
  await expect(page.locator('.game')).toHaveAttribute('data-airborne', 'true');
  await expect(page.locator('.game')).toHaveAttribute('data-lane', '3');
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await page.getByRole('button', { name: 'Pause battle' }).click();
  const progress = await page.locator('#progress').getAttribute('style');
  await page.waitForTimeout(350);
  expect(await page.locator('#progress').getAttribute('style')).toBe(progress);
  await page.getByRole('button', { name: 'RESUME' }).click();
  await page.setViewportSize({ width: 915, height: 412 });
  await expect(
    page.getByRole('dialog', { name: 'Rotate your device' }),
  ).toBeVisible();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'paused');
  await page.setViewportSize({ width: 412, height: 915 });
  await expect(
    page.getByRole('dialog', { name: 'Rotate your device' }),
  ).toBeHidden();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'paused');
  await page.getByRole('button', { name: 'RESUME' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  await page.screenshot({ path: 'test-results/battle-phone.png' });
});

test('fullscreen toggle, defeat and immediate fresh retry', async ({
  page,
}) => {
  await page.goto('./');
  await page
    .getByRole('button', { name: 'Enter fullscreen', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Exit fullscreen', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Exit fullscreen', exact: true })
    .click();
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await page.getByRole('button', { name: 'ENTER BATTLE' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'result', {
    timeout: 15_000,
  });
  await expect(
    page.getByRole('heading', { name: 'Out of tune.' }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/defeat-phone.png' });
  await page.getByRole('button', { name: 'TRY AGAIN' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  await expect(page.locator('#health')).toHaveAttribute(
    'aria-label',
    '3 of 3 health',
  );
  await expect(page.locator('#charge-status span')).toHaveText('0 / 2');
});

test('small phones maintain a portrait frame without overflow', async ({
  page,
}) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('./');
    const start = await page.locator('#start').boundingBox();
    expect(start!.y + start!.height).toBeLessThanOrEqual(size.height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `test-results/title-${size.width}.png` });
  }
});

test('desktop uses a centered portrait frame and keyboard controls', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/resonance/');
  await expect(page.locator('#rotate')).toBeHidden();
  const rect = await page.locator('.game').boundingBox();
  expect(rect!.width).toBe(480);
  expect(rect!.height).toBe(900);
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await page.getByRole('button', { name: 'ENTER BATTLE' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.game')).toHaveAttribute('data-lane', '3');
  await page.keyboard.press('Escape');
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'paused');
  await page.screenshot({ path: 'test-results/desktop.png' });
  await context.close();
});

test('real audio-clock battle can be won via the controls and saves a record', async ({
  page,
}) => {
  test.setTimeout(75_000);
  await page.goto('./');
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await page.getByRole('button', { name: 'ENTER BATTLE' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  // The driver reads the visible progress bar and sends the same input events as
  // the keyboard. It never modifies battle state or accesses a production cheat.
  await page.evaluate(async () => {
    const inputs: { time: number; code: string }[] = [];
    const add = (beat: number, code: string) =>
      inputs.push({ time: (beat * 60) / 160, code });
    for (let phrase = 0; phrase < 5; phrase++) {
      const b = phrase * 16;
      add(b + 5.5, 'KeyJ');
      const out = phrase % 2 ? 'ArrowLeft' : 'ArrowRight';
      const back = phrase % 2 ? 'ArrowRight' : 'ArrowLeft';
      add(b + 6, out);
      add(b + 6.1, out);
      add(b + 13.1, 'Space');
      add(b + 14.7, back);
      add(b + 14.8, back);
    }
    inputs.sort((a, b) => a.time - b.time);
    await new Promise<void>((resolve) => {
      let index = 0;
      function tick() {
        if (
          document.querySelector<HTMLElement>('.game')!.dataset.screen ===
          'result'
        ) {
          resolve();
          return;
        }
        const seconds =
          (parseFloat(
            document.querySelector<HTMLElement>('#progress')!.style.width,
          ) *
            45) /
            100 || 0;
        while (index < inputs.length && inputs[index].time <= seconds + 0.012) {
          const { code } = inputs[index++];
          window.dispatchEvent(
            new KeyboardEvent('keydown', { code, bubbles: true }),
          );
          window.dispatchEvent(
            new KeyboardEvent('keyup', { code, bubbles: true }),
          );
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  });
  await expect(
    page.getByRole('heading', { name: 'In resonance.' }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/victory-phone.png' });
  await page.getByRole('button', { name: 'ENCOUNTERS' }).click();
  await expect(page.locator('#best-record')).toContainText('1 CLEAR');
});
