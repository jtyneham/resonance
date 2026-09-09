import * as THREE from 'three';
import { BEAT, RULES } from '../game/config';
import type { Battle, BattleEvent } from '../game/battle';
import type { Note } from '../game/chart';

const COLORS = {
  lime: 0xd8ff72,
  cyan: 0x77d6e5,
  dark: 0xf08279,
  resonant: 0xa9c878,
  ivory: 0xe7e4d8,
  muted: 0x2f4556,
};

export class Arena {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-50, 50, 100, 0, 0.1, 1000);
  private field = new THREE.Group();
  private boss = new THREE.Group();
  private rings: THREE.Mesh[] = [];
  private spark = new THREE.Group();
  private shadow: THREE.Mesh;
  private h = 130;
  private noteMeshes = new Map<number, THREE.Group>();
  private shotMeshes: THREE.Mesh[] = [];
  private particles: {
    mesh: THREE.Mesh;
    born: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  }[] = [];
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private lastBattle: Battle | null = null;
  private reduced = false;
  private observer: ResizeObserver;
  private visualLane = 2;
  private lastTime = 0;

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x0b1018, 0);
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Five-lane battle arena. Attacks approach from the boss toward the spark.',
    );
    this.renderer.domElement.setAttribute('role', 'img');
    host.prepend(this.renderer.domElement);
    this.camera.position.set(0, 0, 200);
    this.scene.add(this.field);
    this.scene.add(new THREE.AmbientLight(0xd8f2ff, 2.4));
    const light = new THREE.DirectionalLight(0xd8ff72, 3);
    light.position.set(-30, 100, 80);
    this.scene.add(light);
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(7),
      new THREE.MeshStandardMaterial({
        color: 0x344550,
        metalness: 0.8,
        roughness: 0.35,
        emissive: 0x0d2229,
      }),
    );
    this.boss.add(core);
    const eye = this.box(7, 0.65, COLORS.lime);
    eye.position.z = 8;
    this.boss.add(eye);
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(11 + i * 4.4, i === 0 ? 0.22 : 0.1, 4, 64),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? COLORS.lime : COLORS.muted,
        }),
      );
      this.rings.push(ring);
      this.boss.add(ring);
    }
    for (let i = 0; i < 8; i++) {
      const tooth = this.box(0.5, i % 2 ? 1.5 : 3, COLORS.muted);
      const a = (i / 8) * Math.PI * 2;
      tooth.position.set(Math.sin(a) * 20, Math.cos(a) * 20, 0);
      tooth.rotation.z = -a;
      this.boss.add(tooth);
    }
    this.scene.add(this.boss);
    const body = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.5),
      new THREE.MeshBasicMaterial({ color: COLORS.lime }),
    );
    const outline = new THREE.Mesh(
      new THREE.OctahedronGeometry(3.5),
      new THREE.MeshBasicMaterial({
        color: COLORS.lime,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
    );
    this.spark.add(body, outline);
    this.spark.position.z = 15;
    this.scene.add(this.spark);
    this.shadow = this.box(6, 0.35, COLORS.lime, 0.3);
    this.shadow.position.z = 4;
    this.scene.add(this.shadow);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.resize();
  }

  setReducedMotion(reduced: boolean) {
    this.reduced = reduced;
  }

  private box(w: number, h: number, color: number, opacity = 1) {
    const mesh = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }),
    );
    mesh.scale.set(w, h, 0.7);
    return mesh;
  }

  private position(lane: number, p: number) {
    // Perspective deliberately expands close to the hit line for timing readability.
    const q = p * p;
    return {
      x: (lane - 2) * (6 + 11.6 * q),
      y: this.h * 0.6 - (this.h * 0.6 - 16) * q,
      scale: 0.34 + 0.66 * q,
    };
  }

  private line(points: number[], color: number, opacity: number) {
    const geo = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(points, 3),
    );
    return new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    );
  }

  private disposeGroup(group: THREE.Group) {
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        if (obj.geometry !== this.geometry) obj.geometry.dispose();
        const materials = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        materials.forEach((m) => m.dispose());
      }
    });
    group.clear();
  }

  private resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.h = (100 * h) / w;
    this.camera.top = this.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.disposeGroup(this.field);
    const far = this.h * 0.6;
    for (let i = 0; i < 5; i++) {
      const left = i - 2.5,
        right = left + 1;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          [
            left * 17.6,
            9,
            0,
            right * 17.6,
            9,
            0,
            right * 6,
            far,
            0,
            left * 17.6,
            9,
            0,
            right * 6,
            far,
            0,
            left * 6,
            far,
            0,
          ],
          3,
        ),
      );
      this.field.add(
        new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color: i % 2 ? 0x111c27 : 0x15212b,
            transparent: true,
            opacity: 0.7,
          }),
        ),
      );
    }
    for (let i = 0; i < 6; i++)
      this.field.add(
        this.line(
          [(i - 2.5) * 17.6, 9, 1, (i - 2.5) * 6, far, 1],
          COLORS.cyan,
          i === 0 || i === 5 ? 0.5 : 0.24,
        ),
      );
    for (const p of [0, 0.25, 0.45, 0.65, 0.85, 1]) {
      const pos = this.position(2, p),
        width = (6 + 11.6 * p * p) * 2.5;
      this.field.add(
        this.line(
          [-width, pos.y, 1, width, pos.y, 1],
          COLORS.cyan,
          p === 1 ? 0.75 : 0.1,
        ),
      );
    }
    // Small deterministic points; no textures or downloaded art.
    for (let i = 0; i < 30; i++) {
      const dot = this.box(0.18, 0.18, COLORS.cyan, 0.3);
      dot.position.set(((i * 47) % 97) - 48, (i * 29) % this.h, -1);
      this.field.add(dot);
    }
  }

  private createNote(note: Note) {
    const group = new THREE.Group();
    const w = note.width * 16.8;
    if (note.kind === 'barrier') {
      const body = this.box(w, 10, 0x566474, 0.85);
      body.position.y = 5;
      group.add(body);
      const top = this.box(w, 0.8, COLORS.ivory);
      top.position.y = 10;
      group.add(top);
      for (let i = 0; i < note.width; i++) {
        const slash = this.box(0.7, 9, COLORS.ivory, 0.65);
        slash.position.set((i - (note.width - 1) / 2) * 16.8, 5, 2);
        slash.rotation.z = -0.28;
        group.add(slash);
      }
    } else {
      const color = note.kind === 'resonant' ? COLORS.resonant : COLORS.dark;
      group.add(this.box(w, 2.5, color, 0.2));
      const stripe = this.box(w, 0.85, color);
      stripe.position.z = 2;
      group.add(stripe);
      if (note.kind === 'resonant') {
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.45),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.85,
          }),
        );
        gem.position.z = 3;
        group.add(gem);
      } else {
        for (let i = 0; i < note.width; i++) {
          const notch = this.box(0.65, 2.5, color);
          notch.position.x = (i - (note.width - 1) / 2) * 16.8;
          group.add(notch);
        }
      }
    }
    group.position.z = 5;
    this.scene.add(group);
    this.noteMeshes.set(note.id, group);
    return group;
  }

  feedback(event: BattleEvent, now: number) {
    if (
      this.reduced ||
      event.kind === 'move' ||
      event.kind === 'miss' ||
      event.kind === 'jump'
    )
      return;
    const p = this.position(event.lane, 1);
    const bossHit = event.kind === 'boss-hit';
    for (let i = 0; i < 10; i++) {
      const color = event.kind === 'damage' ? COLORS.dark : COLORS.lime;
      const mesh = this.box(0.65, 0.65, color);
      this.scene.add(mesh);
      const a = (i * Math.PI * 2) / 10;
      this.particles.push({
        mesh,
        born: now,
        x: bossHit ? 0 : p.x,
        y: bossHit ? this.h * 0.84 : p.y,
        vx: Math.cos(a) * 18,
        vy: Math.sin(a) * 18,
      });
    }
  }

  render(battle: Battle | null, now: number) {
    const dt = Math.min(0.05, now - this.lastTime);
    this.lastTime = now;
    if (battle !== this.lastBattle) {
      for (const group of this.noteMeshes.values()) {
        this.scene.remove(group);
        this.disposeGroup(group);
      }
      this.noteMeshes.clear();
      this.lastBattle = battle;
      this.visualLane = battle?.lane ?? 2;
    }
    const t = battle?.time ?? now * 0.35;
    const pulse = this.reduced
      ? 0
      : Math.max(0, 1 - ((Math.max(0, t) / BEAT) % 1) * 3);
    this.boss.position.set(0, this.h * 0.81, 0);
    this.boss.scale.setScalar(0.9 + pulse * 0.025);
    this.rings.forEach((ring, i) => {
      ring.rotation.x = this.reduced ? 0.3 : Math.sin(t * 0.3 + i) * 0.5;
      ring.rotation.y = this.reduced ? 0.2 : Math.cos(t * 0.2 + i) * 0.45;
      ring.rotation.z = this.reduced ? 0 : t * (i % 2 ? -0.2 : 0.15);
    });
    this.visualLane +=
      ((battle?.lane ?? 2) - this.visualLane) * (1 - Math.exp(-dt * 55));
    const player = this.position(this.visualLane, 1);
    const air = battle?.airborne()
      ? Math.sin(((battle.time - battle.jumpAt) / RULES.jumpDuration) * Math.PI)
      : 0;
    this.spark.position.set(player.x, player.y + 2.5 + air * 9, 15);
    this.spark.rotation.y = this.reduced ? 0 : t * 1.5;
    this.spark.rotation.z = air * 0.8;
    this.spark.visible =
      !battle ||
      battle.time >= battle.immuneUntil ||
      Math.floor(now * 12) % 2 === 0;
    this.shadow.position.set(player.x, player.y, 4);
    if (battle) {
      for (const note of battle.chart) {
        const progress = (battle.time - (note.hit - note.travel)) / note.travel;
        let group = this.noteMeshes.get(note.id);
        const visible =
          progress >= 0 && progress < 1.17 && !battle.resolved.has(note.id);
        if (!visible) {
          if (group) group.visible = false;
          continue;
        }
        group ??= this.createNote(note);
        group.visible = true;
        const p = this.position(
          note.lane + (note.width - 1) / 2,
          Math.max(0, progress),
        );
        group.position.set(p.x, p.y, 5);
        group.scale.setScalar(p.scale);
      }
      battle.shots.forEach((shot, index) => {
        let mesh = this.shotMeshes[index];
        if (!mesh) {
          mesh = this.box(1.8, 6, COLORS.lime);
          this.scene.add(mesh);
          this.shotMeshes[index] = mesh;
        }
        mesh.visible = !shot.resolved;
        const p = this.position(
          shot.lane,
          Math.max(0, 1 - (battle.time - shot.born) / RULES.shotDuration),
        );
        mesh.position.set(p.x, p.y, 12);
        mesh.scale.set(1.8 * p.scale, 6 * p.scale, 1);
      });
    }
    for (let i = battle?.shots.length ?? 0; i < this.shotMeshes.length; i++)
      this.shotMeshes[i].visible = false;
    this.particles = this.particles.filter((p) => {
      const age = now - p.born;
      if (age > 0.4) {
        this.scene.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
        return false;
      }
      p.mesh.position.set(p.x + p.vx * age, p.y + p.vy * age, 20);
      p.mesh.scale.setScalar((1 - age / 0.4) * 0.7);
      return true;
    });
    this.renderer.render(this.scene, this.camera);
  }
}
