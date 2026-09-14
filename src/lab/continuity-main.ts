import './idle.css';
import idleUrl from '../../docs/bosses/conductor/key-poses/conductor-idle-sheet-review-01.png?url';
import strokeUrl from '../../docs/bosses/conductor/key-poses/ictus-stroke-baton-fixed-03.png?url';
import windupUrl from '../../docs/bosses/conductor/key-poses/ictus-windup-fine-tips-02.png?url';
import {
  CONTINUITY_ATTACK_START_MS,
  CONTINUITY_DURATION_MS,
  CONTINUITY_SETTLE_START_MS,
  continuityMoment,
} from './continuity-score';
import { tipEnergy } from './ictus-effects';
import {
  IDLE_CELL_BOTTOM_GUTTER_PX,
  idleCellBounds,
  idleTipEnergy,
} from './idle-score';
import { isolateIdleSheet } from './idle-sheet';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">CONDUCTOR MOTION CONTINUITY REVIEW</p>
<h1>Stillness → command → stillness.</h1>
<p>One complete idle cycle flows into the approved Ictus and its rebound, then settles into idle again. This isolates character continuity; no hazards or gameplay are present.</p>
<div id="sample"><canvas width="600" height="900" aria-label="The Conductor transitioning from idle through Ictus and back to idle"></canvas></div>
<div class="row"><button id="play" disabled>Pause sequence</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
<label for="timeline">Inspect sequence <output id="phase">Lead idle · 1 / 16</output></label>
<input id="timeline" type="range" min="0" max="${CONTINUITY_DURATION_MS}" value="0" step="1" />
<p id="status" role="status">Loading approved drawings…</p>
<p>Watch the palm position, apparent scale, baton grip and tip light at both seams. If either transition jumps, we will author only the missing bridge drawings.</p>
<p><a href="${import.meta.env.BASE_URL}idle-lab.html">Idle-only review ↗</a> · <a href="${import.meta.env.BASE_URL}windup-lab.html?mode=ictus">Ictus-only review ↗</a></p>
<div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate to portrait to inspect the sequence.</p></div>`;

const host = document.querySelector<HTMLElement>('#sample')!;
const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const slider = document.querySelector<HTMLInputElement>('#timeline')!;
const phaseOutput = document.querySelector<HTMLOutputElement>('#phase')!;
const status = document.querySelector<HTMLElement>('#status')!;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const idleSource = new Image();
const windupSource = new Image();
const strokeSource = new Image();
const isolatedIdle = document.createElement('canvas');
const isolatedIdleContext = isolatedIdle.getContext('2d', {
  willReadFrequently: true,
})!;

let idleTips: { x: number; y: number }[] = [];
let ready = false;
let playing = false;
let elapsed = 0;
let previous = 0;
let rate = 1;
let raf = 0;

const windupAnchors = [
  [246, 327],
  [687, 327],
  [1123, 327],
  [1563, 327],
  [245, 763],
  [686, 763],
  [1123, 763],
  [1565, 763],
];
const strokeAnchors = [
  [245, 327],
  [677, 327],
  [1101, 327],
  [1530, 327],
  [247, 723],
  [674, 723],
  [1102, 723],
  [1535, 723],
];
const windupTips = [
  [205, 17],
  [646, 17],
  [1087, 17],
  [1525, 17],
  [205, 458],
  [646, 458],
  [1087, 458],
  [1526, 458],
];
const strokeTips = [
  [205, 17],
  [641, 20],
  [1066, 60],
  [1490, 75],
  [207, 497],
  [633, 527],
  [1054, 608],
  [1483, 600],
];

function drawBackdrop() {
  const gradient = ctx.createRadialGradient(300, 470, 30, 300, 470, 480);
  gradient.addColorStop(0, '#13090a');
  gradient.addColorStop(0.5, '#070607');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTip(x: number, y: number, energy: number) {
  const sequencePhase = elapsed / CONTINUITY_DURATION_MS;
  const radius = 11 + energy * 17;
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, `rgba(255, 243, 215, ${0.82 + energy * 0.18})`);
  glow.addColorStop(0.2, `rgba(255, 43, 59, ${energy})`);
  glow.addColorStop(1, 'rgba(126, 0, 18, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.translate(x, y);
  ctx.rotate(sequencePhase * Math.PI * 8);
  ctx.strokeStyle = `rgba(255, 229, 184, ${0.42 + energy * 0.5})`;
  ctx.lineWidth = 2;
  const ray = 5 + energy * 8;
  ctx.beginPath();
  ctx.moveTo(-ray, 0);
  ctx.lineTo(ray, 0);
  ctx.moveTo(0, -ray);
  ctx.lineTo(0, ray);
  ctx.stroke();
  ctx.restore();
}

function drawIdle(frame: number, localTime: number) {
  const cell = idleCellBounds(frame, isolatedIdle.width, isolatedIdle.height);
  const visibleHeight = Math.max(1, cell.height - IDLE_CELL_BOTTOM_GUTTER_PX);
  const destinationSize = 540;
  const destinationHeight = destinationSize * (visibleHeight / cell.height);
  const destinationX = 30;
  const destinationY = 85;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    isolatedIdle,
    cell.left,
    cell.top,
    cell.width,
    visibleHeight,
    destinationX,
    destinationY,
    destinationSize,
    destinationHeight,
  );
  ctx.restore();
  const tip = idleTips[frame] ?? { x: cell.width * 0.49, y: 4 };
  drawTip(
    destinationX + (tip.x / cell.width) * destinationSize,
    destinationY + (tip.y / cell.height) * destinationSize,
    idleTipEnergy(localTime),
  );
}

function drawIctus(
  sheetName: 'windup' | 'stroke',
  frame: number,
  localTime: number,
) {
  const source = sheetName === 'stroke' ? strokeSource : windupSource;
  const anchors = sheetName === 'stroke' ? strokeAnchors : windupAnchors;
  const tips = sheetName === 'stroke' ? strokeTips : windupTips;
  const width = source.naturalWidth / 4;
  const height = source.naturalHeight / 2;
  const sourceX = (frame % 4) * width;
  const sourceY = Math.floor(frame / 4) * height;
  // Match the approved body-motion review's whole-character presentation scale;
  // a smaller attack-preview scale would create an artificial shrink at the seam.
  const scale = 1.65;
  const drawX = 300 - (anchors[frame][0] - sourceX) * scale;
  const drawY = 500 - (anchors[frame][1] - sourceY) * scale;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    source,
    sourceX,
    sourceY,
    width,
    height,
    drawX,
    drawY,
    width * scale,
    height * scale,
  );
  ctx.restore();

  const ambient = idleTipEnergy(localTime);
  const energy = Math.max(ambient * 0.78, tipEnergy(localTime));
  drawTip(
    drawX + (tips[frame][0] - sourceX) * scale,
    drawY + (tips[frame][1] - sourceY) * scale,
    energy,
  );
}

function phaseLabel(phase: ReturnType<typeof continuityMoment>['phase']) {
  if (phase === 'lead-idle') return 'Lead idle';
  if (phase === 'settle-idle') return 'Settled idle';
  return `${phase[0].toUpperCase()}${phase.slice(1)}`;
}

function render() {
  if (!ready) return;
  const moment = continuityMoment(elapsed);
  drawBackdrop();
  if ('sheet' in moment)
    drawIctus(moment.sheet, moment.frame, moment.localTime);
  else drawIdle(moment.frame, moment.localTime);

  host.dataset.phase = moment.phase;
  host.dataset.frame = String(moment.frame);
  host.dataset.time = String(Math.round(elapsed));
  host.dataset.state = playing ? 'playing' : 'paused';
  slider.value = String(Math.round(elapsed));
  phaseOutput.value = `${phaseLabel(moment.phase)} · ${moment.frame + 1} / ${moment.phase.includes('idle') ? 16 : 8}`;
}

function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent = 'Play sequence';
  if (ready) {
    host.dataset.state = 'paused';
    status.textContent = 'Paused for seam inspection.';
  }
}

function tick(now: number) {
  if (!playing) return;
  elapsed += Math.max(0, now - previous) * rate;
  previous = Math.max(previous, now);
  if (elapsed >= CONTINUITY_DURATION_MS) elapsed %= CONTINUITY_DURATION_MS;
  render();
  raf = requestAnimationFrame(tick);
}

function resume() {
  if (!ready || playing) return;
  previous = performance.now();
  playing = true;
  play.textContent = 'Pause sequence';
  status.textContent = 'Looping idle → Ictus → idle at presentation speed.';
  render();
  raf = requestAnimationFrame(tick);
}

play.onclick = () => (playing ? pause() : resume());
slow.onclick = () => {
  rate = rate === 1 ? 0.25 : 1;
  previous = performance.now();
  slow.setAttribute('aria-pressed', String(rate === 0.25));
  status.textContent =
    rate === 0.25
      ? 'Quarter-speed seam inspection enabled.'
      : 'Normal presentation speed enabled.';
};
slider.oninput = () => {
  elapsed = Number(slider.value);
  pause();
  render();
};

function loaded() {
  if (
    !idleSource.complete ||
    !idleSource.naturalWidth ||
    !windupSource.complete ||
    !windupSource.naturalWidth ||
    !strokeSource.complete ||
    !strokeSource.naturalWidth
  )
    return;
  idleTips = isolateIdleSheet(idleSource, isolatedIdle, isolatedIdleContext);
  ready = true;
  play.disabled = false;
  host.dataset.attackStart = String(CONTINUITY_ATTACK_START_MS);
  host.dataset.settleStart = String(CONTINUITY_SETTLE_START_MS);
  if (reducedMotion) {
    status.textContent =
      'Reduced motion is active; use the timeline to inspect the sequence.';
    render();
  } else resume();
}

for (const image of [idleSource, windupSource, strokeSource]) {
  image.onload = loaded;
  image.onerror = () => {
    host.dataset.state = 'error';
    status.textContent =
      'Could not load the approved drawings. Reload to retry.';
  };
}
idleSource.src = idleUrl;
windupSource.src = windupUrl;
strokeSource.src = strokeUrl;

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
