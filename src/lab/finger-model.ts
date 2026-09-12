import * as THREE from 'three';

export const FINGER_CYCLE = 2400;
export function fingerAngle(ms: number) {
  const time = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  return (1 - Math.cos((time / FINGER_CYCLE) * Math.PI * 2)) * 0.63;
}

// A shared smooth curl: the tip starts more gently than the middle joint.
export function completeFingerAngles(ms: number) {
  const curl = fingerAngle(ms) / 1.26;
  return [curl * 0.28, curl * 0.85, curl * curl * 0.55] as const;
}

export function createCompleteFinger() {
  // Reuse the approved sample's geometry/materials, not a new visual treatment.
  const template = createFingerSample().root;
  const root = new THREE.Group();
  root.name = 'complete-finger';
  root.position.y = -1.8;
  root.scale.setScalar(0.86);
  const pivots: THREE.Group[] = [];
  let parent = root;
  for (const [index, length, width] of [
    [0, 1.9, 1],
    [1, 1.5, 0.85],
    [2, 1.15, 0.7],
  ]) {
    const hardware = new THREE.Group();
    hardware.name = `joint-hardware-${index}`;
    hardware.scale.setScalar(width);
    parent.add(hardware);
    for (const part of template.children) {
      if (
        part.name === 'proximal-ivory' ||
        part.name === 'distal-hinge' ||
        part.name.startsWith('ivory-collar')
      )
        continue;
      hardware.add(part.clone());
    }
    const pivot = new THREE.Group();
    pivot.name = `finger-pivot-${index}`;
    parent.add(pivot);
    pivots.push(pivot);
    const source = template.getObjectByName(
      index === 2 ? 'distal-ivory' : 'proximal-ivory',
    )!;
    const plate = source.clone();
    plate.name = `finger-plate-${index}`;
    // Middle/base plates terminate before the next axle. The tip has a closed rounded end.
    plate.scale.set(width, index === 2 ? length / 1.68 : length / 2.04, width);
    plate.position.y = index === 2 ? 0 : length;
    pivot.add(plate);
    const collarSource = template.getObjectByName('distal-hinge')!;
    for (const part of collarSource.children) {
      if (!part.name.startsWith('ivory-collar')) continue;
      const collar = part.clone();
      collar.scale.multiplyScalar(width);
      collar.position.y *= width;
      pivot.add(collar);
    }
    if (index < 2) {
      const next = new THREE.Group();
      next.name = `next-joint-${index}`;
      next.position.y = length;
      pivot.add(next);
      parent = next;
    }
  }
  return {
    root,
    pose(ms: number) {
      completeFingerAngles(ms).forEach((angle, i) => {
        pivots[i].rotation.x = angle;
      });
    },
    angle: () => pivots[1].rotation.x,
    angles: () => pivots.map((pivot) => pivot.rotation.x),
  };
}

