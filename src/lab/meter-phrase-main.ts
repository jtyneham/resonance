import './idle.css';
import './meter-phrase.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/changing-meter-3plus2-phrase-review-01.png?url';
import {
  METER_PHRASE_FRAMES,
  METER_PHRASE_MS,
  meterPhraseFrame,
  meterPhraseTime,
  phraseBeatAt,
  visiblePhraseAttacks,
} from './meter-phrase-score';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">CHANGING METER · WHOLE-HAND PHRASE 01</p>
<h1>ONE-two-three, FOUR-five.</h1>
<p>A continuous five-beat conducting phrase grouped <strong>3+2</strong>. The first and fourth beats carry the strongest wrist accents.</p>
<div class="phrase-summary"><div><strong>120 BPM</strong><span>PROVISIONAL</span></div><div><strong>20</strong><span>WHOLE-HAND DRAWINGS</span></div><div><strong>3 + 2</strong><span>ACCENT GROUPS</span></div></div>
<div id="sample" data-state="loading"><canvas width="600" height="900" aria-label="The Conductor performing a five-beat 3 plus 2 phrase"></canvas></div>
<div class="row"><button id="play" disabled>Play phrase</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
<label for="timeline">Inspect drawing <output id="frame">1 / ${METER_PHRASE_FRAMES}</output></label>
<input id="timeline" type="range" min="0" max="${METER_PHRASE_MS - 1}" value="0" step="1" />
<p class="phrase-legend">Beat 1 arc · Beat 2 rest · Beat 3 wide arc · Beat 4 pipe rank · Beat 5 arc</p>
<p id="status" role="status">Loading phrase drawings…</p>
<p>The character is one complete raster drawing per frame. Scale, wrist-core registration and brightness are calibrated against the approved Ictus presentation. Attacks and baton-tip magic remain separate live effects.</p>
<p><a href="${import.meta.env.BASE_URL}continuity-lab.html">Approved idle/Ictus continuity ↗</a> · <a href="${import.meta.env.BASE_URL}">Return to Resonance ↗</a></p>
<div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate to portrait to inspect the phrase.</p></div>`;

const host = document.querySelector<HTMLElement>('#sample')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const slider = document.querySelector<HTMLInputElement>('#timeline')!;
const frameOutput = document.querySelector<HTMLOutputElement>('#frame')!;
const status = document.querySelector<HTMLElement>('#status')!;
const source = new Image();
const cleaned = document.createElement('canvas');
const cleanedContext = cleaned.getContext('2d', { willReadFrequently: true })!;

let ready = false;
let playing = false;
let elapsed = 0;
let previous = 0;
let rate = 1;
let raf = 0;
let tips: { x: number; y: number }[] = [];

function cellBounds(frame: number) {
  const column = frame % 5;
  const row = Math.floor(frame / 5);
  const left = Math.floor((column * cleaned.width) / 5);
  const right = Math.floor(((column + 1) * cleaned.width) / 5);
  const top = Math.floor((row * cleaned.height) / 4);
  const bottom = Math.floor(((row + 1) * cleaned.height) / 4);
  return { left, top, width: right - left, height: bottom - top };
}

function keepLargestCellComponent(pixels: ImageData, frame: number) {
  const cell = cellBounds(frame);
  const visited = new Uint8Array(cell.width * cell.height);
  const components: number[][] = [];
  const stack: number[] = [];

  for (let localY = 0; localY < cell.height; localY++) {
    for (let localX = 0; localX < cell.width; localX++) {
      const local = localY * cell.width + localX;
      const sourceOffset =
        ((cell.top + localY) * pixels.width + cell.left + localX) * 4;
      if (visited[local] || pixels.data[sourceOffset + 3] === 0) continue;
      const component: number[] = [];
      visited[local] = 1;
      stack.push(local);
      while (stack.length) {
        const current = stack.pop()!;
        component.push(current);
        const x = current % cell.width;
        const y = Math.floor(current / cell.width);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if ((!dx && !dy) || x + dx < 0 || x + dx >= cell.width) continue;
            if (y + dy < 0 || y + dy >= cell.height) continue;
            const neighbor = (y + dy) * cell.width + x + dx;
            if (visited[neighbor]) continue;
            const neighborOffset =
              ((cell.top + y + dy) * pixels.width + cell.left + x + dx) * 4;
            if (pixels.data[neighborOffset + 3] === 0) continue;
            visited[neighbor] = 1;
            stack.push(neighbor);
          }
        }
      }
      components.push(component);
    }
  }

  const largest = components.reduce(
    (best, component) => (component.length > best.length ? component : best),
    [] as number[],
  );
  const keep = new Set(largest);
  for (const component of components) {
    if (component === largest) continue;
    for (const local of component) {
      if (keep.has(local)) continue;
      const x = local % cell.width;
      const y = Math.floor(local / cell.width);
      pixels.data[((cell.top + y) * pixels.width + cell.left + x) * 4 + 3] = 0;
    }
  }
}

function prepareSheet() {
  cleaned.width = source.naturalWidth;
  cleaned.height = source.naturalHeight;
  cleanedContext.drawImage(source, 0, 0);
  const pixels = cleanedContext.getImageData(
    0,
    0,
    cleaned.width,
    cleaned.height,
  );
  for (let pixel = 0; pixel < pixels.data.length; pixel += 4) {
    if (pixels.data[pixel + 3] < 72) pixels.data[pixel + 3] = 0;
  }
  for (let frame = 0; frame < METER_PHRASE_FRAMES; frame++)
    keepLargestCellComponent(pixels, frame);
  cleanedContext.putImageData(pixels, 0, 0);

  tips = Array.from({ length: METER_PHRASE_FRAMES }, (_, frame) => {
    const cell = cellBounds(frame);
    const anchorX = cell.left + cell.width * 0.5;
    const anchorY = cell.top + cell.height * 0.72;
    let bestDistance = -1;
    let bestX = anchorX;
    let bestY = cell.top;
    for (let y = cell.top; y < cell.top + cell.height; y++) {
      for (let x = cell.left; x < cell.left + cell.width; x++) {
        const offset = (y * pixels.width + x) * 4;
        const alpha = pixels.data[offset + 3];
        const red = pixels.data[offset];
        const green = pixels.data[offset + 1];
        const blue = pixels.data[offset + 2];
        const light = red * 0.3 + green * 0.59 + blue * 0.11;
        if (
          alpha < 150 ||
          light < 155 ||
          Math.max(red, green, blue) - Math.min(red, green, blue) > 135
        )
          continue;
        const distance = Math.hypot(x - anchorX, y - anchorY);
        if (distance > bestDistance) {
          bestDistance = distance;
          bestX = x;
          bestY = y;
        }
      }
    }
    return { x: bestX - cell.left, y: bestY - cell.top };
  });
}

function drawStage() {
  const gradient = ctx.createRadialGradient(300, 330, 20, 300, 330, 600);
  gradient.addColorStop(0, '#14090a');
  gradient.addColorStop(0.48, '#060506');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(207, 184, 143, 0.13)';
  ctx.lineWidth = 2;
  for (let lane = 0; lane < 6; lane++) {
    const bottomX = 48 + lane * 102;
    const topX = 300 + (bottomX - 300) * 0.31;
    ctx.beginPath();
    ctx.moveTo(topX, 510);
    ctx.lineTo(bottomX, 900);
    ctx.stroke();
  }
}

function laneEdges(lane: number, width: number, y: number) {
  const perspective = Math.max(0.31, (y - 120) / 780);
  const leftBottom = 48 + lane * 102;
  const rightBottom = 48 + (lane + width) * 102;
  return {
    left: 300 + (leftBottom - 300) * perspective,
    right: 300 + (rightBottom - 300) * perspective,
  };
}

function drawArc(lane: number, width: number, y: number, strong: boolean) {
  const { left, right } = laneEdges(lane, width, y);
  const center = (left + right) / 2;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.strokeStyle = `rgba(111, 0, 15, ${strong ? 0.82 : 0.62})`;
  ctx.lineWidth = strong ? 16 : 12;
  ctx.beginPath();
  ctx.moveTo(left + 5, y);
  ctx.quadraticCurveTo(center, y - 15 - width * 4, right - 5, y);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255, 38, 55, ${strong ? 0.96 : 0.82})`;
  ctx.lineWidth = strong ? 5 : 3;
  ctx.stroke();
  ctx.restore();
}

