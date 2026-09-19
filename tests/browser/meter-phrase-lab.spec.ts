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
  await page.getByRole('slider').fill('750');
  await expect(host).toHaveAttribute('data-beat', '2');
  await expect(host).toHaveAttribute('data-accent', 'weak');
  await page.getByRole('slider').fill('1750');
  await expect(host).toHaveAttribute('data-beat', '4');
  await expect(host).toHaveAttribute('data-accent', 'strong');
  await page.screenshot({ path: 'test-results/meter-phrase-beat-4.png' });
  await page.getByRole('slider').fill('2200');
  await expect(host).toHaveAttribute('data-sheet', 'phrase');
  await expect(host).toHaveAttribute('data-frame', '19');
  await page.screenshot({ path: 'test-results/meter-phrase-final-pose.png' });
  await page.getByRole('slider').fill('2325');
  await expect(host).toHaveAttribute('data-sheet', 'bridge');
  await expect(host).toHaveAttribute('data-frame', '2');
  await page.screenshot({ path: 'test-results/meter-phrase-bridge-2.png' });
  await page.getByRole('slider').fill('2400');
  await expect(host).toHaveAttribute('data-sheet', 'bridge');
  await expect(host).toHaveAttribute('data-frame', '3');
  await page.screenshot({ path: 'test-results/meter-phrase-bridge-3.png' });
  await page.getByRole('slider').fill('2450');
  await expect(host).toHaveAttribute('data-sheet', 'phrase');
  await expect(host).toHaveAttribute('data-frame', '0');
  await page.screenshot({ path: 'test-results/meter-phrase-loop-open.png' });
  await page.getByRole('button', { name: 'Compare Ictus' }).click();
  await expect(host).toHaveAttribute('data-mode', 'compare');
  await expect(host).toHaveAttribute('data-comparison', 'overlay');
  await expect(
    page.getByRole('button', { name: 'Exit compare' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: 'test-results/meter-phrase-comparison.png' });
  await page.getByRole('button', { name: 'Approved Ictus' }).click();
  await expect(host).toHaveAttribute('data-comparison', 'ictus');
  await page.screenshot({ path: 'test-results/meter-phrase-ictus-scale.png' });
  await page.getByRole('button', { name: 'Phrase', exact: true }).click();
  await expect(host).toHaveAttribute('data-comparison', 'phrase');
  await page.screenshot({ path: 'test-results/meter-phrase-phrase-scale.png' });
  expect(errors).toEqual([]);
});
