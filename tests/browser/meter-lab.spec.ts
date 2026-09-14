import { expect, test } from '@playwright/test';

test('Changing Meter lab exposes both groupings, rests, and synchronized releases', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('meter-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await expect(host).toHaveAttribute('data-grouping', '3+2');
  await page.getByRole('slider').fill('1000');
  await expect(host).toHaveAttribute('data-pulse', '1');
  await expect(host).toHaveAttribute('data-releases', '1');
  await page.getByRole('slider').fill('2000');
  await expect(host).toHaveAttribute('data-pulse', '3');
  await page.screenshot({ path: 'test-results/meter-rest.png' });
  await page.getByRole('slider').fill('6000');
  await expect(host).toHaveAttribute('data-grouping', '2+3');
  await expect(host).toHaveAttribute('data-pulse', '1');
  await page.screenshot({ path: 'test-results/meter-switch.png' });
  await page.getByRole('button', { name: 'Play with sound' }).click();
  await expect(host).toHaveAttribute('data-state', 'playing');
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect(host).toHaveAttribute('data-state', 'paused');
  expect(errors).toEqual([]);
});
