import './finger.css';
import './meter.css';
import {
  ENCOUNTER_OFFSET_SECONDS,
  METER_SKETCH_MS,
  meterPulses,
  pulseAt,
  visibleMeterAttacks,
  type MeterPulse,
} from './meter-score';

document.querySelector('main')!.innerHTML = `
<p class="eyebrow">CHANGING METER · TIMING ONLY</p>
<h1>Hear the emphasis move.</h1>
<p>This twelve-second click study tests <strong>3+2 → 2+3</strong>. It uses placeholder arcs and no Conductor artwork.</p>
<div class="meter-summary"><div><strong>120 BPM</strong><span>TEMPO</span></div><div><strong>0.5 SEC</strong><span>EACH PULSE</span></div><div><strong>16–28 SEC</strong><span>ENCOUNTER SLOT</span></div></div>
<div id="sample" data-state="ready"><canvas width="600" height="900" aria-label="Changing Meter pulse and five-lane attack visualization"></canvas></div>
<div class="transport"><button id="play">Play with sound</button><button id="stop" disabled>Stop</button></div>
<label class="timeline-label" for="timeline">Inspect timing <output id="time">16.0s</output></label>
<input id="timeline" type="range" min="0" max="${METER_SKETCH_MS}" value="0" step="10" />
<div class="legend"><span><b>Large gold</b> strong pulse</span><span><b>Small ivory</b> weak pulse</span><span><b>REST</b> pulse without attack</span></div>
<p id="status" role="status">Ready. Turn on your sound and play from the beginning.</p>
<p>The release times are the point of this test. Character animation, final sound design, collision and HP variants are deliberately absent.</p>
<p><a href="${import.meta.env.BASE_URL}windup-lab.html?mode=attack">Approved Ictus attack study ↗</a></p>
<div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate to portrait to inspect the study.</p></div>`;

const host = document.querySelector<HTMLElement>('#sample')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const stop = document.querySelector<HTMLButtonElement>('#stop')!;
const timeline = document.querySelector<HTMLInputElement>('#timeline')!;
const timeOutput = document.querySelector<HTMLOutputElement>('#time')!;
const status = document.querySelector<HTMLElement>('#status')!;

let elapsed = 0;
let playing = false;
let raf = 0;
let audio: AudioContext | undefined;
let audioStart = 0;
let scheduled: OscillatorNode[] = [];

