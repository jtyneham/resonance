import './style.css';
import referenceUrl from '../../docs/bosses/conductor/Conductor_visual_transparent.png?url';
import {
  loadStyled as loadTransition,
  drawStyled as drawTransition,
} from './styled-frames';
import {
  WRIST_DURATION as ICTUS_MS,
  sampleStyled as sampleIctus,
} from './styled-score';

document.querySelector<HTMLDivElement>('#lab')!.innerHTML = `
<main class="study" data-state="loading" data-mode="transition">
  <header><a href="${import.meta.env.BASE_URL}" aria-label="Back to the game">RESONANCE <span>↗</span></a><span class="edition">STYLED POSE BLOCKING · 01</span></header>
  <div class="heading"><p class="eyebrow">IDLE → ICTUS → IDLE</p><h1>The Conductor<span>.</span></h1><p class="subtitle">KEY POSES ONLY · stepped playback, not finished animation.</p></div>
  <figure id="stage" aria-label="Conductor styled pose blocking">
    <canvas width="600" height="900" aria-label="Styled key poses, not finished animation"></canvas>
    <img id="reference" hidden alt="The original Conductor reference." src="${referenceUrl}" />
  </figure>
  <p id="notice" role="status">Loading the drawings…</p>
  <fieldset id="motion-controls" disabled>
    <div class="actions playback"><button id="play">Play pose study</button><button id="slow" aria-pressed="false">Slow · ¼ speed</button></div>
    <label class="scrub-label" for="scrub">Inspect motion <output id="frame-label">Upright idle · 0.00 s</output></label>
    <input id="scrub" type="range" min="0" max="${ICTUS_MS}" step="1" value="0" aria-label="Scrub Ictus" />
  </fieldset>
  <div class="actions playback"><button data-seek="0">Idle</button><button data-seek="130">Wind-up</button><button data-seek="260">Strike</button><button data-seek="600">Recovery</button></div>
  <div class="actions"><button id="toggle">Original reference</button><button id="fullscreen" aria-label="Enter fullscreen">⛶</button></div>
  <p class="caption">POSE BLOCKING, NOT FINISHED ANIMATION. 3 drawings sampled over the approved 1.2-second motion: 130 ms extension, strike at 260 ms, 940 ms recovery. Visible pose holds mean missing in-between drawings—not intended pauses. No morphing or crossfades. The idle still has its old baked tip sparkle; tip effects are not finished.</p>
  <div class="actions playback"><a href="${import.meta.env.BASE_URL}wrist-lab.html">Approved motion reference ↗</a><a href="${import.meta.env.BASE_URL}conductor-lab.html">Older study ↗</a></div>
</main>
<div id="rotate" role="dialog" aria-modal="true" aria-label="Rotate your device" hidden><h2>Turn it upright.</h2><p>The study is presented in portrait.</p></div>`;

const study = document.querySelector<HTMLElement>('.study')!;
const notice = document.querySelector<HTMLElement>('#notice')!;
const reference = document.querySelector<HTMLImageElement>('#reference')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const context = canvas.getContext('2d')!;
const controls =
  document.querySelector<HTMLFieldSetElement>('#motion-controls')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const scrub = document.querySelector<HTMLInputElement>('#scrub')!;
let images: HTMLImageElement[] = [];
let elapsed = 0;
let playing = false;
let rate = 1;
let previous = 0;
let raf = 0;
let loaded = false;

function render() {
  if (!loaded) return;
  const pose = sampleIctus(elapsed);
  const index = pose.frame;
  study.dataset.phase = pose.phase;
  drawTransition(context, images, index);
  study.dataset.frame = String(index);
  study.dataset.time = String(Math.round(elapsed));
  scrub.value = String(Math.round(elapsed));
  document.querySelector<HTMLOutputElement>('#frame-label')!.value =
    `${pose.phase} · ${(elapsed / 1000).toFixed(2)} s`;
}
document
  .querySelectorAll<HTMLButtonElement>('[data-seek]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      elapsed = Number(button.dataset.seek);
      pause();
      render();
      notice.textContent =
        'Key drawing inspection — compare with the approved motion reference.';
    });
  });
