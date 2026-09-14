import { test, expect } from '@playwright/test';
import {
  CONTINUITY_ATTACK_START_MS,
  CONTINUITY_SETTLE_START_MS,
} from '../../src/lab/continuity-score';

test('continuity lab crosses both idle-Ictus seams without runtime errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('continuity-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'playing');
  await page.getByRole('button', { name: 'Pause sequence' }).click();

  for (const [time, phase, name] of [
    [CONTINUITY_ATTACK_START_MS - 1, 'lead-idle', 'idle-to-ictus-before'],
    [CONTINUITY_ATTACK_START_MS, 'windup', 'idle-to-ictus-after'],
    [CONTINUITY_SETTLE_START_MS - 1, 'recovery', 'ictus-to-idle-before'],
    [CONTINUITY_SETTLE_START_MS, 'settle-idle', 'ictus-to-idle-after'],
  ] as const) {
    await page.getByRole('slider').fill(String(time));
    await expect(host).toHaveAttribute('data-phase', phase);
    await page.screenshot({ path: `test-results/${name}.png` });
  }

  await page.getByRole('button', { name: 'Play sequence' }).click();
  await expect(host).toHaveAttribute('data-state', 'playing');
  expect(errors).toEqual([]);
});