function drawLanes() {
  ctx.save();
  ctx.strokeStyle = 'rgba(207, 184, 143, 0.18)';
  ctx.lineWidth = 2;
  for (let lane = 0; lane < 6; lane++) {
    const bottomX = 48 + lane * 102;
    const topX = 300 + (bottomX - 300) * 0.31;
    ctx.beginPath();
    ctx.moveTo(topX, 220);
    ctx.lineTo(bottomX, 900);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPulseStrip(active?: MeterPulse) {
  const grouping = active?.grouping ?? '3+2';
  const activePulse = active?.pulse ?? 0;
  const splitAfter = grouping === '3+2' ? 3 : 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c68c49';
  ctx.font = '700 30px Georgia';
  ctx.fillText(grouping, 300, 55);
  ctx.font = '11px Arial';
  ctx.fillStyle = '#6f624f';
  ctx.fillText('STRONG AND WEAK PULSES', 300, 79);
  for (let pulse = 1; pulse <= 5; pulse++) {
    const strong =
      pulse === 1 || (grouping === '3+2' ? pulse === 4 : pulse === 3);
    const x = 138 + (pulse - 1) * 81 + (pulse > splitAfter ? 20 : 0);
    const radius = strong ? 17 : 10;
    ctx.beginPath();
    ctx.arc(x, 130, radius, 0, Math.PI * 2);
    ctx.fillStyle =
      pulse === activePulse
        ? strong
          ? '#f0b75f'
          : '#f0e1c4'
        : strong
          ? '#6a4826'
          : '#403a31';
    ctx.fill();
    ctx.fillStyle = pulse === activePulse ? '#160f09' : '#b9aa91';
    ctx.font = `${strong ? '700 ' : ''}11px Arial`;
    ctx.fillText(String(pulse), x, 134);
  }
}

function drawArc(lane: number, width: number, y: number, accent: number) {
  const perspective = Math.max(0.31, (y - 20) / 880);
  const leftBottom = 48 + lane * 102;
  const rightBottom = 48 + (lane + width) * 102;
  const left = 300 + (leftBottom - 300) * perspective;
  const right = 300 + (rightBottom - 300) * perspective;
  const center = (left + right) / 2;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.strokeStyle = `rgba(116, 0, 15, ${0.58 + accent * 0.2})`;
  ctx.lineWidth = 11 + accent * 5;
  ctx.beginPath();
  ctx.moveTo(left + 5, y);
  ctx.quadraticCurveTo(center, y - 15 - width * 3, right - 5, y);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255, 39, 55, ${0.78 + accent * 0.2})`;
  ctx.lineWidth = 3 + accent * 2;
  ctx.stroke();
  ctx.restore();
}

function render() {
  const current = pulseAt(elapsed);
  const visible = visibleMeterAttacks(elapsed);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPulseStrip(current);
  drawLanes();
  for (const release of visible) {
    const y = 225 + release.progress * 675;
    drawArc(
      release.attack.lane,
      release.attack.width,
      y,
      release.accent === 'strong' ? 1 : 0.45,
    );
  }
  if (current) {
    const sincePulse = elapsed - current.at;
    if (sincePulse >= 0 && sincePulse < 180) {
      const strength = 1 - sincePulse / 180;
      ctx.textAlign = 'center';
      ctx.font = `${current.accent === 'strong' ? 700 : 400} 22px Arial`;
      ctx.fillStyle = current.attack
        ? `rgba(230, 180, 105, ${strength})`
        : `rgba(195, 181, 153, ${strength})`;
      ctx.fillText(current.attack ? 'RELEASE' : 'REST', 300, 194);
    }
  }
  const grouping = current?.grouping ?? (elapsed < 6_000 ? '3+2' : '2+3');
  host.dataset.grouping = grouping;
  host.dataset.pulse = current ? String(current.pulse) : '0';
  host.dataset.releases = String(visible.length);
  host.dataset.time = String(Math.round(elapsed));
  timeline.value = String(elapsed);
  timeOutput.value = `${(ENCOUNTER_OFFSET_SECONDS + elapsed / 1000).toFixed(1)}s`;
}

function tone(when: number, frequency: number, volume: number, length: number) {
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = frequency < 300 ? 'triangle' : 'square';
  oscillator.frequency.setValueAtTime(frequency, when);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(90, frequency * 0.72),
    when + length,
  );
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(when);
  oscillator.stop(when + length + 0.01);
  scheduled.push(oscillator);
}

function schedulePulse(pulse: MeterPulse, start: number) {
  const when = start + pulse.at / 1000;
  if (pulse.accent === 'strong') {
    tone(when, 170, 0.12, 0.11);
    tone(when, 980, 0.055, 0.045);
  } else {
    tone(when, 690, 0.045, 0.045);
  }
}

function cancelScheduledAudio() {
  for (const oscillator of scheduled) {
    try {
      oscillator.stop();
    } catch {
      // A click that has already ended needs no further cleanup.
    }
  }
  scheduled = [];
}

function halt(reset = false) {
  cancelAnimationFrame(raf);
  cancelScheduledAudio();
  playing = false;
  play.dataset.active = 'false';
  stop.disabled = true;
  host.dataset.state = 'paused';
  if (reset) elapsed = 0;
  play.textContent =
    elapsed >= METER_SKETCH_MS ? 'Replay with sound' : 'Play with sound';
  render();
}

function tick() {
  if (!playing || !audio) return;
  elapsed = Math.min(
    METER_SKETCH_MS,
    Math.max(0, (audio.currentTime - audioStart) * 1000),
  );
  render();
  if (elapsed >= METER_SKETCH_MS) {
    halt();
    status.textContent =
      'Sketch complete. Did the emphasis change become audible?';
    return;
  }
  raf = requestAnimationFrame(tick);
}

play.onclick = async () => {
  halt(true);
  audio ??= new AudioContext();
  await audio.resume();
  audioStart = audio.currentTime + 0.08;
  for (const pulse of meterPulses) schedulePulse(pulse, audioStart);
  elapsed = 0;
  playing = true;
  host.dataset.state = 'playing';
  play.dataset.active = 'true';
  play.textContent = 'Restart';
  stop.disabled = false;
  status.textContent = 'Playing 3+2, then 2+3. Listen for the heavy clicks.';
  tick();
};

stop.onclick = () => {
  halt();
  status.textContent =
    'Stopped. Play again from the beginning to hear the grouping.';
};

timeline.oninput = () => {
  const inspectedTime = Number(timeline.value);
  halt();
  elapsed = inspectedTime;
  host.dataset.state = 'inspecting';
  render();
};

function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  document.querySelector<HTMLElement>('#rotate')!.hidden = !landscape;
  if (landscape) halt();
}

window.addEventListener('blur', () => halt());
window.addEventListener('pagehide', () => halt());
document.addEventListener('visibilitychange', () => {
  if (document.hidden) halt();
});
window.addEventListener('resize', orientation);

render();
orientation();
