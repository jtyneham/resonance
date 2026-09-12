import './finger.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/ictus-windup-fine-tips-02.png?url';
import idleUrl from '../../docs/bosses/conductor/key-poses/ictus-rebound-review-01.png?url';
import { WINDUP_MS, windupFrame } from './windup-score';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">2D WHOLE-HAND DRAWINGS · WIND-UP ONLY</p>
<h1>Upright → preparation.</h1>
<p>Eight raster drawings across 130 ms. A small motion study—not a finished Ictus or a new character design.</p>
<div id="sample"><canvas width="600" height="900" aria-label="Conductor 2D wind-up animation"></canvas></div>
<div class="row"><button id="play" disabled>Play wind-up</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
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
const slider = document.querySelector<HTMLInputElement>('#bend')!;
const status = document.querySelector<HTMLElement>('#status')!;
const sheet = new Image();
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
function render() {
  if (!ready) return;
  const frame = windupFrame(elapsed);
  const w = sheet.naturalWidth / 4;
  const h = sheet.naturalHeight / 2;
  const sx = (frame % 4) * w;
  const sy = Math.floor(frame / 4) * h;
  const scale = 1.65;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 900);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sheet,
    sx,
    sy,
    w,
    h,
    300 - (anchors[frame][0] - sx) * scale,
    680 - (anchors[frame][1] - sy) * scale,
    w * scale,
    h * scale,
  );
  host.dataset.frame = String(frame);
  host.dataset.time = String(elapsed);
  slider.value = String(elapsed);
  document.querySelector<HTMLOutputElement>('#angle')!.value =
    `${frame + 1} / 8`;
}
function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent = elapsed >= WINDUP_MS ? 'Replay wind-up' : 'Play wind-up';
  if (ready) host.dataset.state = 'paused';
}
function tick(now: number) {
  if (!playing) return;
  elapsed = Math.min(WINDUP_MS, elapsed + Math.max(0, now - previous) * rate);
  previous = Math.max(previous, now);
  render();
  if (elapsed >= WINDUP_MS) {
    pause();
    status.textContent =
      'Wind-up endpoint. Playback stops here for inspection; this is not an attack hold.';
  } else raf = requestAnimationFrame(tick);
}
play.onclick = () => {
  if (playing) {
    pause();
    return;
  }
  if (!ready) return;
  if (elapsed >= WINDUP_MS) elapsed = 0;
  previous = performance.now();
  playing = true;
  host.dataset.state = 'playing';
  play.textContent = 'Pause';
  status.textContent = 'Playing the 2D wind-up only.';
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
sheet.onload = () => {
  ready = true;
  play.disabled = false;
  render();
  host.dataset.state = 'ready';
  status.textContent = 'Ready. Use slow playback to inspect consistency.';
};
sheet.onerror = () => {
  host.dataset.state = 'error';
  status.textContent = 'Could not load the drawings. Reload to retry.';
};
sheet.src = sheetUrl;
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
