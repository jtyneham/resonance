import './idle.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/conductor-idle-sheet-review-01.png?url';
import {
  IDLE_CELL_BOTTOM_GUTTER_PX,
  IDLE_CYCLE_MS,
  IDLE_FRAME_COUNT,
  idleCellBounds,
  idleFrame,
  idleTime,
  idleTipEnergy,
  isBrightEdgeFringe,
  isPaintedMatteCandidate,
  isPaintedMatteSeed,
} from './idle-score';

const COLUMNS = 4;
const ROWS = 4;

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">2D WHOLE-HAND DRAWINGS · IDLE REVIEW</p>
<h1>Upright, watchful, restrained.</h1>
<p>Sixteen complete drawings form a two-second loop. The character stays centered; only its mechanical tension and hanging details breathe.</p>
<div id="sample"><canvas width="600" height="760" aria-label="The Conductor's upright idle animation"></canvas></div>
<div class="row"><button id="play" disabled>Pause idle</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
<label for="timeline">Inspect drawing <output id="frame">1 / ${IDLE_FRAME_COUNT}</output></label>
<input id="timeline" type="range" min="0" max="${IDLE_CYCLE_MS - 1}" value="0" step="1" />
<p id="status" role="status">Loading idle drawings…</p>
<p>The baton-tip magic is a separate live effect. The source sheet's painted checkerboard is removed non-destructively in the preview; the approved upright and Ictus artwork remain untouched.</p>
<p><a href="${import.meta.env.BASE_URL}windup-lab.html?mode=attack">Approved Ictus attack preview ↗</a> · <a href="${sheetUrl}" target="_blank" rel="noopener">Source review sheet ↗</a></p>
<div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate to portrait to inspect the idle.</p></div>`;

const host = document.querySelector<HTMLElement>('#sample')!;
const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const slider = document.querySelector<HTMLInputElement>('#timeline')!;
const frameOutput = document.querySelector<HTMLOutputElement>('#frame')!;
const status = document.querySelector<HTMLElement>('#status')!;
const source = new Image();
const isolatedSheet = document.createElement('canvas');
const isolatedContext = isolatedSheet.getContext('2d', {
  willReadFrequently: true,
})!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let ready = false;
let playing = false;
let elapsed = 0;
let previous = 0;
let rate = 1;
let raf = 0;
let tipPositions: { x: number; y: number }[] = [];

function floodPaintedMatte(pixels: ImageData) {
  const width = pixels.width;
  const height = pixels.height;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const enqueueSeed = (pixel: number) => {
    if (visited[pixel]) return;
    const offset = pixel * 4;
    if (
      !isPaintedMatteSeed(
        pixels.data[offset],
        pixels.data[offset + 1],
        pixels.data[offset + 2],
      )
    )
      return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) {
    enqueueSeed(x);
    enqueueSeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueueSeed(y * width);
    enqueueSeed(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    pixels.data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    const neighbors = [
      x > 0 ? pixel - 1 : -1,
      x < width - 1 ? pixel + 1 : -1,
      pixel >= width ? pixel - width : -1,
      pixel < width * (height - 1) ? pixel + width : -1,
    ];
    for (const neighbor of neighbors) {
      if (neighbor < 0 || visited[neighbor]) continue;
      const offset = neighbor * 4;
      if (
        !isPaintedMatteCandidate(
          pixels.data[offset],
          pixels.data[offset + 1],
          pixels.data[offset + 2],
        )
      )
        continue;
      visited[neighbor] = 1;
      queue[tail++] = neighbor;
    }
  }
}

function locateBatonTips(pixels: ImageData) {
  const positions: { x: number; y: number }[] = [];
  for (let frame = 0; frame < IDLE_FRAME_COUNT; frame++) {
    const cell = idleCellBounds(frame, pixels.width, pixels.height);
    const left = cell.left;
    const top = cell.top;
    const bottom = cell.top + cell.height;
    const cellWidth = cell.width;
    const center = left + cellWidth * 0.49;
    const searchLeft = Math.floor(center - cellWidth * 0.07);
    const searchRight = Math.ceil(center + cellWidth * 0.07);
    const searchBottom = Math.floor(top + (bottom - top) * 0.3);
    let tipY = searchBottom;
    let tipXTotal = 0;
    let tipPixels = 0;

    for (let y = top; y < searchBottom; y++) {
      let rowFound = false;
      for (let x = searchLeft; x <= searchRight; x++) {
        if (pixels.data[(y * pixels.width + x) * 4 + 3] < 80) continue;
        if (y < tipY) {
          tipY = y;
          tipXTotal = 0;
          tipPixels = 0;
        }
        if (y <= tipY + 2) {
          tipXTotal += x;
          tipPixels++;
          rowFound = true;
        }
      }
      if (rowFound && y > tipY + 2) break;
    }
    positions.push({
      x: (tipPixels ? tipXTotal / tipPixels : center) - left,
      y: tipY - top,
    });
  }
  return positions;
}

function neutralizeBrightEdgeFringe(pixels: ImageData) {
  const width = pixels.width;
  const height = pixels.height;
  const alpha = new Uint8Array(width * height);
  for (let pixel = 0; pixel < alpha.length; pixel++)
    alpha[pixel] = pixels.data[pixel * 4 + 3];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixel = y * width + x;
      if (alpha[pixel] === 0) continue;
      const touchesTransparency =
        alpha[pixel - 1] === 0 ||
        alpha[pixel + 1] === 0 ||
        alpha[pixel - width] === 0 ||
        alpha[pixel + width] === 0 ||
        alpha[pixel - width - 1] === 0 ||
        alpha[pixel - width + 1] === 0 ||
        alpha[pixel + width - 1] === 0 ||
        alpha[pixel + width + 1] === 0;
      if (!touchesTransparency) continue;
      const offset = pixel * 4;
      if (
        isBrightEdgeFringe(
          pixels.data[offset],
          pixels.data[offset + 1],
          pixels.data[offset + 2],
        )
      ) {
        pixels.data[offset] = 5;
        pixels.data[offset + 1] = 3;
        pixels.data[offset + 2] = 4;
      }
    }
  }
}

function isolatePaintedMatte() {
  isolatedSheet.width = source.naturalWidth;
  isolatedSheet.height = source.naturalHeight;
  isolatedContext.drawImage(source, 0, 0);
  const pixels = isolatedContext.getImageData(
    0,
    0,
    isolatedSheet.width,
    isolatedSheet.height,
  );
  floodPaintedMatte(pixels);
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const pixel = offset / 4;
    const x = pixel % isolatedSheet.width;
    const y = Math.floor(pixel / isolatedSheet.width);
    const cellWidth = isolatedSheet.width / COLUMNS;
    const cellHeight = isolatedSheet.height / ROWS;
    const localX = x % cellWidth;
    const localY = y % cellHeight;
    const outsideUpperBaton =
      localY < cellHeight * 0.27 &&
      Math.abs(localX - cellWidth * 0.49) > cellWidth * 0.052;
    const unmistakableChecker = isPaintedMatteSeed(
      pixels.data[offset],
      pixels.data[offset + 1],
      pixels.data[offset + 2],
    );
    if (outsideUpperBaton || unmistakableChecker) pixels.data[offset + 3] = 0;
  }
  neutralizeBrightEdgeFringe(pixels);
  tipPositions = locateBatonTips(pixels);
  isolatedContext.clearRect(0, 0, isolatedSheet.width, isolatedSheet.height);
  isolatedContext.putImageData(pixels, 0, 0);
}

function drawBackdrop() {
  const gradient = ctx.createRadialGradient(300, 390, 20, 300, 390, 390);
  gradient.addColorStop(0, '#13090a');
  gradient.addColorStop(0.48, '#070607');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(196, 171, 132, 0.07)';
  ctx.lineWidth = 2;
  for (let lane = 0; lane < 5; lane++) {
    const x = 100 + lane * 100;
    ctx.beginPath();
    ctx.moveTo(300 + (x - 300) * 0.36, 420);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawTip(tipX: number, tipY: number) {
  const energy = idleTipEnergy(elapsed);
  const phase = idleTime(elapsed) / IDLE_CYCLE_MS;
  tipX += Math.sin(phase * Math.PI * 10) * 1.2;
  tipY += Math.cos(phase * Math.PI * 14) * 0.8;
  const radius = 12 + energy * 14;
  const glow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, radius);
  glow.addColorStop(0, `rgba(255, 243, 215, ${0.8 + energy * 0.2})`);
  glow.addColorStop(0.2, `rgba(255, 43, 59, ${energy})`);
  glow.addColorStop(1, 'rgba(126, 0, 18, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(tipX - radius, tipY - radius, radius * 2, radius * 2);
  ctx.translate(tipX, tipY);
  ctx.rotate(phase * Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 229, 184, ${0.45 + energy * 0.5})`;
  ctx.lineWidth = 2;
  const ray = 5 + energy * 7;
  ctx.beginPath();
  ctx.moveTo(-ray, 0);
  ctx.lineTo(ray, 0);
  ctx.moveTo(0, -ray);
  ctx.lineTo(0, ray);
  ctx.stroke();
  ctx.fillStyle = `rgba(255, 50, 67, ${0.3 + energy * 0.5})`;
  for (let mote = 0; mote < 3; mote++) {
    const angle = phase * Math.PI * 2 + (mote * Math.PI * 2) / 3;
    const distance = 10 + mote * 3 + energy * 3;
    ctx.fillRect(
      Math.cos(angle) * distance - 1,
      Math.sin(angle) * distance - 1,
      2,
      2,
    );
  }
  ctx.restore();
  host.dataset.tipEnergy = energy.toFixed(3);
  host.dataset.tipPosition = `${tipX.toFixed(2)},${tipY.toFixed(2)}`;
}

