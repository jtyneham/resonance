import './style.css';
import { Transport } from '../audio/transport';
import {
  ATTACK_RELEASE_BEAT,
  CLIP_RANGES,
  LAB_BEAT,
  LAB_BPM,
  LOOP_BEATS,
  type Clip,
} from './score';
import { StudyView } from './view';

document.querySelector<HTMLDivElement>('#lab')!.innerHTML = `
<main class="study" data-state="loading">
  <header><a href="${import.meta.env.BASE_URL}" aria-label="Back to the game">RESONANCE <span>↗</span></a><span class="edition">WHOLE-HAND STUDY · 02</span></header>
  <div class="heading"><p class="eyebrow">AUTHORED FRAME ANIMATION</p><h1>The Conductor<span>.</span></h1><p class="subtitle">One complete Ictus. Twenty-four whole-hand drawings.</p></div>
  <section id="stage" aria-label="Conductor animation preview"><div id="loading" role="status">Preparing the hand…</div><div class="stage-caption"><span id="section">Idle</span><span id="beat-label">120 BPM</span></div></section>
  <div class="cue"><i id="beat-light"></i><span id="cue">Ready when you are.</span></div>
  <section class="controls" aria-label="Motion study controls">
    <div class="clip-tabs" role="group" aria-label="Choose animation"><button data-clip="ictus" aria-pressed="true">ICTUS · ACCENTED FORMATION</button></div>
    <label class="scrub-label" for="scrub"><span>PHRASE POSITION</span><output id="position">0.00 / 2.00 s</output></label><input id="scrub" type="range" min="0" max="2" step="0.01" value="0" aria-label="Scrub animation" />
    <div class="actions"><button id="play" class="primary" disabled>PLAY STUDY <span>▶</span></button><button id="restart" disabled aria-label="Restart animation">↺</button><button id="fullscreen" aria-label="Enter fullscreen">⛶</button></div>
    <p id="notice" role="status">Loading the whole-hand sprite atlas.</p>
    <details id="diagnostics"><summary>INSPECT THE FRAMES <span>+</span></summary><div class="diagnostic-body">
      <div class="toggles"><label><input type="checkbox" id="guides" /> Palm anchor</label><label><input type="checkbox" id="mute" /> Mute clicks</label></div>
      <label class="rate-label" for="fps">Display cadence<select id="fps"><option value="0">Native refresh</option><option value="30">30 FPS</option><option value="15">15 FPS</option></select></label>
      <button id="skip">Skip drawing for 700 ms</button>
      <p id="metrics">Waiting for playback.</p><p class="explanation">Skipping drawings leaves the audio running. The hand catches up to the current beat. This tests timing, not a stalled audio engine.</p>
    </div></details>
  </section>
  <footer>PIXIJS / WEBGL<span>FRAME STUDY · ART DRAFT</span></footer>
</main>
<div id="rotate" role="dialog" aria-modal="true" aria-label="Rotate your device" hidden><p class="eyebrow">PORTRAIT STUDY</p><h2>Turn it upright.</h2><p>The performance is paused.</p></div>`;

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const view = new StudyView();
const audio = new Transport(LAB_BPM, [ATTACK_RELEASE_BEAT], LOOP_BEATS);
const study = $('.study');
const play = $<HTMLButtonElement>('#play');
const scrub = $<HTMLInputElement>('#scrub');
let clip: Clip = 'ictus';
let playing = false;
let ready = false;
let busy = false;
let intent = 0;
let disposed = false;
let raf = 0;
let previewTime = 0;
let skipUntil = 0;
let lastDraw = -Infinity;
let lastStats = performance.now();
let drawn = 0;
const cpu: number[] = [];
let largestGap = 0;
let previousDraw = 0;

