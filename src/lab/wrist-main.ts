import * as THREE from 'three';
import { WRIST_DURATION, WRIST_BEAT, wristMotion } from './wrist-motion';
import './wrist.css';

document.querySelector('#wrist-lab')!.innerHTML = `
<main>
  <a href="${import.meta.env.BASE_URL}conductor-lab.html">← Detailed pose study</a>
  <h1>Wrist, not a lunge.</h1>
  <p>Rough motion only · not character art or a production rig.</p>
  <div id="viewport" role="img" aria-label="Simplified five-digit hand: stationary cuff, pivoting palm and rigid baton grip"></div>
  <div class="row"><button id="play">Play gesture</button><button id="slow" aria-pressed="false">¼ speed</button></div>
  <div class="row"><button id="view">Show side view</button><button id="beat">Inspect beat</button></div>
  <label for="seek">Motion <output id="time">0.00 s</output></label>
  <input id="seek" type="range" min="0" max="${WRIST_DURATION}" value="0" step="1" />
  <p id="status" role="status">Ready · player-facing view</p>
  <p class="key">Blue cuff stays put. Gold joint is the wrist. Red tip follows the baton’s arc.</p>
</main>`;

const viewport = document.querySelector<HTMLDivElement>('#viewport')!;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor('#10141b');
viewport.append(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-3.4, 3.4, 5.3, -1.5, 0.1, 100);
const palm = new THREE.Group();
scene.add(palm);
scene.add(new THREE.HemisphereLight(0xffffff, 0x536279, 2.5));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-4, 6, 7);
scene.add(light);
const ivory = new THREE.MeshStandardMaterial({
  color: '#ded8c8',
  roughness: 0.85,
});
const joint = new THREE.MeshStandardMaterial({
  color: '#ad8955',
  roughness: 0.65,
});
const cuffMaterial = new THREE.MeshStandardMaterial({
  color: '#516f88',
  roughness: 0.8,
});
const red = new THREE.MeshBasicMaterial({ color: '#ff5361' });

function sphere(
  parent: THREE.Object3D,
  p: number[],
  radius: number,
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 12),
    material,
  );
  mesh.position.set(p[0], p[1], p[2]);
  parent.add(mesh);
  return mesh;
}
function rod(
  parent: THREE.Object3D,
  a: number[],
  b: number[],
  radius: number,
  material: THREE.Material,
) {
  const start = new THREE.Vector3(...(a as [number, number, number]));
  const end = new THREE.Vector3(...(b as [number, number, number]));
  const delta = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, delta.length(), 16),
    material,
  );
  mesh.position.copy(start.add(end).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.normalize(),
  );
  parent.add(mesh);
}
const cuff = new THREE.Mesh(
  new THREE.CylinderGeometry(0.52, 0.56, 0.7, 20),
  cuffMaterial,
);
cuff.position.y = -0.52;
scene.add(cuff);
sphere(scene, [0, 0, 0], 0.25, joint);
const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.25, 0.42), ivory);
body.position.y = 0.85;
palm.add(body);
rod(palm, [0, 0, 0], [0, 0.4, 0], 0.24, ivory);
// All five digits are fixed paths in palm coordinates; no grip swapping.
const digits = [
  [
    [-0.56, 0.55, 0.1],
    [-1.02, 1.15, 0.36],
    [-0.74, 1.86, 0.48],
    [-0.43, 2.02, 0.36],
  ],
  [
    [-0.48, 1.42, 0],
    [-0.5, 2.15, 0],
    [-0.43, 2.36, 0.3],
    [-0.43, 2.05, 0.48],
  ],
  [
    [-0.06, 1.42, 0],
    [-0.06, 2.08, 0],
    [-0.06, 2.04, 0.55],
    [-0.06, 1.5, 0.63],
  ],
  [
    [0.34, 1.42, 0],
    [0.34, 1.96, 0],
    [0.34, 1.89, 0.56],
    [0.34, 1.39, 0.62],
  ],
  [
    [0.68, 1.38, 0],
    [0.7, 1.76, 0],
    [0.7, 1.68, 0.5],
    [0.7, 1.29, 0.58],
  ],
];
digits.forEach((points, digit) => {
  const radius = digit === 4 ? 0.12 : 0.15;
  points.forEach((p, i) => {
    sphere(palm, p, radius, i === 0 ? ivory : joint);
    if (i) rod(palm, points[i - 1], p, radius * 0.85, ivory);
  });
});
rod(palm, [-0.43, 1.91, 0.36], [-0.43, 4.5, 0.36], 0.045, ivory);
const tip = sphere(palm, [-0.43, 4.5, 0.36], 0.1, red);
// A faint fixed trace exposes the depth arc, especially from the side.
const points = Array.from({ length: 50 }, (_, i) =>
  new THREE.Vector3(-0.43, 4.5, 0.36).applyAxisAngle(
    new THREE.Vector3(1, 0, 0),
    -0.16 + (i / 49) * 1.61,
  ),
);
scene.add(
  new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: '#773e49',
      transparent: true,
      opacity: 0.45,
    }),
  ),
);

