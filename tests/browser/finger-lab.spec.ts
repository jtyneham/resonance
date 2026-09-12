import { expect, test } from '@playwright/test';

test('complete finger curls three connected joints and retains the approved comparison', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('finger-lab.html?mode=full');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-angles', '[0,0,0]');
  await page.screenshot({ path: 'test-results/full-finger-straight.png' });
  await page.getByRole('slider').fill('600');
  await page.screenshot({ path: 'test-results/full-finger-middle.png' });
  await page.getByRole('slider').fill('1200');
  await expect(host).toHaveAttribute('data-angles', '[0.28,0.85,0.55]');
  await page.screenshot({ path: 'test-results/full-finger-curled.png' });
  await page.getByRole('button', { name: 'Side view', exact: true }).click();
  await page.screenshot({ path: 'test-results/full-finger-side.png' });
  await page.getByRole('button', { name: 'Play bend', exact: true }).click();
  const seen = await page.evaluate(async () => {
    const frames = new Set();
    for (let i = 0; i < 24; i++) {
      await new Promise(requestAnimationFrame);
      frames.add(
        document.querySelector<HTMLElement>('#sample')!.dataset.angles,
      );
    }
    return frames.size;
  });
  expect(seen).toBeGreaterThan(12);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(host).toHaveAttribute('data-state', 'paused');
  await page
    .getByRole('link', { name: 'Approved single-joint sample' })
    .click();
  await expect(host).toHaveAttribute('data-state', 'ready');
  await expect(host).not.toHaveAttribute('data-angles');
  expect(errors).toEqual([]);
});

test('finger sample bends continuously, pauses and supports side inspection', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('finger-lab.html');
  const host = page.locator('#sample');
  await expect(host).toHaveAttribute('data-state', 'ready');
  await page.screenshot({ path: 'test-results/finger-front-straight.png' });
  await page.getByRole('slider', { name: 'Inspect bend' }).fill('1200');
  await expect(host).toHaveAttribute('data-angle', '1.26');
  await page.screenshot({ path: 'test-results/finger-front-bent.png' });
  await page.getByRole('button', { name: 'Side view', exact: true }).click();
  await expect(host).toHaveAttribute('data-view', 'side');
  await page.screenshot({ path: 'test-results/finger-side-bent.png' });
  await page.getByRole('button', { name: 'Play bend', exact: true }).click();
  const angles = await page.evaluate(async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++) {
      await new Promise(requestAnimationFrame);
      seen.add(document.querySelector<HTMLElement>('#sample')!.dataset.angle!);
    }
    return seen.size;
  });
  expect(angles).toBeGreaterThan(10);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(host).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Play bend', exact: true }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(host).toHaveAttribute('data-state', 'paused');
  expect(errors).toEqual([]);
});
