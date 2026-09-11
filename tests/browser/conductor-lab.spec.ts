import { test, expect } from '@playwright/test';

test('playback survives a first frame timestamp older than the play click', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const nativeRaf = window.requestAnimationFrame.bind(window);
    let first = true;
    window.requestAnimationFrame = (callback) =>
      nativeRaf((timestamp) => {
        const stale = first;
        first = false;
        callback(stale ? timestamp - 100 : timestamp);
      });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'ready');
  await page.getByRole('button', { name: 'Play Ictus', exact: true }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-frame', '6');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  expect(errors).toEqual([]);
});

test('transition plays once, scrubs and keeps original available', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('.study')).toHaveAttribute('data-frame', '6');
  await page.screenshot({ path: 'test-results/transition-start.png' });
  await page.getByRole('button', { name: 'Play Ictus', exact: true }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-frame', '6');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  await page.screenshot({ path: 'test-results/transition-end.png' });
  await page.getByRole('slider').fill('200');
  await expect(page.locator('.study')).toHaveAttribute('data-frame', '0');
  await expect(page.locator('.study')).toHaveAttribute(
    'data-phase',
    'Ictus · attack release',
  );
  await page.screenshot({ path: 'test-results/ictus-strike.png' });
  await page.getByRole('slider').fill('50');
  await expect(page.locator('.study')).toHaveAttribute(
    'data-phase',
    'Preparation',
  );
  await page.screenshot({ path: 'test-results/ictus-preparation.png' });
  await page.getByRole('slider').fill('500');
  await expect(page.locator('.study')).toHaveAttribute('data-frame', '3');
  await page.screenshot({ path: 'test-results/transition-middle.png' });
  await page
    .getByRole('button', { name: 'Original reference', exact: true })
    .click();
  await expect(page.locator('#reference')).toBeVisible();
  await expect(page.locator('canvas')).toBeHidden();
  await page.getByRole('button', { name: 'Back to Ictus' }).click();
  await page.getByRole('button', { name: 'Slow' }).click();
  await expect(page.getByRole('button', { name: 'Slow' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('slider').fill('0');
  await page.getByRole('button', { name: 'Play Ictus', exact: true }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'playing');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('failed transition asset prevents playback and explains failure', async ({
  page,
}) => {
  await page.route('**/angle-45*.png', (route) => route.abort());
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('#notice')).toContainText('could not load');
  await expect(
    page.getByRole('button', { name: 'Play Ictus', exact: true }),
  ).toBeDisabled();
});