function pause() {
  playing = false;
  cancelAnimationFrame(raf);
  play.textContent =
    elapsed >= ICTUS_MS ? 'Replay pose study' : 'Play pose study';
  if (loaded) study.dataset.state = 'paused';
}
function tick(now: number) {
  if (!playing) return;
  // A queued RAF timestamp can predate the click/rate-change performance.now().
  // Do not let that first callback select a negative drawing index.
  elapsed = Math.min(ICTUS_MS, elapsed + Math.max(0, now - previous) * rate);
  previous = Math.max(previous, now);
  render();
  if (elapsed >= ICTUS_MS) {
    pause();
    notice.textContent = 'Pose study complete — back in upright idle.';
    return;
  }
  raf = requestAnimationFrame(tick);
}
play.addEventListener('click', () => {
  if (playing) {
    pause();
    return;
  }
  if (!loaded || study.inert || study.dataset.mode !== 'transition') return;
  if (elapsed >= ICTUS_MS) elapsed = 0;
  playing = true;
  previous = performance.now();
  study.dataset.state = 'playing';
  play.textContent = 'Pause';
  notice.textContent =
    'Idle → wrist extension → strike → recovery (key drawings only).';
  render();
  raf = requestAnimationFrame(tick);
});
slow.addEventListener('click', () => {
  // Start a new time interval so a rate change cannot rescale elapsed time.
  previous = performance.now();
  rate = rate === 1 ? 0.25 : 1;
  slow.setAttribute('aria-pressed', String(rate === 0.25));
});
scrub.addEventListener('input', () => {
  elapsed = Number(scrub.value);
  pause();
  render();
  notice.textContent = 'Paused for inspection.';
});
document
  .querySelector<HTMLButtonElement>('#toggle')!
  .addEventListener('click', (event) => {
    pause();
    const original = study.dataset.mode !== 'original';
    study.dataset.mode = original ? 'original' : 'transition';
    canvas.hidden = original;
    reference.hidden = !original;
    controls.hidden = original;
    (event.currentTarget as HTMLButtonElement).textContent = original
      ? 'Back to Ictus'
      : 'Original reference';
    notice.textContent = original
      ? 'Original reference.'
      : 'Ictus ready for inspection.';
  });
void loadTransition()
  .then((result) => {
    images = result;
    loaded = true;
    controls.disabled = false;
    study.dataset.state = 'ready';
    notice.textContent =
      'Ready — three-pose blocking study, not a smooth animation.';
    render();
  })
  .catch((error: Error) => {
    study.dataset.state = 'error';
    notice.textContent = error.message;
  });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);

type FullElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
};
const fullscreen = document.querySelector<HTMLButtonElement>('#fullscreen')!;
const isFullscreen = () =>
  document.fullscreenElement ||
  (document as FullDocument).webkitFullscreenElement;
fullscreen.addEventListener('click', () => {
  const root = document.documentElement as FullElement;
  const operation = isFullscreen()
    ? (document.exitFullscreen?.() ??
      (document as FullDocument).webkitExitFullscreen?.())
    : (root.requestFullscreen?.({ navigationUI: 'hide' }) ??
      root.webkitRequestFullscreen?.());
  void Promise.resolve(operation)
    .then(async () => {
      if (!isFullscreen()) return;
      try {
        await (
          screen.orientation as ScreenOrientation & {
            lock?: (mode: string) => Promise<void>;
          }
        ).lock?.('portrait');
      } catch {
        /* Portrait overlay remains available. */
      }
    })
    .catch(() => {
      notice.textContent =
        'Fullscreen was declined. The reference is still available below.';
    });
});
function fullscreenChanged() {
  fullscreen.setAttribute(
    'aria-label',
    isFullscreen() ? 'Exit fullscreen' : 'Enter fullscreen',
  );
}
document.addEventListener('fullscreenchange', fullscreenChanged);
document.addEventListener('webkitfullscreenchange', fullscreenChanged);
function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  document.querySelector<HTMLElement>('#rotate')!.hidden = !landscape;
  study.inert = landscape;
  if (landscape) pause();
}
window.addEventListener('resize', orientation);
orientation();
