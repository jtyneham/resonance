import './style.css';
import { Arena } from './rendering/arena';
import { Transport, TRACK_INFO } from './audio/transport';
import { Battle, type Action, type EventKind } from './game/battle';
import { BEAT, DURATION } from './game/config';
import { PHRASES } from './game/chart';
import {
  loadRecord,
  loadSettings,
  saveClear,
  saveSettings,
} from './game/storage';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<main class="game" data-screen="title">
  <div class="edge-label" aria-hidden="true">R / 001 <span>THE BROKEN MACHINE</span></div>
  <div id="arena"></div>
  <header id="hud" hidden>
    <div class="boss-heading"><div><span class="eyebrow">TEST SUBJECT / 001</span><h2>DUMMY BOSS</h2></div><button id="pause" class="icon-button" aria-label="Pause battle">Ⅱ</button></div>
    <div class="boss-meter" role="progressbar" aria-label="Boss health" aria-valuemin="0" aria-valuemax="5"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="hud-row"><span id="health" aria-label="Player health"></span><span id="phrase">01 / SIGNAL</span><span id="timer">0:45</span></div>
    <div class="song-progress"><i id="progress"></i></div>
  </header>
  <div id="feedback" aria-live="polite" aria-atomic="true"></div>
  <div id="count-in" aria-live="polite"></div>
  <div id="telegraphs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>

  <section id="title" class="screen title-screen" aria-label="Title">
    <div class="title-copy"><span class="eyebrow lime">A SIGNAL IN THE NOISE</span><h1>RESONANCE<span class="title-dot">.</span></h1><p>Strike the rhythm back.</p></div>
    <div class="title-actions"><div class="micro-line"><span>FIVE LANES</span><span>ONE SPARK</span><span>NO SECOND CHANCES</span></div><button class="primary" id="start">START <span>↗</span></button><div class="utility-row"><button id="options-button" class="secondary">OPTIONS + CONTROLS</button><button id="fullscreen" class="secondary" aria-label="Enter fullscreen">⛶ FULLSCREEN</button></div><p class="footer-note">HEADPHONES RECOMMENDED <span>PROTOTYPE 0.1</span></p></div>
  </section>

  <section id="select" class="screen center-screen" aria-label="Encounter selection" hidden>
    <div class="panel"><span class="eyebrow lime">CHOOSE YOUR FREQUENCY</span><h2>First contact.</h2><p class="intro">A broken machine. An unstable signal.<br>Make it hear you.</p><div class="encounter-card"><div class="card-top"><span class="tag">NEUTRAL ENCOUNTER</span><span class="card-index">01</span></div><div class="dummy-symbol" aria-hidden="true">◇</div><h3>DUMMY BOSS</h3><p>${TRACK_INFO} · 5 LANES</p><div class="card-rule"></div><p class="card-description">Absorb two notes. Find an opening.<br>Land five counterattacks before time runs out.</p><div class="record" id="best-record">NO SIGNAL RECORDED</div></div><button class="primary" id="fight">ENTER BATTLE <span>↗</span></button><div class="utility-row"><button class="secondary" id="learn">HOW TO PLAY</button><button class="secondary" data-home>BACK</button></div><p class="footer-note">THE CONDUCTOR, PRISM & SILENCE COME LATER.</p></div>
  </section>

  <section id="options" class="screen center-screen" aria-label="Options and controls" hidden>
    <div class="panel options-panel"><span class="eyebrow lime">TUNE YOUR SIGNAL</span><h2>Options + controls.</h2>
    <label class="setting" for="volume"><span>Volume</span><output id="volume-value"></output></label><input id="volume" type="range" min="0" max="100" step="5" />
    <label class="setting toggle"><span>Reduced motion<small>Calmer rings and no impact particles.</small></span><input id="reduced-motion" type="checkbox" /></label>
    <div class="legend"><div><span class="legend-wave dark"></span><p><strong>Coral / low wave</strong>Jump over it or change lanes.</p></div><div><span class="legend-wave resonant">◆</span><p><strong>Muted lime / resonance wave</strong>Stand grounded in its lane to absorb automatically.</p></div><div><span class="legend-wall">╱╱</span><p><strong>Ivory / tall barrier</strong>Move aside. Blocks jumps and your shots.</p></div></div>
    <p class="instructions">Stand your ground to <strong>automatically absorb</strong> resonance waves. Two absorbs charge one shot. Tap <strong>Resonate</strong> in an opening to fire. Getting hit empties your charge.</p>
    <div class="key-guide"><span>MOVE <kbd>←</kbd><kbd>→</kbd> / A D</span><span>JUMP <kbd>SPACE</kbd></span><span>FIRE <kbd>J</kbd> / F</span><span>PAUSE <kbd>ESC</kbd></span></div>
    <p class="small-note">Touch: left thumb moves, right thumb jumps and fires stored resonance. One lane change per jump; a late second move is buffered for landing. Tap each move; holding does not repeat. Use speaker audio or wired headphones for the tightest timing.</p>
    <button class="primary" id="options-back">GOT IT <span>↗</span></button></div>
  </section>

  <section id="paused" class="screen center-screen scrim" aria-label="Paused" hidden><div class="panel"><span class="eyebrow lime">SIGNAL HELD</span><h2>Take a breath.</h2><p class="intro" id="pause-reason">Your place in the music is saved.</p><button class="primary" id="resume">RESUME <span>↗</span></button><div class="utility-row"><button class="secondary" id="pause-retry">RETRY</button><button class="secondary" data-home>TITLE</button></div></div></section>
  <section id="result" class="screen center-screen scrim" aria-label="Battle results" hidden><div class="panel"><span class="eyebrow" id="result-kicker">SIGNAL LOST</span><h2 id="result-title">Out of tune.</h2><p class="intro" id="result-description"></p><div class="result-score"><span class="eyebrow">SCORE</span><strong id="score">0</strong></div><div class="stats-grid" id="stats"></div><button class="primary" id="retry">TRY AGAIN <span>↗</span></button><button class="secondary full-width" id="result-select">ENCOUNTERS</button></div></section>

  <footer id="combat-controls" hidden><div class="control-status"><span>ABSORB AUTOMATICALLY</span><div id="charge-status"><i></i><i></i><span>0 / 2</span></div></div><div class="buttons"><div class="movement-controls"><button class="touch-button move" data-action="left" aria-label="Move left"><b>←</b><small>LEFT</small></button><button class="touch-button move" data-action="right" aria-label="Move right"><b>→</b><small>RIGHT</small></button></div><div class="action-controls"><button class="touch-button jump" data-action="jump" aria-label="Jump"><b>⌃</b><small>JUMP</small></button><button class="touch-button resonate" data-action="resonate" aria-label="Fire stored resonance"><b>◇</b><small id="resonate-label">RESONATE</small></button></div></div></footer>
  <div id="rotate" role="dialog" aria-modal="true" aria-label="Rotate your device" hidden><div class="rotate-glyph">▯ ↻</div><span class="eyebrow lime">KEEP IT UPRIGHT</span><h2>One way to play.</h2><p>Rotate your device to portrait.<br>Your battle is paused.</p></div>
  <div id="toast" role="status"></div>
