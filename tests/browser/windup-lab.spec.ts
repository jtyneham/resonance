import { test, expect } from '@playwright/test';
test('attack layer charges, flashes, and releases the authored arc phrase', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('windup-lab.html?mode=attack');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await page.getByRole('slider').fill('243');
  await expect(host).toHaveAttribute('data-release', 'charging');
  await expect(host).toHaveAttribute('data-attacks', '0');
  await page.screenshot({ path: 'test-results/ictus-charge.png' });
  await page.getByRole('slider').fill('244');
  await expect(host).toHaveAttribute('data-release', 'released');
  await expect(host).toHaveAttribute('data-attacks', '1');
  await page.screenshot({ path: 'test-results/ictus-release.png' });
  await page.getByRole('slider').fill('702');
  await expect(host).toHaveAttribute('data-attacks', '6');
  await page.screenshot({ path: 'test-results/ictus-phrase.png' });
  await page.getByRole('slider').fill('1500');
  await expect(host).toHaveAttribute('data-phase', 'idle');
  expect(errors).toEqual([]);
});
test('complete Ictus rebounds immediately and returns to upright idle', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('windup-lab.html?mode=ictus');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await page.getByRole('slider').fill('259');
  await expect(host).toHaveAttribute('data-phase', 'stroke');
  await expect(host).toHaveAttribute('data-frame', '7');
  await page.screenshot({ path: 'test-results/ictus-strike.png' });
  await page.getByRole('slider').fill('260');
  await expect(host).toHaveAttribute('data-phase', 'recovery');
  await expect(host).toHaveAttribute('data-frame', '6');
  await page.getByRole('slider').fill('700');
  await expect(host).toHaveAttribute('data-phase', 'recovery');
  await page.screenshot({ path: 'test-results/ictus-recovery.png' });
  await page.getByRole('slider').fill('1200');
  await expect(host).toHaveAttribute('data-phase', 'idle');
  await expect(host).toHaveAttribute('data-frame', '0');
  await page.screenshot({ path: 'test-results/ictus-idle.png' });
  await page.getByRole('button', { name: 'Play recovery only' }).click();
  await expect(host).toHaveAttribute('data-phase', 'recovery');
  await expect(host).toHaveAttribute('data-state', 'playing');
  await expect(host).toHaveAttribute('data-time', '1200');
  await expect(host).toHaveAttribute('data-state', 'paused');
  expect(errors).toEqual([]);
});
test('combined sequence crosses the sheet boundary and supports endpoint replay', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('windup-lab.html?mode=stroke');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await page.getByRole('slider').fill('129');
  await expect(host).toHaveAttribute('data-phase', 'windup');
  await page.getByRole('slider').fill('130');
  await expect(host).toHaveAttribute('data-phase', 'stroke');
  await expect(host).toHaveAttribute('data-frame', '0');
  await page.getByRole('slider').fill('240');
  await expect(host).toHaveAttribute('data-frame', '6');
  await page.screenshot({ path: 'test-results/stroke-fixed-frame7.png' });
  await page.getByRole('slider').fill('0');
  await page.getByRole('button', { name: 'Slow · ¼ speed' }).click();
  await page
    .getByRole('button', { name: 'Play sequence', exact: true })
    .click();
  await expect(host).toHaveAttribute('data-time', '260');
  await expect(host).toHaveAttribute('data-state', 'paused');
  await page.screenshot({ path: 'test-results/stroke-end.png' });
  await page
    .getByRole('button', { name: 'Replay sequence', exact: true })
    .click();
  await expect(host).toHaveAttribute('data-time', '260');
  expect(errors).toEqual([]);
});
test('2D wind-up loads, plays to its endpoint, scrubs and replays', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('windup-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await page.screenshot({ path: 'test-results/windup-start.png' });
  await page.getByRole('button', { name: 'Slow · ¼ speed' }).click();
  await page.getByRole('button', { name: 'Play wind-up', exact: true }).click();
  await expect(host).toHaveAttribute('data-frame', '7');
  await expect(host).toHaveAttribute('data-state', 'paused');
  await page.screenshot({ path: 'test-results/windup-end.png' });
  await page.getByRole('slider').fill('65');
  await expect(host).toHaveAttribute('data-frame', '4');
  await page.getByRole('button', { name: 'Play wind-up', exact: true }).click();
  await expect(host).toHaveAttribute('data-frame', '7');
  await page
    .getByRole('button', { name: 'Replay wind-up', exact: true })
    .click();
  await expect(host).toHaveAttribute('data-frame', '7');
  expect(errors).toEqual([]);
});