function render() {
  if (!ready) return;
  const frame = idleFrame(elapsed);
  const sourceCell = idleCellBounds(
    frame,
    isolatedSheet.width,
    isolatedSheet.height,
  );
  const sourceWidth = sourceCell.width;
  const sourceHeight = sourceCell.height;
  const visibleSourceHeight = Math.max(
    1,
    sourceHeight - IDLE_CELL_BOTTOM_GUTTER_PX,
  );
  const sourceX = sourceCell.left;
  const sourceY = sourceCell.top;
  const destinationSize = 540;
  const destinationHeight =
    destinationSize * (visibleSourceHeight / sourceHeight);
  const destinationX = (canvas.width - destinationSize) / 2;
  const destinationY = 88;

  drawBackdrop();
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    destinationX,
    destinationY + destinationSize * 0.27,
    destinationSize,
    destinationSize * 0.73,
  );
  ctx.rect(
    canvas.width / 2 - destinationSize * 0.052,
    destinationY,
    destinationSize * 0.104,
    destinationSize * 0.28,
  );
  ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    isolatedSheet,
    sourceX,
    sourceY,
    sourceWidth,
    visibleSourceHeight,
    destinationX,
    destinationY,
    destinationSize,
    destinationHeight,
  );
  ctx.restore();

  const tip = tipPositions[frame] ?? {
    x: sourceWidth * 0.49,
    y: sourceHeight * 0.02,
  };
  drawTip(
    destinationX + (tip.x / sourceWidth) * destinationSize,
    destinationY + (tip.y / sourceHeight) * destinationSize,
  );
  host.dataset.frame = String(frame);
  host.dataset.time = String(Math.round(elapsed));
  host.dataset.state = playing ? 'playing' : 'paused';
  slider.value = String(Math.round(idleTime(elapsed)));
  frameOutput.value = `${frame + 1} / ${IDLE_FRAME_COUNT}`;
}

