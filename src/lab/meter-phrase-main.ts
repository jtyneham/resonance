import './idle.css';
import './meter-phrase.css';
import sheetUrl from '../../docs/bosses/conductor/key-poses/changing-meter-3plus2-phrase-review-01.png?url';
import bridgeUrl from '../../docs/bosses/conductor/key-poses/changing-meter-return-bridge-review-01.png?url';
import ictusUrl from '../../docs/bosses/conductor/key-poses/ictus-windup-fine-tips-02.png?url';
import {
  METER_PHRASE_FRAMES,
  METER_PHRASE_MS,
  meterPhrasePose,
  meterPhraseTime,
  phraseBeatAt,
  visiblePhraseAttacks,
} from './meter-phrase-score';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">CHANGING METER · WHOLE-HAND PHRASE 01</p>
<h1>ONE-two-three, FOUR-five.</h1>
<p>A five-beat conducting phrase grouped <strong>3+2</strong>. Drawings are deliberately retimed so beats one and four land on the clearest wrist accents.</p>
<div class="phrase-summary"><div><strong>120 BPM</strong><span>PROVISIONAL</span></div><div><strong>20 + 2</strong><span>PHRASE + BRIDGE</span></div><div><strong>3 + 2</strong><span>ACCENT GROUPS</span></div></div>
<div id="sample" data-state="loading"><canvas width="600" height="900" aria-label="The Conductor performing a five-beat 3 plus 2 phrase"></canvas></div>
<div class="row three"><button id="play" disabled>Play phrase</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button><button id="compare" aria-pressed="false" disabled>Compare Ictus</button></div>
<div id="comparison-controls" class="row three compare-switch" hidden><button data-view="phrase" aria-pressed="false">Phrase</button><button data-view="ictus" aria-pressed="false">Approved Ictus</button><button data-view="overlay" aria-pressed="true">Overlay</button></div>
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
const compare = document.querySelector<HTMLButtonElement>('#compare')!;
const comparisonControls = document.querySelector<HTMLElement>(
  '#comparison-controls',
)!;
const comparisonButtons = Array.from(
  comparisonControls.querySelectorAll<HTMLButtonElement>('[data-view]'),
);
const slider = document.querySelector<HTMLInputElement>('#timeline')!;
const frameOutput = document.querySelector<HTMLOutputElement>('#frame')!;
const status = document.querySelector<HTMLElement>('#status')!;
const source = new Image();
const bridgeSource = new Image();
const ictusSource = new Image();
const cleaned = document.createElement('canvas');
const cleanedContext = cleaned.getContext('2d', { willReadFrequently: true })!;
const bridgeCleaned = document.createElement('canvas');
const bridgeContext = bridgeCleaned.getContext('2d', {
  willReadFrequently: true,
})!;

let ready = false;
let playing = false;
let elapsed = 0;
let previous = 0;
let rate = 1;
let raf = 0;
let loadedAssets = 0;
let comparing = false;
let comparisonReturnTime = 0;
let comparisonView: 'phrase' | 'ictus' | 'overlay' = 'overlay';
let tips: { x: number; y: number }[] = [];
let bridgeTips: { x: number; y: number }[] = [];

function cellBounds(
  sheet: HTMLCanvasElement,
  frame: number,
  columns: number,
  rows: number,
) {
  const column = frame % columns;
  const row = Math.floor(frame / columns);
  const left = Math.floor((column * sheet.width) / columns);
  const right = Math.floor(((column + 1) * sheet.width) / columns);
  const top = Math.floor((row * sheet.height) / rows);
  const bottom = Math.floor(((row + 1) * sheet.height) / rows);
  return { left, top, width: right - left, height: bottom - top };
}

