import {
  Application,
  Assets,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';
import { FRAME_COUNT, samplePose, visibleWaves } from './score';

const CELL = 256;
const PALM_X = [
  178, 175, 158, 180, 183, 176, 161, 159, 171, 178, 191, 184, 151, 146, 142,
  138, 154, 154, 146, 152, 167, 172, 171, 173,
];

export class StudyView {
  readonly app = new Application();
  private sprite!: Sprite;
  private frames: Texture[] = [];
  private field = new Graphics();
  private effects = new Graphics();
  private observer?: ResizeObserver;

  async init(host: HTMLElement) {
    await this.app.init({
      backgroundColor: 0x08080a,
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
      'Whole-hand Ictus animation above five lanes',
    );
    this.app.canvas.setAttribute('role', 'img');
    const atlas = await Assets.load<Texture>(
      `${import.meta.env.BASE_URL}assets/conductor-lab/ictus-whole-hand-v1.png`,
    );
    atlas.source.scaleMode = 'nearest';
    for (let frame = 0; frame < FRAME_COUNT; frame++)
      this.frames.push(
        new Texture({
          source: atlas.source,
          frame: new Rectangle(
            (frame % 6) * CELL,
            Math.floor(frame / 6) * CELL,
            CELL,
            CELL,
          ),
        }),
      );
    this.sprite = new Sprite(this.frames[0]);
    this.sprite.scale.set(1.18);
    this.app.stage.addChild(this.field, this.sprite, this.effects);
    this.observer = new ResizeObserver(() => this.resize(host));
    this.observer.observe(host);
    this.resize(host);
  }

  private resize(host: HTMLElement) {
    this.app.renderer.resize(host.clientWidth, host.clientHeight);
    const scale = Math.min(host.clientWidth / 480, host.clientHeight / 540);
    this.app.stage.scale.set(scale);
    this.app.stage.position.set(
      (host.clientWidth - 480 * scale) / 2,
      (host.clientHeight - 540 * scale) / 2,
    );
    const g = this.field.clear();
    for (let i = 0; i < 6; i++)
      g.moveTo(180 + i * 24, 312)
        .lineTo(32 + i * 83.2, 520)
        .stroke({ color: 0x34343b, alpha: 0.62, width: 1 });
    for (const p of [0, 0.25, 0.55, 0.82, 1]) {
      const width = 120 + 296 * p;
      g.moveTo(240 - width / 2, 312 + 208 * p)
        .lineTo(240 + width / 2, 312 + 208 * p)
        .stroke({ color: 0x34343b, alpha: p === 1 ? 0.8 : 0.4, width: 1 });
    }
    g.circle(240, 513, 3).fill(0xb8bdc8);
    this.app.render();
  }

  render(beat: number, guides: boolean) {
    const pose = samplePose(beat);
    this.sprite.texture = this.frames[pose.frame];
    this.sprite.anchor.set(PALM_X[pose.frame] / CELL, 0.66);
    this.sprite.position.set(240, 210);
    const g = this.effects.clear();
    for (const wave of visibleWaves(beat)) {
      const p = wave.progress;
      const laneSpacing = 24 + 59.2 * p;
      const centerLane = wave.startLane + (wave.width - 1) / 2;
      const x = 240 + (centerLane - 2) * laneSpacing;
      const y = 312 + p * 208;
      const width = laneSpacing * wave.width * 0.86;
      g.moveTo(x - width / 2, y)
        .quadraticCurveTo(x, y - 8 - 9 * p, x + width / 2, y)
        .stroke({ color: 0xd92d43, width: 3 + p * 2 });
      g.moveTo(x - width / 2 + 3, y + 3)
        .quadraticCurveTo(x, y - 3, x + width / 2 - 3, y + 3)
        .stroke({ color: 0x681526, width: 1 });
    }
    if (pose.release)
      g.circle(240, 206, 18).stroke({
        color: 0xffd6a1,
        alpha: pose.release * 0.75,
        width: 2,
      });
    if (guides)
      g.moveTo(230, 210)
        .lineTo(250, 210)
        .moveTo(240, 200)
        .lineTo(240, 220)
        .stroke({ color: 0x63d8d2, alpha: 0.9, width: 1 });
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