</main>`;

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  app.querySelector<T>(selector)!;
const game = $('.game');
let arena: Arena | null = null;
try {
  arena = new Arena($('#arena'));
} catch {
  $('#arena').classList.add('unavailable');
}
const audio = new Transport();
const settings = loadSettings();
audio.setVolume(settings.volume);
arena?.setReducedMotion(settings.reducedMotion);
type Screen = 'title' | 'select' | 'options' | 'battle' | 'paused' | 'result';
let screen: Screen = 'title';
let previousScreen: Screen = 'title';
let battle: Battle | null = null;
let busy = false;
let operation = 0;
let landscape = false;
let eventIndex = 0;
let feedbackUntil = 0;
let toastTimer: ReturnType<typeof setTimeout>;

function toast(message: string) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4500);
}

function show(next: Screen) {
  screen = next;
  game.dataset.screen = next;
  for (const el of app.querySelectorAll<HTMLElement>('.screen'))
    el.hidden = el.id !== next;
  const combat = ['battle', 'paused', 'result'].includes(next);
  $('#hud').hidden = !combat;
  $('#combat-controls').hidden = !combat;
  for (const button of app.querySelectorAll<HTMLButtonElement>(
    '[data-action]',
  )) {
    button.disabled = next !== 'battle';
    button.classList.remove('pressed');
  }
  $('#feedback').hidden = next !== 'battle';
  $('#telegraphs').hidden = next !== 'battle';
  $('#count-in').hidden = next !== 'battle';
  if (next !== 'battle') {
    const target = $<HTMLButtonElement>(`#${next} button`);
    target?.focus({ preventScroll: true });
  }
  if (next === 'select') {
    const record = loadRecord();
    $('#best-record').textContent = record.clears
      ? `BEST ${record.score.toLocaleString()} / ${record.clears} CLEAR${record.clears === 1 ? '' : 'S'}`
      : 'NO SIGNAL RECORDED';
  }
}

