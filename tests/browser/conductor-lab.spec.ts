import { test, expect } from '@playwright/test';

test('study loads independently, scrubs every pose and fits portrait screens', async ({
  page,
}) => {
  const errors: string[] = [],
    requests: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (req) => requests.push(req.url()));
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-ready', 'true');
  await page.screenshot({ path: 'test-results/conductor-idle.png' });
  for (const [value, section] of [
    ['2.5', 'Ictus'],
    ['6.8', 'Finger articulation'],
    ['10.5', 'Cutoff'],
  ]) {
    await page.getByRole('slider').fill(value);
    await expect(page.locator('#section')).toHaveText(section);
    await page.screenshot({
      path: `test-results/conductor-${section.replaceAll(' ', '-')}.png`,
    });
  }
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
      page.getByRole('button', { name: 'PLAY STUDY' }),
    ).toBeInViewport();
  }
  expect(requests.some((url) => /\/three-/.test(url))).toBe(false);
  expect(errors).toEqual([]);
});

test('real audio clock freezes on pause and catches up after skipped drawing', async ({
  page,
}) => {
  await page.goto('conductor-lab.html');
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'playing');
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  await page.waitForTimeout(80);
  const paused = await page.locator('.study').getAttribute('data-beat');
  await page.waitForTimeout(250);
  expect(await page.locator('.study').getAttribute('data-beat')).toBe(paused);
  await page.getByText('INSPECT THE RIG').click();
  await page.getByRole('combobox').selectOption('15');
  await page.getByRole('checkbox', { name: 'Joint guides' }).check();
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await page.getByRole('button', { name: 'Skip drawing for 700 ms' }).click();
  const before = Number(await page.locator('.study').getAttribute('data-beat'));
  await page.waitForTimeout(300);
  expect(Number(await page.locator('.study').getAttribute('data-beat'))).toBe(
    before,
  );
  await page.waitForTimeout(700);
  const after = Number(await page.locator('.study').getAttribute('data-beat'));
  expect(after - before).toBeGreaterThan(1.3);
  expect(after - before).toBeLessThan(2.8);
  expect(await page.locator('.study').getAttribute('data-sampled-beat')).toBe(
    after.toFixed(5),
  );
});

test('isolated clips loop and rotation pauses until explicitly resumed', async ({
  page,
}) => {
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Ictus', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveAttribute('max', '4');
  await page.getByRole('slider').fill('3.9');
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await page.waitForTimeout(400);
  expect(
    Number(await page.locator('.study').getAttribute('data-beat')),
  ).toBeLessThan(6);
  await page.setViewportSize({ width: 915, height: 412 });
  await expect(
    page.getByRole('dialog', { name: 'Rotate your device' }),
  ).toBeVisible();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  await page.setViewportSize({ width: 412, height: 915 });
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  await page.getByRole('button', { name: 'Enter fullscreen' }).click();
  await expect(
    page.getByRole('button', { name: 'Exit fullscreen' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Exit fullscreen' }).click();
});

test('missing art reports a visible error without enabling playback', async ({
  page,
}) => {
  await page.route('**/assets/conductor-lab/parts.png', (route) =>
    route.abort(),
  );
  await page.goto('conductor-lab.html');
  await expect(page.locator('#notice')).toContainText(
    'Could not run the study',
  );
  await expect(page.getByRole('button', { name: 'PLAY STUDY' })).toBeDisabled();
});
