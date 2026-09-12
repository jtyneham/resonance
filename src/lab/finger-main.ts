import * as THREE from 'three';
import {
  createFingerSample,
  createCompleteFinger,
  FINGER_CYCLE,
} from './finger-model';
import './finger.css';

const main = document.querySelector<HTMLElement>('#finger-lab')!;
const full = new URLSearchParams(location.search).get('mode') === 'full';
main.innerHTML = `
  <p class="eyebrow">ONE FINGER · MATERIAL / MOTION TEST</p>
  <h1>Ivory & brass.</h1>
  <p>A constructed sample, not the finished hand. Watch the surface detail stay attached as the joint bends.</p>
  <div id="sample" role="img" aria-label="Two ivory finger segments bending at a brass hinge"></div>
  <div class="row"><button id="play">Play bend</button><button id="view">Side view</button></div>
  <label for="bend">Inspect bend <output id="angle">0°</output></label>
  <input id="bend" type="range" min="0" max="1200" value="0" step="1" />
  <p id="status" role="status">Ready · front three-quarter view · pixel rendering</p>
  <p>Real-time geometry, no generated frames or crossfades. This tests the production method—not the Conductor’s attack timing.</p>
  <a href="${import.meta.env.BASE_URL}wrist-lab.html">Approved wrist-motion reference ↗</a>
  <div id="rotate" hidden><h2>Keep it upright.</h2><p>Rotate back to portrait to inspect the sample.</p></div>
`;
if (full) {
  main.querySelector('h1')!.textContent = 'One complete finger.';
  main.querySelector('.eyebrow')!.textContent =
    'THREE JOINTS · COORDINATED CURL';
  main
    .querySelector('#sample')!
    .setAttribute(
      'aria-label',
      'Three ivory finger segments curling around three connected brass joints',
    );
}
const comparison = document.createElement('p');
comparison.innerHTML = `<a href="?mode=${full ? 'single' : 'full'}">${full ? 'Approved single-joint sample' : 'Complete three-joint finger'} ↗</a>`;
main.append(comparison);
const host = document.querySelector<HTMLElement>('#sample')!;
const play = document.querySelector<HTMLButtonElement>('#play')!;
const view = document.querySelector<HTMLButtonElement>('#view')!;
const slider = document.querySelector<HTMLInputElement>('#bend')!;
const status = document.querySelector<HTMLElement>('#status')!;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000');
const camera = new THREE.OrthographicCamera(-1.9, 1.9, 2.25, -2.25, 0.1, 30);
let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'low-power',
  });
} catch {
  status.textContent =
    'WebGL could not start. Try a browser with hardware acceleration.';
  play.disabled = true;
  view.disabled = true;
  slider.disabled = true;
  throw new Error('Finger sample requires WebGL');
}
renderer.setPixelRatio(1);
renderer.setSize(216, 256);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
host.append(renderer.domElement);
scene.add(new THREE.HemisphereLight('#fff1d4', '#231a26', 1.2));
const key = new THREE.DirectionalLight('#fff0cd', 4.5);
key.position.set(-3, 5, 5);
scene.add(key);
const rim = new THREE.DirectionalLight('#cb7436', 2.5);
rim.position.set(4, 1, -3);
scene.add(rim);
const capLight = new THREE.DirectionalLight('#f6cb87', 1.5);
capLight.position.set(5, 3, 5);
scene.add(capLight);
const complete = full ? createCompleteFinger() : null;
const sample = complete ?? createFingerSample();
scene.add(sample.root);
let elapsed = 0;
let running = false;
let previous = 0;
let raf = 0;
let side = false;
function render() {
  sample.pose(elapsed);
  camera.position.set(side ? 7 : 3.5, 0.2, side ? 0.3 : 7);
  camera.lookAt(0, full ? -0.1 : 0, full ? 1 : 0.3);
  renderer.render(scene, camera);
  host.dataset.time = String(Math.round(elapsed));
  host.dataset.angle = String(sample.angle());
  if (complete) host.dataset.angles = JSON.stringify(complete.angles());
  host.dataset.view = side ? 'side' : 'front';
  slider.value = String(
    elapsed <= FINGER_CYCLE / 2 ? elapsed : FINGER_CYCLE - elapsed,
  );
  document.querySelector<HTMLOutputElement>('#angle')!.value =
    `${Math.round((sample.angle() * 180) / Math.PI)}°`;
}
function pause() {
  running = false;
  cancelAnimationFrame(raf);
  play.textContent = 'Play bend';
  host.dataset.state = 'paused';
}
function tick(now: number) {
  if (!running) return;
  elapsed = (elapsed + Math.max(0, now - previous)) % FINGER_CYCLE;
  previous = Math.max(previous, now);
  render();
  raf = requestAnimationFrame(tick);
}
play.addEventListener('click', () => {
  if (running) {
    pause();
    return;
  }
  running = true;
  previous = performance.now();
  host.dataset.state = 'playing';
  play.textContent = 'Pause';
  raf = requestAnimationFrame(tick);
});
view.addEventListener('click', () => {
  side = !side;
  view.textContent = side ? 'Front view' : 'Side view';
  status.textContent = side
    ? 'Side view · inspect the joint attachment'
    : 'Front three-quarter view · pixel rendering';
  render();
});
slider.addEventListener('input', () => {
  pause();
  elapsed = Number(slider.value);
  render();
});
window.addEventListener('blur', pause);
window.addEventListener('pagehide', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});
function orientation() {
  const landscape =
    matchMedia('(pointer: coarse)').matches && innerWidth > innerHeight;
  document.querySelector<HTMLElement>('#rotate')!.hidden = !landscape;
  host.inert = landscape;
  play.disabled = landscape;
  view.disabled = landscape;
  slider.disabled = landscape;
  if (landscape) pause();
}
window.addEventListener('resize', orientation);
orientation();
render();
host.dataset.state = 'ready';