function keepLargestCellComponent(
  pixels: ImageData,
  cell: ReturnType<typeof cellBounds>,
) {
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

function prepareSheet(
  sourceImage: HTMLImageElement,
  target: HTMLCanvasElement,
  targetContext: CanvasRenderingContext2D,
  frameCount: number,
  columns: number,
  rows: number,
  anchorYRatio: number,
) {
  target.width = sourceImage.naturalWidth;
  target.height = sourceImage.naturalHeight;
  targetContext.drawImage(sourceImage, 0, 0);
  const pixels = targetContext.getImageData(0, 0, target.width, target.height);
  for (let pixel = 0; pixel < pixels.data.length; pixel += 4) {
    if (pixels.data[pixel + 3] < 72) pixels.data[pixel + 3] = 0;
  }
  for (let frame = 0; frame < frameCount; frame++)
    keepLargestCellComponent(pixels, cellBounds(target, frame, columns, rows));
  targetContext.putImageData(pixels, 0, 0);

  return Array.from({ length: frameCount }, (_, frame) => {
    const cell = cellBounds(target, frame, columns, rows);
    const anchorX = cell.left + cell.width * 0.5;
    const anchorY = cell.top + cell.height * anchorYRatio;
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
  const sinceBeat =
    (meterPhraseTime(elapsed) - beat.at + METER_PHRASE_MS) % METER_PHRASE_MS;
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
  if (beat.attack && sinceBeat < 105) {
    const release = sinceBeat / 105;
    ctx.strokeStyle = `rgba(255, 231, 190, ${1 - release})`;
    ctx.lineWidth = 3 - release * 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 10 + release * 28, 0, Math.PI * 2);
    ctx.stroke();
  }
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

function drawComparison() {
  drawStage();
  const phraseCell = cellBounds(cleaned, 0, 5, 4);
  const phraseScale = 1.96;
  const phraseAnchorX = phraseCell.width * 0.5;
  const phraseAnchorY = phraseCell.height * 0.72;
  const ictusCell = {
    left: 0,
    top: 0,
    width: Math.floor(ictusSource.naturalWidth / 4),
    height: Math.floor(ictusSource.naturalHeight / 2),
  };
  const ictusScale = 1.25;

  const drawPhrase = (alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.filter = 'brightness(1.12) saturate(0.96)';
    ctx.drawImage(
      cleaned,
      phraseCell.left,
      phraseCell.top,
      phraseCell.width,
      phraseCell.height,
      300 - phraseAnchorX * phraseScale,
      450 - phraseAnchorY * phraseScale,
      phraseCell.width * phraseScale,
      phraseCell.height * phraseScale,
    );
    ctx.restore();
  };

  const drawIctus = (alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(
      ictusSource,
      ictusCell.left,
      ictusCell.top,
      ictusCell.width,
      ictusCell.height,
      300 - 246 * ictusScale,
      450 - 327 * ictusScale,
      ictusCell.width * ictusScale,
      ictusCell.height * ictusScale,
    );
    ctx.restore();
  };

  if (comparisonView === 'phrase') drawPhrase();
  if (comparisonView === 'ictus') drawIctus();
  if (comparisonView === 'overlay') {
    drawPhrase(0.58);
    drawIctus(0.58);
  }

  ctx.textAlign = 'center';
  ctx.font = '700 12px Arial';
  ctx.fillStyle = '#d6b071';
  ctx.fillText(
    comparisonView === 'phrase'
      ? 'CURRENT PHRASE · ACTUAL SCALE'
      : comparisonView === 'ictus'
        ? 'APPROVED ICTUS · ACTUAL SCALE'
        : 'PHRASE + APPROVED ICTUS · OVERLAY',
    300,
    95,
  );
  ctx.font = '10px Arial';
  ctx.fillStyle = '#817565';
  ctx.fillText('fixed wrist-core anchor · no comparison resizing', 300, 825);

  host.dataset.mode = 'compare';
  host.dataset.sheet = comparisonView;
  host.dataset.comparison = comparisonView;
  host.dataset.state = 'paused';
  frameOutput.value = `${comparisonView} · actual scale`;
}

function render() {
  if (!ready) return;
  if (comparing) {
    drawComparison();
    return;
  }
  const pose = meterPhrasePose(elapsed);
  const poseSheet = pose.sheet === 'phrase' ? cleaned : bridgeCleaned;
  const cell =
    pose.sheet === 'phrase'
      ? cellBounds(poseSheet, pose.frame, 5, 4)
      : cellBounds(poseSheet, pose.frame, 4, 1);
  const scale = pose.sheet === 'phrase' ? 1.96 : 0.76;
  const anchorX = cell.width * 0.5;
  const anchorY = cell.height * (pose.sheet === 'phrase' ? 0.72 : 0.66);
  const destinationX = 300 - anchorX * scale;
  const destinationY = 450 - anchorY * scale;

  drawStage();
  drawBeatStrip();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.filter =
    pose.sheet === 'phrase'
      ? 'brightness(1.12) saturate(0.96)'
      : 'brightness(0.9) saturate(0.9)';
  ctx.drawImage(
    poseSheet,
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
  const tip =
    pose.sheet === 'phrase' ? tips[pose.frame] : bridgeTips[pose.frame];
  drawTip(destinationX + tip.x * scale, destinationY + tip.y * scale);
  drawAttacks();

  const beat = phraseBeatAt(elapsed);
  host.dataset.mode = 'phrase';
  host.dataset.sheet = pose.sheet;
  host.dataset.frame = String(pose.frame);
  host.dataset.beat = String(beat.beat);
  host.dataset.accent = beat.accent;
  host.dataset.time = String(Math.round(meterPhraseTime(elapsed)));
  host.dataset.state = playing ? 'playing' : 'paused';
  slider.value = String(Math.round(meterPhraseTime(elapsed)));
  frameOutput.value = `${pose.sheet === 'phrase' ? pose.frame + 1 : `bridge ${pose.frame - 1}`} · beat ${beat.beat}`;
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
  if (!ready || playing || comparing) return;
  previous = performance.now();
  playing = true;
  play.textContent = 'Pause phrase';
  status.textContent = 'Looping the five-beat phrase at the provisional tempo.';
  render();
  raf = requestAnimationFrame(tick);
}

play.onclick = () => {
  if (comparing) {
    comparing = false;
    elapsed = comparisonReturnTime;
    compare.setAttribute('aria-pressed', 'false');
    compare.textContent = 'Compare Ictus';
    comparisonControls.hidden = true;
  }
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
      : 'Normal phrase speed enabled.';
};
slider.oninput = () => {
  comparing = false;
  compare.setAttribute('aria-pressed', 'false');
  compare.textContent = 'Compare Ictus';
  comparisonControls.hidden = true;
  elapsed = Number(slider.value);
  pause();
  render();
};

compare.onclick = () => {
  if (!ready) return;
  if (!comparing) {
    comparisonReturnTime = elapsed;
    pause();
    comparing = true;
    comparisonView = 'overlay';
    compare.setAttribute('aria-pressed', 'true');
    compare.textContent = 'Exit compare';
    comparisonControls.hidden = false;
    for (const button of comparisonButtons)
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.view === comparisonView),
      );
    status.textContent =
      'Overlaying both animations at their actual playback scale and one fixed wrist-core anchor.';
  } else {
    comparing = false;
    elapsed = comparisonReturnTime;
    compare.setAttribute('aria-pressed', 'false');
    compare.textContent = 'Compare Ictus';
    comparisonControls.hidden = true;
    status.textContent = 'Returned to the retimed five-beat phrase.';
  }
  render();
};

for (const button of comparisonButtons) {
  button.onclick = () => {
    const view = button.dataset.view;
    if (view !== 'phrase' && view !== 'ictus' && view !== 'overlay') return;
    comparisonView = view;
    for (const candidate of comparisonButtons)
      candidate.setAttribute('aria-pressed', String(candidate === button));
    status.textContent =
      view === 'overlay'
        ? 'Overlaying both animations at the same wrist-core anchor.'
        : `Showing ${view === 'phrase' ? 'the current phrase' : 'the approved Ictus'} at actual playback scale.`;
    render();
  };
}

function assetLoaded() {
  loadedAssets += 1;
  if (loadedAssets < 3) return;
  tips = prepareSheet(
    source,
    cleaned,
    cleanedContext,
    METER_PHRASE_FRAMES,
    5,
    4,
    0.72,
  );
  bridgeTips = prepareSheet(
    bridgeSource,
    bridgeCleaned,
    bridgeContext,
    4,
    4,
    1,
    0.66,
  );
  ready = true;
  play.disabled = false;
  compare.disabled = false;
  host.dataset.asset = 'whole-hand-frames';
  resume();
}

function assetError() {
  host.dataset.state = 'error';
  status.textContent = 'Could not load the phrase drawings. Reload to retry.';
}

source.onload = assetLoaded;
bridgeSource.onload = assetLoaded;
ictusSource.onload = assetLoaded;
source.onerror = assetError;
bridgeSource.onerror = assetError;
ictusSource.onerror = assetError;
source.src = sheetUrl;
bridgeSource.src = bridgeUrl;
ictusSource.src = ictusUrl;

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
