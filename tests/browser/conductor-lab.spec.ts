import { test, expect } from '@playwright/test';

test('whole-hand study loads, exposes every motion phase and fits portrait screens', async ({
  page,
}) => {
  const errors: string[] = [],
    requests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('conductor-lab.html');
  await expect(page.locator('.study')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByRole('slider')).toHaveAttribute('max', '2');
  for (const [seconds, section, frame] of [
    ['0.25', 'Preparation', '6'],
    ['0.45', 'Downstroke', '10'],
    ['0.56', 'Ictus', '13'],
    ['0.67', 'Rebound', '16'],
    ['0.88', 'Return', '21'],
  ]) {
    await page.getByRole('slider').fill(seconds);
    await expect(page.locator('#section')).toHaveText(section);
    await expect(page.locator('.study')).toHaveAttribute('data-frame', frame);
  }
  await page.screenshot({
    path: 'test-results/conductor-whole-hand-ictus.png',
  });
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
  expect(
    requests.some((url) =>
      url.endsWith('/assets/conductor-lab/ictus-whole-hand-v1.png'),
    ),
  ).toBe(true);
  expect(requests.some((url) => /\/three-/.test(url))).toBe(false);
  expect(errors).toEqual([]);
});

test('audio clock freezes on pause and frame sampling catches up after skipped drawing', async ({
  page,
}) => {
  await page.goto('conductor-lab.html');
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'playing');
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'PAUSE', exact: true }).click();
  const paused = await page.locator('.study').getAttribute('data-beat');
  await page.waitForTimeout(250);
  expect(await page.locator('.study').getAttribute('data-beat')).toBe(paused);
  await page.getByText('INSPECT THE FRAMES').click();
  await page.getByRole('combobox').selectOption('15');
  await page.getByRole('checkbox', { name: 'Palm anchor' }).check();
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await page.getByRole('button', { name: 'Skip drawing for 700 ms' }).click();
  const before = Number(await page.locator('.study').getAttribute('data-beat'));
  await page.waitForTimeout(300);
  expect(Number(await page.locator('.study').getAttribute('data-beat'))).toBe(
    before,
  );
  await page.waitForTimeout(700);
  const after = Number(await page.locator('.study').getAttribute('data-beat'));
  expect(after).not.toBe(before);
  expect(await page.locator('.study').getAttribute('data-sampled-beat')).toBe(
    after.toFixed(5),
  );
});

test('the two-second clip loops and rotation pauses until explicitly resumed', async ({
  page,
}) => {
  await page.goto('conductor-lab.html');
  await page.getByRole('slider').fill('1.9');
  await page.getByRole('button', { name: 'PLAY STUDY' }).click();
  await page.waitForTimeout(400);
  expect(
    Number(await page.locator('.study').getAttribute('data-beat')),
  ).toBeLessThan(2);
  await page.setViewportSize({ width: 915, height: 412 });
  await expect(
    page.getByRole('dialog', { name: 'Rotate your device' }),
  ).toBeVisible();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
  await page.setViewportSize({ width: 412, height: 915 });
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('.study')).toHaveAttribute('data-state', 'paused');
});

test('missing atlas reports a visible error without enabling playback', async ({
  page,
}) => {
  await page.route('**/assets/conductor-lab/ictus-whole-hand-v1.png', (route) =>
    route.abort(),
  );
  await page.goto('conductor-lab.html');
  await expect(page.locator('#notice')).toContainText(
    'Could not run the study',
  );
  await expect(page.getByRole('button', { name: 'PLAY STUDY' })).toBeDisabled();
});
