import './finger.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/ictus-windup-fine-tips-02.png?url';
import strokeUrl from '../../docs/bosses/conductor/key-poses/ictus-stroke-baton-fixed-03.png?url';
import idleUrl from '../../docs/bosses/conductor/key-poses/ictus-rebound-review-01.png?url';
import {
  ICTUS_MS,
  STRIKE_END_MS,
  WINDUP_MS,
  ictusPose,
  windupFrame,
  type IctusPose,
} from './windup-score';
import {
  ICTUS_ATTACK_PREVIEW_MS,
  ICTUS_RELEASE_MS,
  tipEnergy,
  visibleAttacks,
} from './ictus-effects';

const mode = new URLSearchParams(location.search).get('mode');
const attackPreview = mode === 'attack';
const fullIctus = mode === 'ictus' || attackPreview;
const combined = mode === 'stroke' || fullIctus;
const duration = attackPreview
  ? ICTUS_ATTACK_PREVIEW_MS
  : fullIctus
    ? ICTUS_MS
    : combined
      ? STRIKE_END_MS
      : WINDUP_MS;
const actionName = attackPreview
  ? 'attack preview'
  : fullIctus
    ? 'full Ictus'
    : combined
      ? 'sequence'
      : 'wind-up';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">2D WHOLE-HAND DRAWINGS · WIND-UP ONLY</p>
<h1>Upright → preparation.</h1>
<p>Eight raster drawings across 130 ms. A small motion study—not a finished Ictus or a new character design.</p>
<div id="sample"><canvas width="600" height="900" aria-label="Conductor 2D wind-up animation"></canvas></div>
<div class="row"><button id="play" disabled>Play wind-up</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
<button id="recovery" class="section-play" hidden>Play recovery only</button>
<label for="bend">Inspect drawing <output id="angle">1 / 8</output></label>
<input id="bend" type="range" min="0" max="130" value="0" step="1" />
<p id="status" role="status">Loading drawings…</p>
<p>No 3D, image warping or crossfades. Check for changing anatomy or details as well as the movement. Baton-tip effects are not included.</p>
<p><a href="${idleUrl}" target="_blank" rel="noopener">Approved upright artwork ↗</a> · <a href="${import.meta.env.BASE_URL}wrist-lab.html">Approved timing reference ↗</a></p>
<div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate to portrait to inspect the study.</p></div>`;
const host = document.querySelector<HTMLElement>('#sample')!;
const canvas = document.querySelector('canvas')!;
// Explicit rendered dimensions prevent the tall source canvas from expanding
// the grid row past the fixed mobile stage and underneath the controls.
canvas.style.height = 'min(49svh, 440px)';
canvas.style.width = 'auto';
const ctx = canvas.getContext('2d')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const recovery = document.querySelector<HTMLButtonElement>('#recovery')!;
const slider = document.querySelector<HTMLInputElement>('#bend')!;
const status = document.querySelector<HTMLElement>('#status')!;
const sheet = new Image();
const stroke = new Image();
if (combined) {
  document.querySelector('.eyebrow')!.textContent =
    '2D WIND-UP + FAST WRIST STROKE';
  document.querySelector('h1')!.textContent = 'Preparation → strike.';
  document.querySelector('h1 + p')!.textContent =
    '130 ms preparation followed by a 130 ms wrist stroke. Inspect together at normal or quarter speed.';
  canvas.setAttribute(
    'aria-label',
    'Conductor wind-up followed by pointing baton toward player',
  );
  slider.max = String(duration);
  play.textContent = 'Play sequence';
}
if (fullIctus) {
  document.querySelector('.eyebrow')!.textContent = 'COMPLETE 2D ICTUS MOTION';
  document.querySelector('h1')!.textContent = 'Wind-up → strike → recovery.';
  document.querySelector('h1 + p')!.textContent =
    'A fast 260 ms attack followed immediately by a measured 940 ms return to upright idle.';
  canvas.setAttribute(
    'aria-label',
    'Complete Conductor Ictus motion returning to upright idle',
  );
  play.textContent = 'Play full Ictus';
  recovery.hidden = false;
}
if (attackPreview) {
  document.querySelector('.eyebrow')!.textContent =
    'ICTUS ATTACK-RELEASE STUDY';
  document.querySelector('h1')!.textContent = 'Gesture → release → phrase.';
  document.querySelector('h1 + p')!.textContent =
    'The baton charge and red-arc phrase are separate from the approved character drawings.';
  canvas.setAttribute(
    'aria-label',
    'Conductor Ictus with crimson tip light and an authored five-lane attack phrase',
  );
  play.textContent = 'Play attack preview';
  recovery.hidden = true;
  document.querySelector('#status + p')!.textContent =
    'The character remains whole-frame 2D. The tracked baton light and moving lane attacks are separate animated effects.';
}
const comparison = document.createElement('p');
comparison.innerHTML = attackPreview
  ? '<a href="?mode=ictus">Approved body motion only ↗</a>'
  : fullIctus
    ? '<a href="?mode=attack">Ictus attack-release preview ↗</a>'
    : `<a href="?mode=${combined ? 'ictus' : 'stroke'}">${combined ? 'Complete Ictus with recovery' : 'Wind-up + corrected stroke'} ↗</a>`;
document.querySelector('main')!.append(comparison);
let ready = false;
let elapsed = 0;
let playing = false;
let previous = 0;
let raf = 0;
let rate = 1;
// Measured wrist-core positions within the whole sheet. Registration only;
// each complete drawing keeps its own pixels and a constant scale.
const anchors = [
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

function drawStaff() {
  ctx.save();
  ctx.strokeStyle = 'rgba(202, 185, 150, 0.13)';
  ctx.lineWidth = 2;
  for (let lane = 0; lane < 5; lane++) {
    const x = 96 + lane * 102;
    ctx.beginPath();
    ctx.moveTo(300 + (x - 300) * 0.3, 440);
    ctx.lineTo(x, 900);
    ctx.stroke();
  }
  ctx.restore();
}

function drawArc(lane: number, width: number, y: number, accent: number) {
  const left = 48 + lane * 102;
  const right = 48 + (lane + width) * 102;
  const center = (left + right) / 2;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.strokeStyle = `rgba(117, 0, 14, ${0.38 + accent * 0.22})`;
  ctx.lineWidth = 12 + accent * 5;
  ctx.beginPath();
  ctx.moveTo(left + 7, y);
  ctx.quadraticCurveTo(center, y - 20 - width * 3, right - 7, y);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255, 35, 53, ${0.68 + accent * 0.25})`;
  ctx.lineWidth = 3 + accent * 2;
  ctx.stroke();
  ctx.restore();
}

