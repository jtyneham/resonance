import { expect, test } from '@playwright/test';

test('Changing Meter phrase loads whole-hand frames and exposes the 3+2 beats', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('meter-phrase-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-asset', 'whole-hand-frames');
  await expect(host).toHaveAttribute('data-state', 'playing');
  await page.getByRole('button', { name: 'Pause phrase' }).click();
  await page.getByRole('slider').fill('500');
  await expect(host).toHaveAttribute('data-beat', '2');
  await expect(host).toHaveAttribute('data-accent', 'weak');
  await page.getByRole('slider').fill('1500');
  await expect(host).toHaveAttribute('data-beat', '4');
  await expect(host).toHaveAttribute('data-accent', 'strong');
  await page.screenshot({ path: 'test-results/meter-phrase-beat-4.png' });
  expect(errors).toEqual([]);
});
