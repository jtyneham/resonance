import { test, expect } from '@playwright/test';

test('wide waves render in the portrait arena without browser errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'START', exact: false }).click();
  await page.getByRole('button', { name: 'ENTER BATTLE' }).click();
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(
    () =>
      parseFloat(
        document.querySelector<HTMLElement>('#progress')!.style.width,
      ) >= 10.8,
  );
  await page.screenshot({
    path: 'test-results/wide-wave-phone.png',
    scale: 'css',
  });
  await expect(page.locator('.game')).toHaveAttribute('data-screen', 'battle');
  expect(errors).toEqual([]);
});
