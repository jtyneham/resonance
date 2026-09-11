import { test, expect } from '@playwright/test';

test('original reference loads under the Pages base path and fits portrait', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'ready');
  const image = page.locator('#reference');
  expect(
    await image.evaluate((element: HTMLImageElement) => element.naturalWidth),
  ).toBeGreaterThan(1000);
  await expect(page.getByRole('slider')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
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
    await expect(
      page.getByRole('button', { name: 'Enter fullscreen' }),
    ).toBeInViewport();
  }
  await page.screenshot({ path: 'test-results/conductor-reference-reset.png' });
  expect(errors).toEqual([]);
});

test('reference loading failure gives a useful message', async ({ page }) => {
  await page.route('**/Conductor_visual_transparent*.png', (route) =>
    route.abort(),
  );
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'error');
  await expect(page.getByRole('status')).toContainText('could not load');
});