function restricted() {
  return (
    document.hidden ||
    (matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight)
  );
}
function updateButtons() {
  play.disabled = !ready || busy;
  $<HTMLButtonElement>('#restart').disabled = !ready || busy;
  play.innerHTML = playing
    ? 'PAUSE <span aria-hidden="true">Ⅱ</span>'
    : 'PLAY STUDY <span aria-hidden="true">▶</span>';
  study.dataset.state = !ready ? 'loading' : playing ? 'playing' : 'paused';
}
function fail(error: unknown) {
  $('#loading').hidden = true;
  $('#notice').textContent =
    `Could not run the study: ${error instanceof Error ? error.message : 'unknown error'}. Reload to retry.`;
  playing = false;
  busy = false;
  updateButtons();
}
async function pause(message?: string) {
  intent++;
  playing = false;
  await audio.pause();
  if (ready && audio.state) previewTime = Math.max(0, audio.time);
  if (message) $('#notice').textContent = message;
  updateButtons();
  lastDraw = -Infinity;
}
async function start() {
  if (!ready || busy || restricted()) return;
  busy = true;
  const ticket = ++intent;
  updateButtons();
  try {
    await audio.unlock();
    if (ticket !== intent || restricted() || disposed) {
      await audio.pause();
      return;
    }
    audio.seek(previewTime);
    playing = true;
    $('#notice').textContent =
      'Clicks mark the beat. The low accent marks each Ictus release.';
    lastDraw = -Infinity;
  } finally {
    busy = false;
    updateButtons();
  }
}
async function selectClip(next: Clip) {
  await pause();
  clip = next;
  const [start, end] = CLIP_RANGES[clip];
  previewTime = start * LAB_BEAT;
  audio.seek(previewTime);
  scrub.max = String((end - start) * LAB_BEAT);
  document
    .querySelectorAll<HTMLButtonElement>('[data-clip]')
    .forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.clip === clip)),
    );
  $('#notice').textContent =
    'Press Play, or drag the phrase position to inspect a pose.';
  lastDraw = -Infinity;
}
play.addEventListener(
  'click',
  () =>
    void (
      playing ? pause('Paused. Resume whenever you are ready.') : start()
    ).catch(fail),
);
$('#restart').addEventListener(
  'click',
  () => void selectClip(clip).catch(fail),
);
document.querySelectorAll<HTMLButtonElement>('[data-clip]').forEach((b) =>
  b.addEventListener('click', () => {
    if (busy || !ready) return;
    void selectClip(b.dataset.clip as Clip).catch(fail);
  }),
);
scrub.addEventListener('input', () => {
  if (!ready || busy) return;
  const seconds = Number(scrub.value) + CLIP_RANGES[clip][0] * LAB_BEAT;
  void pause()
    .then(() => {
      previewTime = seconds;
      audio.seek(seconds);
      lastDraw = -Infinity;
    })
    .catch(fail);
});
$('#mute').addEventListener('change', () =>
  audio.setVolume($<HTMLInputElement>('#mute').checked ? 0 : 0.65),
);
$('#guides').addEventListener('change', () => {
  lastDraw = -Infinity;
});
$('#fps').addEventListener('change', () => {
  lastDraw = -Infinity;
});
$('#skip').addEventListener('click', () => {
  if (!playing) {
    $('#notice').textContent = 'Start playback first to test skipped drawings.';
    return;
  }
  skipUntil = performance.now() + 700;
  $('#notice').textContent =
    'Drawing paused for 700 ms; audio clock continues.';
});

type FullElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
};
const isFullscreen = () =>
  document.fullscreenElement ||
  (document as FullDocument).webkitFullscreenElement;
$('#fullscreen').addEventListener('click', () => {
  const root = document.documentElement as FullElement;
  const operation = isFullscreen()
    ? (document.exitFullscreen?.() ??
      (document as FullDocument).webkitExitFullscreen?.())
    : (root.requestFullscreen?.({ navigationUI: 'hide' }) ??
      root.webkitRequestFullscreen?.());
  void Promise.resolve(operation)
    .then(async () => {
      if (!isFullscreen()) {
        $('#notice').textContent =
          'Windowed preview. Fullscreen depends on this browser.';
        return;
      }
      try {
        await (
          screen.orientation as ScreenOrientation & {
            lock?: (mode: string) => Promise<void>;
          }
        ).lock?.('portrait');
      } catch {
        /* Rotation overlay still protects portrait. */
      }
    })
    .catch(() => {
      $('#notice').textContent =
        'Fullscreen was declined. The study still works here.';
    });
});
function fullscreenChanged() {
  $('#fullscreen').setAttribute(
    'aria-label',
    isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen',
  );
}
document.addEventListener('fullscreenchange', fullscreenChanged);
document.addEventListener('webkitfullscreenchange', fullscreenChanged);
function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  $('#rotate').hidden = !landscape;
  study.inert = landscape;
  if (landscape)
    void pause('Back in portrait. Press Play to resume.').catch(fail);
}
window.addEventListener('resize', orientation);
document.addEventListener('visibilitychange', () => {
  if (document.hidden)
    void pause('Paused while away. Press Play to resume.').catch(fail);
});
window.addEventListener(
  'blur',
  () =>
    void pause('Paused when focus changed. Press Play to resume.').catch(fail),
);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && playing) void pause('Paused.').catch(fail);
});