function drawPipes(lane: number, width: number, y: number) {
  const { left, right } = laneEdges(lane, width, y);
  const pipeGap = 5;
  const pipeWidth = (right - left - pipeGap * (width + 1)) / width;
  ctx.save();
  for (let pipe = 0; pipe < width; pipe++) {
    const x = left + pipeGap + pipe * (pipeWidth + pipeGap);
    const height = 92 + pipe * 15;
    const top = y - height;
    ctx.fillStyle = '#2a080a';
    ctx.strokeStyle = '#d6b071';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, top, pipeWidth, height, [
      pipeWidth / 2,
      pipeWidth / 2,
      2,
      2,
    ]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f0dec0';
    ctx.fillRect(x + 5, top + 8, Math.max(2, pipeWidth * 0.14), height - 16);
    ctx.fillStyle = '#090405';
    ctx.fillRect(
      x + pipeWidth * 0.28,
      top + height * 0.36,
      pipeWidth * 0.52,
      10,
    );
    ctx.strokeStyle = '#7e1220';
    ctx.strokeRect(
      x + pipeWidth * 0.27,
      top + height * 0.34,
      pipeWidth * 0.54,
      14,
    );
  }
  ctx.restore();
}

function drawAttacks() {
  const attacks = visiblePhraseAttacks(elapsed);
  for (const release of attacks) {
    const y =
      release.attack.kind === 'pipes'
        ? 710 + release.progress * 190
        : 620 + release.progress * 280;
    if (release.attack.kind === 'arc')
      drawArc(
        release.attack.lane,
        release.attack.width,
        y,
        release.accent === 'strong',
      );
    else drawPipes(release.attack.lane, release.attack.width, y);
  }
  host.dataset.attacks = String(attacks.length);
}