async function startBattle() {
  if (busy || landscape) return;
  if (!arena) {
    toast(
      'This browser could not start WebGL. Try a browser with hardware acceleration enabled.',
    );
    return;
  }
  busy = true;
  const ticket = ++operation;
  try {
    await audio.start();
    if (ticket !== operation) {
      await audio.pause();
      return;
    }
    battle = new Battle();
    eventIndex = 0;
    feedbackUntil = 0;
    $('#feedback').textContent = '';
    show('battle');
    if (landscape || document.hidden)
      await pause('Resume when you are back in portrait.');
  } catch {
    toast(
      'Audio could not start. Tap Enter battle again, or try another browser.',
    );
  } finally {
    busy = false;
  }
}

async function pause(reason = 'Your place in the music is saved.') {
  if (screen !== 'battle' || !battle) return;
  battle.update(audio.time);
  $('#pause-reason').textContent = reason;
  show('paused');
  await audio.pause();
}

async function resume() {
  if (busy || landscape || screen !== 'paused') return;
  busy = true;
  const ticket = ++operation;
  try {
    await audio.resume();
    if (ticket !== operation) {
      await audio.pause();
      return;
    }
    if (landscape || document.hidden) {
      await audio.pause();
      return;
    }
    show('battle');
  } catch {
    toast('Tap Resume again to restart audio.');
  } finally {
    busy = false;
  }
}

function finish() {
  if (!battle) return;
  const won = battle.outcome === 'victory';
  if (won) saveClear(battle.stats.score);
  $('#result-kicker').textContent = won ? 'SIGNAL RESTORED' : 'SIGNAL LOST';
  $('#result-kicker').classList.toggle('lime', won);
  $('#result-title').textContent = won
    ? 'In resonance.'
    : battle.outcome === 'timeout'
      ? 'Time ran silent.'
      : 'Out of tune.';
  $('#result-description').textContent = won
    ? 'The machine heard you. Can you do it cleaner?'
    : battle.outcome === 'timeout'
      ? 'Land five counterattacks before the track ends.'
      : 'Learn the phrase. Find the opening. Strike back.';
  $('#score').textContent = battle.stats.score.toLocaleString();
  $('#stats').innerHTML =
    `<div><strong>${battle.stats.absorbs}</strong><span>ABSORBS</span></div><div><strong>${battle.stats.hits} / 5</strong><span>SHOTS LANDED</span></div><div><strong>${battle.stats.bestCombo}</strong><span>BEST COMBO</span></div><div><strong>${battle.stats.damage}</strong><span>HITS TAKEN</span></div>`;
  show('result');
  void audio.stop();
}

function action(action: Action) {
  if (screen !== 'battle' || !battle || landscape) return;
  battle.act(action, audio.time);
}

const actionKeys: Record<string, Action> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'jump',
  ArrowUp: 'jump',
  KeyW: 'jump',
  KeyJ: 'resonate',
  KeyF: 'resonate',
  Enter: 'resonate',
};
window.addEventListener('keydown', (e) => {
  if (
    screen === 'battle' &&
    (actionKeys[e.code] || ['Escape', 'KeyP'].includes(e.code))
  ) {
    e.preventDefault();
    if (e.repeat) return;
    if (actionKeys[e.code]) action(actionKeys[e.code]);
    else void pause();
  } else if (screen === 'paused' && e.code === 'Escape' && !e.repeat) {
    e.preventDefault();
    void resume();
  }
});

