import { test, expect } from '@playwright/test';
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