function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent = 'Play idle';
  if (ready) {
    host.dataset.state = 'paused';
    status.textContent = 'Paused for frame inspection.';
  }
}

function tick(now: number) {
  if (!playing) return;
  elapsed = idleTime(elapsed + Math.max(0, now - previous) * rate);
  previous = Math.max(previous, now);
  render();
  raf = requestAnimationFrame(tick);
}

function resume() {
  if (!ready || playing) return;
  previous = performance.now();
  playing = true;
  play.textContent = 'Pause idle';
  status.textContent = 'Looping at the normal game presentation rate.';
  render();
  raf = requestAnimationFrame(tick);
}

play.onclick = () => {
  if (playing) pause();
  else resume();
};

slow.onclick = () => {
  rate = rate === 1 ? 0.25 : 1;
  previous = performance.now();
  slow.setAttribute('aria-pressed', String(rate === 0.25));
  status.textContent =
    rate === 0.25
      ? 'Quarter-speed inspection enabled.'
      : 'Normal-speed idle enabled.';
};

slider.oninput = () => {
  elapsed = Number(slider.value);
  pause();
  render();
};

source.onload = () => {
  isolatePaintedMatte();
  ready = true;
  play.disabled = false;
  host.dataset.matte = 'isolated';
  if (reducedMotion) {
    elapsed = 0;
    status.textContent =
      'Reduced motion is active; use the timeline to inspect.';
    render();
  } else {
    resume();
  }
};

source.onerror = () => {
  host.dataset.state = 'error';
  status.textContent = 'Could not load the idle drawings. Reload to retry.';
};

source.src = sheetUrl;
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});

function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  document.querySelector<HTMLElement>('#rotate')!.hidden = !landscape;
  if (landscape) pause();
}

window.addEventListener('resize', orientation);
orientation();