const play = document.querySelector<HTMLButtonElement>('#play')!;
const slow = document.querySelector<HTMLButtonElement>('#slow')!;
const view = document.querySelector<HTMLButtonElement>('#view')!;
const seek = document.querySelector<HTMLInputElement>('#seek')!;
const status = document.querySelector<HTMLElement>('#status')!;
let elapsed = 0,
  rate = 1,
  running = false,
  previous = 0,
  request = 0,
  side = false;
function draw() {
  palm.rotation.x = wristMotion(elapsed).angle;
  tip.scale.setScalar(
    1 + 0.18 * Math.exp(-Math.pow((elapsed - WRIST_BEAT) / 35, 2)),
  );
  renderer.render(scene, camera);
  seek.value = String(Math.round(elapsed));
  document.querySelector<HTMLOutputElement>('#time')!.value =
    `${(elapsed / 1000).toFixed(2)} s · ${elapsed === 0 ? 'Upright idle' : wristMotion(elapsed).phase}`;
  viewport.dataset.time = String(Math.round(elapsed));
}
function cameraView() {
  camera.position.set(side ? 10 : 0, 1.8, side ? 1.8 : 10);
  camera.lookAt(0, 1.8, side ? 1.8 : 0);
  view.textContent = side ? 'Show player view' : 'Show side view';
  viewport.dataset.view = side ? 'side' : 'player';
  draw();
}
function pause() {
  running = false;
  cancelAnimationFrame(request);
  play.textContent =
    elapsed >= WRIST_DURATION ? 'Replay gesture' : 'Play gesture';
  viewport.dataset.playing = 'false';
}
function tick(now: number) {
  if (!running) return;
  elapsed = Math.min(
    WRIST_DURATION,
    elapsed + Math.max(0, now - previous) * rate,
  );
  previous = Math.max(now, previous);
  draw();
  if (elapsed >= WRIST_DURATION) {
    pause();
    status.textContent = 'Complete · back to upright idle';
  } else request = requestAnimationFrame(tick);
}
play.onclick = () => {
  if (running) {
    pause();
    status.textContent = 'Paused';
    return;
  }
  if (elapsed >= WRIST_DURATION) elapsed = 0;
  running = true;
  previous = performance.now();
  play.textContent = 'Pause';
  viewport.dataset.playing = 'true';
  status.textContent = 'Playing · compact wrist-led beat';
  request = requestAnimationFrame(tick);
};
slow.onclick = () => {
  rate = rate === 1 ? 0.25 : 1;
  previous = performance.now();
  slow.setAttribute('aria-pressed', String(rate === 0.25));
};
seek.oninput = () => {
  elapsed = Number(seek.value);
  pause();
  draw();
  status.textContent = 'Paused for inspection';
};
view.onclick = () => {
  side = !side;
  cameraView();
};
document.querySelector<HTMLButtonElement>('#beat')!.onclick = () => {
  elapsed = WRIST_BEAT;
  pause();
  draw();
  status.textContent = 'Beat pose · no hold during playback';
};
window.addEventListener('blur', pause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});
new ResizeObserver(() => {
  const width = viewport.clientWidth,
    height = viewport.clientHeight;
  const half = 3.4;
  camera.left = -half;
  camera.right = half;
  camera.top = (half * height) / width;
  camera.bottom = -camera.top;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  draw();
}).observe(viewport);
cameraView();
