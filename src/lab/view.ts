import {
  Application,
  Assets,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';
import { FRAME_COUNT, LAB_BEAT, samplePose, visibleWaves } from './score';

type FrameArt = {
  x: number;
  y: number;
  w: number;
  h: number;
  palm: [number, number];
  tip: [number, number];
};
const HAND_SCALE = 1.18;
const HAND_Y = 215;

export class StudyView {
  readonly app = new Application();
  private sprite!: Sprite;
  private frames: Texture[] = [];
  private art: FrameArt[] = [];
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
    const base = `${import.meta.env.BASE_URL}assets/conductor-lab/`;
    const response = await fetch(base + 'ictus-whole-hand-v2.json');
    if (!response.ok) throw new Error('Could not load frame metadata');
    const metadata = (await response.json()) as {
      fps: number;
      frames: FrameArt[];
    };
    if (metadata.fps !== 30 || metadata.frames.length !== FRAME_COUNT)
      throw new Error('Unexpected animation atlas');
    this.art = metadata.frames;
    const atlas = await Assets.load<Texture>(base + 'ictus-whole-hand-v2.png');
    atlas.source.scaleMode = 'nearest';
    for (let frame = 0; frame < FRAME_COUNT; frame++)
      this.frames.push(
        new Texture({
          source: atlas.source,
          frame: new Rectangle(
            this.art[frame].x,
            this.art[frame].y,
            this.art[frame].w,
            this.art[frame].h,
          ),
        }),
      );
    this.sprite = new Sprite(this.frames[0]);
    this.sprite.scale.set(HAND_SCALE);
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
    const art = this.art[pose.frame];
    this.sprite.anchor.set(art.palm[0] / art.w, art.palm[1] / art.h);
    this.sprite.position.set(240, HAND_Y);
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
    this.drawMagic(beat);
    if (guides)
      g.moveTo(230, HAND_Y)
        .lineTo(250, HAND_Y)
        .moveTo(240, HAND_Y - 10)
        .lineTo(240, HAND_Y + 10)
        .stroke({ color: 0x63d8d2, alpha: 0.9, width: 1 });
    this.app.render();
    return pose;
  }

  private tipAt(beat: number) {
    const art = this.art[samplePose(beat).frame];
    return {
      x: 240 + (art.tip[0] - art.palm[0]) * HAND_SCALE,
      y: HAND_Y + (art.tip[1] - art.palm[1]) * HAND_SCALE,
    };
  }

  private drawMagic(beat: number) {
    const g = this.effects;
    const time = beat * LAB_BEAT;
    const tip = this.tipAt(beat);
    const release = samplePose(beat).release;
    // No stateful emitters: pause, seeking and dropped draws sample the same
    // effect. Its shape changes every display frame, independently of the PNG.
    for (let i = 5; i > 0; i--) {
      const a = this.tipAt(beat - i * 0.024);
      const b = this.tipAt(beat - (i - 1) * 0.024);
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      if (distance > 0.5 && distance < 75)
        g.moveTo(a.x, a.y)
          .lineTo(b.x, b.y)
          .stroke({ color: 0xd52136, width: 1.2, alpha: (6 - i) * 0.07 });
    }
    const pulse = 0.5 + 0.5 * Math.sin(time * 13);
    const radius = 3.5 + pulse * 1.4 + release * 5;
    for (let layer = 3; layer > 0; layer--)
      g.circle(tip.x, tip.y, radius * layer).fill({
        color: 0xff163d,
        alpha: 0.025 + (4 - layer) * 0.025,
      });
    g.circle(tip.x, tip.y, 1.2 + pulse * 0.5 + release).fill({
      color: 0xffc6b2,
      alpha: 0.9,
    });
    for (let i = 0; i < 4; i++) {
      const life = (time * (1.1 + i * 0.17) + i * 0.27) % 1;
      const angle = i * 2.4 + time * 0.6;
      const distance = 3 + life * (9 + release * 10);
      const x = tip.x + Math.cos(angle) * distance;
      const y = tip.y + Math.sin(angle) * distance;
      g.rect(x, y, 1.2, 1.2).fill({
        color: 0xf14b57,
        alpha: (1 - life) * 0.75,
      });
    }
    if (release > 0)
      g.circle(tip.x, tip.y, 5 + (1 - release) * 20).stroke({
        color: 0xf35d62,
        width: 1.5,
        alpha: release * 0.8,
      });
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
