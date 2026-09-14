import { test, expect } from '@playwright/test';

test('idle sheet loads, loops, pauses and supports drawing inspection', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('idle-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-matte', 'isolated');
  await expect(host).toHaveAttribute('data-state', 'playing');
  await page.getByRole('button', { name: 'Pause idle' }).click();
  await expect(host).toHaveAttribute('data-state', 'paused');
  const tipPositions = new Set<string>();
  for (const [time, frame, label] of [
    ['0', '0', 'start'],
    ['500', '7', 'rise'],
    ['1000', '15', 'apex'],
    ['1500', '8', 'return'],
  ]) {
    await page.getByRole('slider').fill(time);
    await expect(host).toHaveAttribute('data-frame', frame);
    await page.screenshot({
      path: `test-results/conductor-idle-${label}.png`,
    });
    tipPositions.add((await host.getAttribute('data-tip-position')) ?? '');
  }
  expect(tipPositions.size).toBeGreaterThan(1);
  await expect(host).toHaveAttribute('data-tip-energy', /0\.[0-9]+/);
  await page.getByRole('button', { name: 'Play idle' }).click();
  await expect(host).toHaveAttribute('data-state', 'playing');
  expect(errors).toEqual([]);
});
