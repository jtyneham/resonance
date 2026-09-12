import { expect, test } from '@playwright/test';

test('styled blocking loads, inspects keys, plays and returns to idle', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('styled-lab.html');
  const study = page.locator('.study');
  await expect(study).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('.caption')).toContainText(
    'NOT FINISHED ANIMATION',
  );
  await page.getByRole('button', { name: 'Wind-up', exact: true }).click();
  await expect(study).toHaveAttribute('data-frame', '1');
  await page.screenshot({ path: 'test-results/styled-windup-phone.png' });
  await page.getByRole('button', { name: 'Strike', exact: true }).click();
  await expect(study).toHaveAttribute('data-time', '260');
  await expect(study).toHaveAttribute('data-frame', '2');
  await page.screenshot({ path: 'test-results/styled-strike-phone.png' });
  await page.getByRole('button', { name: 'Idle', exact: true }).click();
  await page
    .getByRole('button', { name: 'Play pose study', exact: true })
    .click();
  await expect(study).toHaveAttribute('data-time', '1200');
  await expect(study).toHaveAttribute('data-frame', '0');
  await page.screenshot({ path: 'test-results/styled-idle-phone.png' });
  await page.getByRole('button', { name: 'Slow · ¼ speed' }).click();
  await page.getByRole('button', { name: 'Replay pose study' }).click();
  await expect(study).toHaveAttribute('data-state', 'playing');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(study).toHaveAttribute('data-state', 'paused');
  expect(errors).toEqual([]);
});