for (const button of app.querySelectorAll<HTMLButtonElement>('[data-action]')) {
  const pointers = new Set<number>();
  button.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (button.disabled) return;
    pointers.add(e.pointerId);
    button.setPointerCapture(e.pointerId);
    button.classList.add('pressed');
    if ('vibrate' in navigator) navigator.vibrate(7);
    action(button.dataset.action as Action);
  });
  const release = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (!pointers.size) button.classList.remove('pressed');
  };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
  // Keyboard / assistive activation generates a click with detail zero.
  button.addEventListener('click', (e) => {
    if (e.detail === 0) action(button.dataset.action as Action);
  });
}

$('#start').addEventListener('click', () => show('select'));
$('#fight').addEventListener('click', () => void startBattle());
$('#retry').addEventListener('click', () => void startBattle());
$('#pause-retry').addEventListener('click', () => void startBattle());
$('#pause').addEventListener('click', () => void pause());
$('#resume').addEventListener('click', () => void resume());
$('#result-select').addEventListener('click', () => {
  battle = null;
  show('select');
});
for (const button of app.querySelectorAll('[data-home]'))
  button.addEventListener('click', () => {
    operation++;
    void audio.stop();
    battle = null;
    show('title');
  });
$('#options-button').addEventListener('click', () => {
  previousScreen = 'title';
  show('options');
});
$('#learn').addEventListener('click', () => {
  previousScreen = 'select';
  show('options');
});
$('#options-back').addEventListener('click', () => show(previousScreen));
const volume = $<HTMLInputElement>('#volume');
const reduced = $<HTMLInputElement>('#reduced-motion');
volume.value = String(settings.volume * 100);
$('#volume-value').textContent = `${volume.value}%`;
reduced.checked = settings.reducedMotion;
volume.addEventListener('input', () => {
  settings.volume = Number(volume.value) / 100;
  $('#volume-value').textContent = `${volume.value}%`;
  audio.setVolume(settings.volume);
  saveSettings(settings);
});
reduced.addEventListener('change', () => {
  settings.reducedMotion = reduced.checked;
  arena?.setReducedMotion(reduced.checked);
  game.classList.toggle('reduced-motion', reduced.checked);
  saveSettings(settings);
});
game.classList.toggle('reduced-motion', settings.reducedMotion);

type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type WebkitDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
};
function fullscreenElement() {
  return (
    document.fullscreenElement ||
    (document as WebkitDocument).webkitFullscreenElement
  );
}
$('#fullscreen').addEventListener('click', async () => {
  const root = document.documentElement as WebkitElement;
  try {
    if (fullscreenElement()) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else await (document as WebkitDocument).webkitExitFullscreen?.();
    } else {
      // Request fullscreen directly from the click before any awaited audio work.
      if (root.requestFullscreen)
        await root.requestFullscreen({ navigationUI: 'hide' });
      else if (root.webkitRequestFullscreen)
        await root.webkitRequestFullscreen();
      else {
        toast(
          'Fullscreen is unavailable here. You can still play in portrait, or add the game to your home screen.',
        );
        return;
      }
      try {
        await (
          window.screen.orientation as ScreenOrientation & {
            lock?: (mode: string) => Promise<void>;
          }
        ).lock?.('portrait');
      } catch {
        /* Layout still enforces portrait on touch devices. */
      }
    }
  } catch {
    toast(
      'Fullscreen was declined by the browser. The game still works in this view.',
    );
  }
});
function updateFullscreen() {
  const full = !!fullscreenElement();
  $('#fullscreen').textContent = full ? '⛶ EXIT FULLSCREEN' : '⛶ FULLSCREEN';
  $('#fullscreen').setAttribute(
    'aria-label',
    full ? 'Exit fullscreen' : 'Enter fullscreen',
  );
}
document.addEventListener('fullscreenchange', updateFullscreen);
document.addEventListener('webkitfullscreenchange', updateFullscreen);

