import { Application, Graphics } from 'pixi.js';
import { ConductorRig } from './rig';
import { samplePose, visibleWaves } from './score';

export class StudyView {
  readonly app = new Application();
  rig!: ConductorRig;
  private field = new Graphics();
  private effects = new Graphics();
  private width = 480;
  private height = 560;
  private observer?: ResizeObserver;

  async init(host: HTMLElement) {
    await this.app.init({
      backgroundColor: 0x09090b,
      preference: 'webgl',
      resolution: Math.min(devicePixelRatio, 2),
      autoDensity: true,
      antialias: false,
      autoStart: false,
      width: host.clientWidth,
      height: host.clientHeight,
    });
    host.appendChild(this.app.canvas);
    this.app.canvas.setAttribute(
      'aria-label',
      'Articulated Conductor above a five-lane motion study',
    );
    this.app.canvas.setAttribute('role', 'img');
    this.rig = await ConductorRig.create();
    this.app.stage.addChild(this.field, this.rig.root, this.effects);
    this.observer = new ResizeObserver(() => this.resize(host));
    this.observer.observe(host);
    this.resize(host);
  }

  private resize(host: HTMLElement) {
    this.width = host.clientWidth;
    this.height = host.clientHeight;
    this.app.renderer.resize(this.width, this.height);
    // A fixed composition letterboxes within the resizable portrait study area.
    const s = Math.min(this.width / 480, this.height / 540);
    this.app.stage.scale.set(s);
    this.app.stage.position.set(
      (this.width - 480 * s) / 2,
      (this.height - 540 * s) / 2,
    );
    this.rig.root.position.set(296, 280);
    this.rig.root.scale.set(0.94);
    const g = this.field.clear();
    // A barely visible suggestion of a stage, with neutral musical-staff rails.
    g.moveTo(75, 275)
      .lineTo(75, 72)
      .lineTo(165, 35)
      .stroke({ color: 0x1b1b22, width: 1 });
    g.moveTo(405, 275)
      .lineTo(405, 72)
      .lineTo(315, 35)
      .stroke({ color: 0x1b1b22, width: 1 });
    for (let i = 0; i < 6; i++) {
      g.moveTo(180 + i * 24, 328)
        .lineTo(32 + i * 83.2, 520)
        .stroke({ color: 0x34343b, alpha: 0.62, width: 1 });
    }
    for (const p of [0, 0.22, 0.5, 0.8, 1]) {
      const w = 120 + 296 * p;
      g.moveTo(240 - w / 2, 328 + 192 * p)
        .lineTo(240 + w / 2, 328 + 192 * p)
        .stroke({ color: 0x34343b, width: 1, alpha: p === 1 ? 0.8 : 0.4 });
    }
    g.circle(240, 513, 3).fill(0xb8bdc8);
    this.app.render();
  }

  render(beat: number, guides: boolean) {
    const pose = samplePose(beat);
    this.rig.apply(pose, guides);
    const g = this.effects.clear();
    for (const wave of visibleWaves(beat)) {
      const p = wave.progress;
      const x = 240 + (wave.lane - 2) * (24 + 59.2 * p);
      const y = 328 + p * 192;
      const w = 18 + p * 49;
      g.moveTo(x - w / 2, y)
        .quadraticCurveTo(x, y - 8 * (0.5 + p), x + w / 2, y)
        .stroke({ color: 0xcf3045, width: 2.5 + p * 2 });
      g.moveTo(x - w / 2 + 3, y + 3)
        .quadraticCurveTo(x, y - 3, x + w / 2 - 3, y + 3)
        .stroke({ color: 0x641b30, width: 1 });
    }
    if (pose.glow > 0) {
      const tip = this.rig.batonTip.getGlobalPosition();
      const point = this.app.stage.toLocal(tip);
      g.moveTo(point.x - 8, point.y)
        .lineTo(point.x + 8, point.y)
        .moveTo(point.x, point.y - 8)
        .lineTo(point.x, point.y + 8)
        .stroke({ color: 0xffe4be, width: 2, alpha: pose.glow });
    }
    this.app.render();
    return pose;
  }

  destroy() {
    this.observer?.disconnect();
    this.app.destroy(true, {
      children: true,
      texture: true,
      textureSource: true,
    });
  }
}
