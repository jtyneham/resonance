import './style.css';
import referenceUrl from '../../docs/bosses/conductor/Conductor_visual_transparent.png?url';

document.querySelector<HTMLDivElement>('#lab')!.innerHTML = `
<main class="study" data-state="loading">
  <header><a href="${import.meta.env.BASE_URL}" aria-label="Back to the game">RESONANCE <span>↗</span></a><span class="edition">CHARACTER REFERENCE</span></header>
  <div class="heading"><p class="eyebrow">ORIGINAL ARTWORK</p><h1>The Conductor<span>.</span></h1><p class="subtitle">The starting point for the next animation.</p></div>
  <figure id="stage" aria-label="Original Conductor reference">
    <img id="reference" alt="The original Conductor: an ornate ivory, brass and crimson mechanical hand holding a baton." />
  </figure>
  <p id="notice" role="status">Loading the original artwork…</p>
  <div class="actions"><a id="original" href="${referenceUrl}" target="_blank" rel="noopener">View full-size artwork ↗</a><button id="fullscreen" aria-label="Enter fullscreen">⛶</button></div>
  <p class="caption">Static reference · animation awaiting new poses.</p>
</main>
<div id="rotate" role="dialog" aria-modal="true" aria-label="Rotate your device" hidden><h2>Turn it upright.</h2><p>The reference is presented in portrait.</p></div>`;

const study = document.querySelector<HTMLElement>('.study')!;
const notice = document.querySelector<HTMLElement>('#notice')!;
const reference = document.querySelector<HTMLImageElement>('#reference')!;
reference.addEventListener('load', () => {
  study.dataset.state = 'ready';
  notice.textContent = 'Original reference';
});
reference.addEventListener('error', () => {
  study.dataset.state = 'error';
  notice.textContent = 'The reference could not load. Reload to retry.';
});
reference.src = referenceUrl;

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
}
window.addEventListener('resize', orientation);
orientation();