// Texture coordinates belong to each solid segment, not the screen.
function surface(seed: number, brass: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.fillStyle = brass ? '#936029' : '#dfcfaa';
  ctx.fillRect(0, 0, 128, 128);
  const colors = brass
    ? ['#bf8d48', '#603e24', '#a97635', '#d0a25c']
    : ['#c5b592', '#ecdfbd', '#b8a282', '#d3c19d'];
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = colors[Math.floor(random() * colors.length)];
    ctx.fillRect(
      Math.floor(random() * 128),
      Math.floor(random() * 128),
      1 + Math.floor(random() * 3),
      1 + Math.floor(random() * 2),
    );
  }
  if (!brass) {
    // Deliberate front-facing fissures: the random micro-wear alone disappears
    // at the small test resolution. These marks remain in object UV space.
    for (const [x, y, color] of [
      [10, 24, '#81302c'],
      [22, 76, '#665344'],
    ] as const) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 3, y + 9);
      ctx.lineTo(x + 1, y + 15);
      ctx.lineTo(x + 5, y + 24);
      ctx.lineTo(x + 4, y + 32);
      ctx.moveTo(x + 1, y + 15);
      ctx.lineTo(x - 3, y + 20);
      ctx.stroke();
    }
    for (let i = 0; i < 9; i++) {
      let x = 8 + random() * 105;
      let y = 8 + random() * 85;
      ctx.strokeStyle = i % 3 === 0 ? '#8f2831' : '#756151';
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.65;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        x += (random() - 0.5) * 13;
        y += 3 + random() * 5;
        ctx.lineTo(Math.round(x), Math.round(y));
      }
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function createFingerSample() {
  const root = new THREE.Group();
  root.name = 'finger-sample';
  const pivot = new THREE.Group();
  pivot.name = 'distal-hinge';
  root.add(pivot);
  const ivory = (seed: number) =>
    new THREE.MeshStandardMaterial({
      map: surface(seed, false),
      roughness: 0.85,
      metalness: 0,
    });
  const gold = new THREE.MeshStandardMaterial({
    map: surface(51, true),
    metalness: 0.72,
    roughness: 0.46,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: '#dfb365',
    metalness: 0.65,
    roughness: 0.32,
  });
  const recess = new THREE.MeshStandardMaterial({
    color: '#36241c',
    metalness: 0.5,
    roughness: 0.75,
  });
  function add(
    parent: THREE.Group,
    name: string,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    parent.add(mesh);
    return mesh;
  }
  function segment(
    parent: THREE.Group,
    name: string,
    points: number[][],
    seed: number,
  ) {
    const geometry = new THREE.LatheGeometry(
      points.map(([x, y]) => new THREE.Vector2(x, y)),
      24,
    );
    // Elliptical cross section: an armored digit, not a flat card.
    geometry.scale(1, 1, 0.86);
    add(parent, name, geometry, ivory(seed));
  }
  segment(
    root,
    'proximal-ivory',
    [
      [0, -1.82],
      [0.22, -1.82],
      [0.32, -1.72],
      [0.37, -1.48],
      [0.36, -0.58],
      [0.32, -0.29],
      [0.22, -0.22],
      [0, -0.22],
    ],
    18,
  );
  segment(
    pivot,
    'distal-ivory',
    [
      [0, 0.22],
      [0.22, 0.22],
      [0.31, 0.3],
      [0.34, 0.46],
      [0.32, 1.13],
      [0.26, 1.45],
      [0.15, 1.62],
      [0, 1.68],
    ],
    93,
  );
  const axle = add(
    root,
    'recessed-axle',
    new THREE.CylinderGeometry(0.29, 0.29, 0.63, 24),
    recess,
  );
  axle.rotation.z = Math.PI / 2;
  for (const side of [-1, 1]) {
    const disc = add(
      root,
      'brass-joint-' + side,
      new THREE.CylinderGeometry(0.33, 0.33, 0.095, 32),
      gold,
    );
    disc.rotation.z = Math.PI / 2;
    disc.position.x = side * 0.34;
    const rim = add(
      root,
      'beveled-rim-' + side,
      new THREE.TorusGeometry(0.286, 0.034, 6, 32),
      edge,
    );
    rim.rotation.y = Math.PI / 2;
    rim.position.x = side * 0.394;
    const hub = add(
      root,
      'axle-cap-' + side,
      new THREE.CylinderGeometry(0.127, 0.15, 0.045, 8),
      edge,
    );
    hub.rotation.z = Math.PI / 2;
    hub.position.x = side * 0.409;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const rivet = add(
        root,
        'rim-rivet-' + side + '-' + i,
        new THREE.SphereGeometry(0.021, 6, 4),
        recess,
      );
      rivet.position.set(side * 0.397, Math.cos(a) * 0.23, Math.sin(a) * 0.23);
    }
  }
  for (const [parent, y] of [
    [root, -0.36],
    [pivot, 0.36],
  ] as const) {
    for (const offset of [-0.04, 0.04]) {
      const ring = add(
        parent,
        'ivory-collar-' + y + '-' + offset,
        new THREE.TorusGeometry(0.325, 0.035, 6, 32),
        offset < 0 ? gold : edge,
      );
      ring.rotation.x = Math.PI / 2;
      ring.scale.y = 0.86;
      ring.position.y = y + offset;
    }
  }
  return {
    root,
    pose(ms: number) {
      pivot.rotation.x = fingerAngle(ms);
    },
    angle: () => pivot.rotation.x,
  };
}