function drawAttackLayer() {
  const attacks = visibleAttacks(elapsed);
  for (const attack of attacks) {
    // The release originates just below the character so the hazard reads as
    // entering the playfield, rather than being painted across the hand.
    const y = 620 + attack.progress * 280;
    drawArc(attack.lane, attack.width, y, attack.accent);
  }
  host.dataset.attacks = String(attacks.length);
}

function drawTip(
  poseSheet: 'windup' | 'stroke',
  frame: number,
  sourceX: number,
  sourceY: number,
  sourceCellX: number,
  sourceCellY: number,
  scale: number,
) {
  const energy = tipEnergy(elapsed);
  if (energy <= 0) return;
  const tips = poseSheet === 'stroke' ? strokeTips : windupTips;
  const [tipX, tipY] = tips[frame];
  const x = sourceX + (tipX - sourceCellX) * scale;
  const y = sourceY + (tipY - sourceCellY) * scale;
  const radius = 8 + energy * 24;
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, `rgba(255, 242, 204, ${energy})`);
  glow.addColorStop(0.18, `rgba(255, 42, 58, ${energy * 0.95})`);
  glow.addColorStop(1, 'rgba(125, 0, 15, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  if (elapsed >= ICTUS_RELEASE_MS && elapsed < ICTUS_RELEASE_MS + 45) {
    const flash = 1 - (elapsed - ICTUS_RELEASE_MS) / 45;
    ctx.strokeStyle = `rgba(255, 224, 177, ${flash})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 24 * flash, y);
    ctx.lineTo(x + 24 * flash, y);
    ctx.moveTo(x, y - 24 * flash);
    ctx.lineTo(x, y + 24 * flash);
    ctx.stroke();
  }
  ctx.restore();
}
function render() {
  if (!ready) return;
  const pose: IctusPose = fullIctus
    ? ictusPose(elapsed)
    : {
        phase: combined && elapsed >= WINDUP_MS ? 'stroke' : 'windup',
        sheet: combined && elapsed >= WINDUP_MS ? 'stroke' : 'windup',
        frame: windupFrame(
          combined && elapsed >= WINDUP_MS ? elapsed - WINDUP_MS : elapsed,
        ),
      };
  const frame = pose.frame;
  const source = pose.sheet === 'stroke' ? stroke : sheet;
  const registration = pose.sheet === 'stroke' ? strokeAnchors : anchors;
  const w = source.naturalWidth / 4;
  const h = source.naturalHeight / 2;
  const sx = (frame % 4) * w;
  const sy = Math.floor(frame / 4) * h;
  const scale = attackPreview ? 1.25 : 1.65;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 900);
  if (attackPreview) drawStaff();
  ctx.imageSmoothingEnabled = false;
  const sourceX = 300 - (registration[frame][0] - sx) * scale;
  const sourceY =
    (attackPreview ? 450 : 680) - (registration[frame][1] - sy) * scale;
  ctx.drawImage(source, sx, sy, w, h, sourceX, sourceY, w * scale, h * scale);
  if (attackPreview) {
    drawTip(pose.sheet, frame, sourceX, sourceY, sx, sy, scale);
    drawAttackLayer();
  }
  host.dataset.frame = String(frame);
  host.dataset.phase = pose.phase;
  host.dataset.sheet = pose.sheet;
  host.dataset.release =
    attackPreview && elapsed >= ICTUS_RELEASE_MS ? 'released' : 'charging';
  host.dataset.time = String(elapsed);
  slider.value = String(elapsed);
  document.querySelector<HTMLOutputElement>('#angle')!.value =
    `${pose.phase[0].toUpperCase()}${pose.phase.slice(1)} · ${frame + 1} / 8`;
}
function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent = `${elapsed >= duration ? 'Replay' : 'Play'} ${actionName}`;
  if (ready) host.dataset.state = 'paused';
}
function tick(now: number) {
  if (!playing) return;
  elapsed = Math.min(duration, elapsed + Math.max(0, now - previous) * rate);
  previous = Math.max(previous, now);
  render();
  if (elapsed >= duration) {
    pause();
    status.textContent = fullIctus
      ? 'Back in upright idle.'
      : 'Endpoint inspection. Playback stops here; recovery is not included yet.';
  } else raf = requestAnimationFrame(tick);
}
play.onclick = () => {
  if (playing) {
    pause();
    return;
  }
  if (!ready) return;
  if (elapsed >= duration) elapsed = 0;
  previous = performance.now();
  playing = true;
  host.dataset.state = 'playing';
  play.textContent = 'Pause';
  status.textContent = combined
    ? 'Playing preparation and wrist stroke.'
    : 'Playing the 2D wind-up only.';
  render();
  raf = requestAnimationFrame(tick);
};
recovery.onclick = () => {
  if (!ready) return;
  pause();
  elapsed = STRIKE_END_MS;
  previous = performance.now();
  playing = true;
  host.dataset.state = 'playing';
  play.textContent = 'Pause';
  status.textContent = 'Playing the recovery from the first rebound frame.';
  render();
  raf = requestAnimationFrame(tick);
};
slow.onclick = () => {
  rate = rate === 1 ? 0.25 : 1;
  previous = performance.now();
  slow.setAttribute('aria-pressed', String(rate === 0.25));
};
slider.oninput = () => {
  elapsed = Number(slider.value);
  pause();
  render();
};
function loaded() {
  if (
    !sheet.complete ||
    !sheet.naturalWidth ||
    (combined && (!stroke.complete || !stroke.naturalWidth))
  )
    return;
  ready = true;
  play.disabled = false;
  render();
  host.dataset.state = 'ready';
  status.textContent = 'Ready. Use slow playback to inspect consistency.';
}
sheet.onload = loaded;
stroke.onload = loaded;
sheet.onerror = () => {
  host.dataset.state = 'error';
  status.textContent = 'Could not load the drawings. Reload to retry.';
};
stroke.onerror = sheet.onerror;
sheet.src = sheetUrl;
if (combined) stroke.src = strokeUrl;
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