function drawTip(x: number, y: number) {
  const beat = phraseBeatAt(elapsed);
  const sinceBeat = meterPhraseTime(elapsed) - beat.at;
  const pulse = Math.max(0, 1 - sinceBeat / 180);
  const energy = 0.42 + pulse * (beat.accent === 'strong' ? 0.58 : 0.3);
  const radius = 9 + energy * 15;
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, `rgba(255, 239, 205, ${0.75 + energy * 0.2})`);
  glow.addColorStop(0.2, `rgba(255, 42, 58, ${energy})`);
  glow.addColorStop(1, 'rgba(125, 0, 16, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.translate(x, y);
  ctx.rotate((meterPhraseTime(elapsed) / METER_PHRASE_MS) * Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 221, 172, ${0.4 + energy * 0.5})`;
  ctx.lineWidth = 2;
  const ray = 5 + energy * 7;
  ctx.beginPath();
  ctx.moveTo(-ray, 0);
  ctx.lineTo(ray, 0);
  ctx.moveTo(0, -ray);
  ctx.lineTo(0, ray);
  ctx.stroke();
  ctx.restore();
}

function drawBeatStrip() {
  const active = phraseBeatAt(elapsed);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 20px Georgia';
  ctx.fillStyle = '#c48a48';
  ctx.fillText('3 + 2', 300, 42);
  for (let beat = 1; beat <= 5; beat++) {
    const strong = beat === 1 || beat === 4;
    const x = 148 + (beat - 1) * 75 + (beat > 3 ? 18 : 0);
    ctx.beginPath();
    ctx.arc(x, 70, strong ? 12 : 8, 0, Math.PI * 2);
    ctx.fillStyle =
      beat === active.beat ? (strong ? '#ebb05d' : '#e6d4b4') : '#493a2b';
    ctx.fill();
    ctx.fillStyle = beat === active.beat ? '#130c07' : '#a49379';
    ctx.font = `${strong ? '700 ' : ''}10px Arial`;
    ctx.fillText(String(beat), x, 74);
  }
  ctx.restore();
}

function render() {
  if (!ready) return;
  const frame = meterPhraseFrame(elapsed);
  const cell = cellBounds(frame);
  // Match the approved Ictus palm width rather than filling the review canvas.
  // The generated cells are smaller than the Ictus source cells, so this is a
  // measured presentation scale, shared unchanged by all twenty drawings.
  const scale = 1.8;
  const anchorX = cell.width * 0.5;
  const anchorY = cell.height * 0.72;
  const destinationX = 300 - anchorX * scale;
  const destinationY = 450 - anchorY * scale;

  drawStage();
  drawBeatStrip();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.filter = 'brightness(1.12) saturate(0.96)';
  ctx.drawImage(
    cleaned,
    cell.left,
    cell.top,
    cell.width,
    cell.height,
    destinationX,
    destinationY,
    cell.width * scale,
    cell.height * scale,
  );
  ctx.restore();
  const tip = tips[frame];
  drawTip(destinationX + tip.x * scale, destinationY + tip.y * scale);
  drawAttacks();

  const beat = phraseBeatAt(elapsed);
  host.dataset.frame = String(frame);
  host.dataset.beat = String(beat.beat);
  host.dataset.accent = beat.accent;
  host.dataset.time = String(Math.round(meterPhraseTime(elapsed)));
  host.dataset.state = playing ? 'playing' : 'paused';
  slider.value = String(Math.round(meterPhraseTime(elapsed)));
  frameOutput.value = `${frame + 1} / ${METER_PHRASE_FRAMES} · beat ${beat.beat}`;
}

function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent = 'Play phrase';
  if (ready) host.dataset.state = 'paused';
}

function tick(now: number) {
  if (!playing) return;
  elapsed = meterPhraseTime(elapsed + Math.max(0, now - previous) * rate);
  previous = Math.max(previous, now);
  render();
  raf = requestAnimationFrame(tick);
}

function resume() {
  if (!ready || playing) return;
  previous = performance.now();
  playing = true;
  play.textContent = 'Pause phrase';
  status.textContent = 'Looping the five-beat phrase at the provisional tempo.';
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
      ? 'Quarter-speed inspection enabled.'
      : 'Normal phrase speed enabled.';
};
slider.oninput = () => {
  elapsed = Number(slider.value);
  pause();
  render();
};

source.onload = () => {
  prepareSheet();
  ready = true;
  play.disabled = false;
  host.dataset.asset = 'whole-hand-frames';
  resume();
};
source.onerror = () => {
  host.dataset.state = 'error';
  status.textContent = 'Could not load the phrase drawings. Reload to retry.';
};
source.src = sheetUrl;

function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  document.querySelector<HTMLElement>('#rotate')!.hidden = !landscape;
  if (landscape) pause();
}
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});
window.addEventListener('resize', orientation);
orientation();
