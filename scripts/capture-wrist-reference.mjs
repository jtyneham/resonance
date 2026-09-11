import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Capture the unchanged approved study, through its existing UI controls.
const output = resolve(
  'docs/bosses/conductor/animation-reference/approved-wrist',
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 480, height: 1000 },
    deviceScaleFactor: 2,
  });
  page.setDefaultTimeout(15000);
  await page.goto('http://127.0.0.1:4173/resonance/wrist-lab.html', {
    waitUntil: 'domcontentloaded',
  });
  await page.locator('#viewport[data-view="player"]').waitFor();
  for (const view of ['player', 'side']) {
    if (view === 'side')
      await page
        .getByRole('button', { name: 'Show side view', exact: true })
        .click();
    for (const [name, time] of [
      ['01-idle', 0],
      ['02-wind-up', 130],
      ['03-strike', 260],
      ['04-recovery', 600],
    ]) {
      await page
        .getByRole('slider', { name: 'Motion', exact: true })
        .fill(String(time));
      const actual = await page.locator('#viewport').getAttribute('data-time');
      if (actual !== String(time))
        throw new Error(`Wrong capture time: ${actual}`);
      await page
        .locator('#viewport canvas')
        .screenshot({ path: resolve(output, `${view}-${name}.png`) });
      console.log(`${view}-${name}.png @ ${time} ms`);
    }
  }
} finally {
  await browser.close();
}
