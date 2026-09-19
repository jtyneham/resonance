import './idle.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/conductor-idle-sheet-review-03.png?url';
import {
  IDLE_CELL_BOTTOM_GUTTER_PX,
  IDLE_CYCLE_MS,
  IDLE_FRAME_COUNT,
  idleCellBounds,
  idleFloatOffset,
  idleFrame,
  idleTime,
  idleTipEnergy,
} from './idle-score';
import { isolateIdleSheet } from './idle-sheet';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">2D WHOLE-HAND DRAWINGS · IDLE REVIEW</p>
<h1>Upright, watchful, restrained.</h1>
<p>The whole hand floats through a seamless two-second rise and fall. Sixteen complete drawings add restrained finger, cloth and ornament follow-through as gravity changes direction.</p>
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
  const floatOffset = idleFloatOffset(elapsed);
  // Frame 1 is derived from the approved Ictus cell. Register both previews to
  // that cell's measured wrist-core anchor rather than centering the full cell.
  const destinationX = 300 - (246 / 443.5) * destinationSize;
  const destinationY = 500 - (327 / 443.5) * destinationSize + floatOffset;

  drawBackdrop();
  ctx.save();
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
  host.dataset.floatOffset = floatOffset.toFixed(3);
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
  tipPositions = isolateIdleSheet(source, isolatedSheet, isolatedContext);
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