function checkOrientation() {
  landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  $('#rotate').hidden = !landscape;
  for (const el of app.querySelectorAll<HTMLElement>(
    '.screen, #combat-controls, #hud',
  ))
    el.inert = landscape;
  if (landscape) void pause('Back in portrait. Resume when you are ready.');
}
window.addEventListener('resize', checkOrientation);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) void pause('The battle paused while you were away.');
});
window.addEventListener('blur', () => {
  if (busy) operation++;
  void pause('The battle paused when the window lost focus.');
});
$('#arena').addEventListener(
  'webglcontextlost',
  (e) => {
    e.preventDefault();
    void pause(
      'Graphics were interrupted. Reload the page to restore the arena.',
    );
    toast('Graphics interrupted. Reload this page to restore the arena.');
  },
  true,
);
checkOrientation();

const labels: Record<EventKind, string> = {
  absorb: 'ABSORBED',
  fire: 'COUNTERATTACK',
  blocked: 'SHOT BLOCKED',
  'boss-hit': 'DIRECT HIT',
  damage: 'SIGNAL DAMAGED',
  miss: 'NOT IN RANGE',
  jump: '',
  move: '',
};
let lastCount = '';
let lastHealth = '';
function frame(ms: number) {
  const now = ms / 1000;
  if (screen === 'battle' && battle) {
    if (audio.state !== 'running' && !busy) {
      void pause('Audio was interrupted. Resume when you are ready.');
    }
  }
  if (screen === 'battle' && battle) {
    audio.schedule();
    battle.update(audio.time);
    for (; eventIndex < battle.events.length; eventIndex++) {
      const event = battle.events[eventIndex];
      audio.effect(event.kind);
      arena?.feedback(event, now);
      if (labels[event.kind]) {
        $('#feedback').textContent = labels[event.kind];
        $('#feedback').dataset.kind = event.kind;
        feedbackUntil = now + 0.6;
      }
    }
    if (now > feedbackUntil) $('#feedback').textContent = '';
    const count =
      battle.time < 0
        ? String(Math.min(2, Math.ceil(-battle.time / BEAT)))
        : battle.time < 0.3
          ? 'GO'
          : '';
    if (count !== lastCount) {
      $('#count-in').textContent = count;
      lastCount = count;
    }
    const health = `${battle.hp}`;
    if (health !== lastHealth) {
      $('#health').innerHTML = Array.from(
        { length: 3 },
        (_, i) => `<i class="${i < battle!.hp ? 'alive' : ''}">◆</i>`,
      ).join('');
      $('#health').setAttribute('aria-label', `${battle.hp} of 3 health`);
      lastHealth = health;
    }
    const remaining = Math.max(0, Math.ceil(DURATION - battle.time));
    $('#timer').textContent =
      `0:${Math.min(45, remaining).toString().padStart(2, '0')}`;
    $('#phrase').textContent =
      PHRASES[Math.min(7, Math.floor(Math.max(0, battle.time) / BEAT / 16))];
    $('#progress').style.width =
      `${(Math.max(0, battle.time) / DURATION) * 100}%`;
    $('.boss-meter').setAttribute('aria-valuenow', String(battle.bossHp));
    app
      .querySelectorAll('.boss-meter i')
      .forEach((el, i) => el.classList.toggle('filled', i < battle!.bossHp));
    app
      .querySelectorAll('#charge-status i')
      .forEach((el, i) => el.classList.toggle('charged', i < battle!.charge));
    $('#charge-status span').textContent =
      battle.charge === 2 ? 'SHOT READY' : `${battle.charge} / 2`;
    $('.resonate').classList.toggle('ready', battle.charge === 2);
    $('#resonate-label').textContent =
      battle.charge === 2 ? 'FIRE RESONANCE' : 'RESONATE';
    game.dataset.lane = String(battle.lane);
    game.dataset.airborne = String(battle.airborne());
    const fast = battle.chart.filter(
      (n) =>
        n.travel < BEAT * 2 &&
        n.hit - battle!.time > 0 &&
        n.hit - battle!.time < n.travel + BEAT,
    );
    app.querySelectorAll('#telegraphs i').forEach((el, i) =>
      el.classList.toggle(
        'warning',
        fast.some((n) => i >= n.lane && i < n.lane + n.width),
      ),
    );
    if (battle.outcome !== 'playing') finish();
  }
  arena?.render(battle, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