function frame(now: number) {
  if (disposed) return;
  raf = requestAnimationFrame(frame);
  if (!ready) return;
  if (playing) {
    if (audio.state !== 'running') {
      void pause('Audio interrupted. Press Play to resume.').catch(fail);
      return;
    }
    const [startBeat, endBeat] = CLIP_RANGES[clip];
    if (audio.time >= endBeat * LAB_BEAT) {
      audio.seek(
        startBeat * LAB_BEAT +
          ((audio.time - endBeat * LAB_BEAT) %
            ((endBeat - startBeat) * LAB_BEAT)),
      );
    }
    audio.schedule();
    previewTime = Math.max(0, audio.time);
  }
  const fps = Number($<HTMLSelectElement>('#fps').value);
  if (now < skipUntil || (fps && now - lastDraw < 1000 / fps - 1)) return;
  if (!playing && lastDraw !== -Infinity) return;
  const started = performance.now();
  const beat = previewTime / LAB_BEAT;
  const pose = view.render(beat, $<HTMLInputElement>('#guides').checked);
  lastDraw = now;
  if (previousDraw) largestGap = Math.max(largestGap, now - previousDraw);
  previousDraw = now;
  drawn++;
  cpu.push(performance.now() - started);
  if (cpu.length > 120) cpu.shift();
  study.dataset.beat = beat.toFixed(5);
  study.dataset.sampledBeat = pose.beat.toFixed(5);
  study.dataset.frame = String(pose.frame);
  study.dataset.clip = clip;
  $('#section').textContent = pose.section;
  $('#cue').textContent = pose.cue;
  $('#beat-label').textContent =
    `BEAT ${Math.floor(beat) + 1} · ${LAB_BPM} BPM`;
  $('#beat-light').style.opacity = String(
    0.2 + 0.8 * Math.max(0, 1 - (beat % 1) * 5),
  );
  const [startBeat, endBeat] = CLIP_RANGES[clip];
  const elapsed = previewTime - startBeat * LAB_BEAT;
  scrub.value = String(elapsed);
  $('#position').textContent =
    `${elapsed.toFixed(2)} / ${((endBeat - startBeat) * LAB_BEAT).toFixed(2)} s`;
  if (now - lastStats > 1000) {
    const sorted = [...cpu].sort((a, b) => a - b);
    $('#metrics').textContent =
      `${Math.round((drawn * 1000) / (now - lastStats))} draws/s · CPU p95 ${sorted[Math.floor(sorted.length * 0.95)]?.toFixed(1)} ms · largest gap ${Math.round(largestGap)} ms`;
    drawn = 0;
    largestGap = 0;
    lastStats = now;
  }
}

void view
  .init($('#stage'))
  .then(() => {
    ready = true;
    $('#loading').hidden = true;
    $('#notice').textContent = 'Press Play to start audio and the performance.';
    study.dataset.ready = 'true';
    updateButtons();
    view.app.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      void pause('Graphics interrupted. Reload to restore the study.');
      ready = false;
      updateButtons();
    });
    orientation();
    raf = requestAnimationFrame(frame);
  })
  .catch(fail);

window.addEventListener('pagehide', () => {
  disposed = true;
  intent++;
  cancelAnimationFrame(raf);
  void audio.stop();
  if (ready) view.destroy();
});
window.addEventListener('pageshow', (e) => {
  if (e.persisted) location.reload();
});
