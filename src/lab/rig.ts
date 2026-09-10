import {
  Assets,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';
import type { Pose } from './score';

type Part = 'palm' | 'cuff' | 'shaft' | 'tip' | 'joint' | 'baton';
const regions: Record<Part, [number, number, number, number]> = {
  palm: [75, 28, 438, 470],
  cuff: [620, 65, 395, 475],
  shaft: [1227, 32, 157, 440],
  tip: [190, 579, 182, 381],
  joint: [642, 618, 286, 284],
  baton: [1234, 476, 129, 518],
};
const radians = (degrees: number) => (degrees * Math.PI) / 180;
const fingers = [
  { x: -35, y: -75, lengths: [46, 38, 24], angles: [-45, -20, 0], width: 23 },
  {
    x: -25,
    y: -104,
    lengths: [62, 57, 29],
    angles: [-25, -70, -45],
    width: 24,
  },
  { x: 1, y: -106, lengths: [71, 55, 32], angles: [20, 45, 125], width: 24 },
  { x: 25, y: -96, lengths: [65, 47, 29], angles: [39, 38, 110], width: 22 },
  { x: 43, y: -76, lengths: [49, 37, 24], angles: [55, 30, 105], width: 19 },
];

export class ConductorRig {
  readonly root = new Container();
  readonly hand = new Container();
  readonly guides = new Container();
  readonly joints: Container[][] = [];
  readonly batonTip = new Container();
  private glow = new Graphics().circle(0, 0, 4).fill(0xff3348);
  private guidePoints: Container[] = [];

  static async create() {
    const atlas = await Assets.load<Texture>(
      `${import.meta.env.BASE_URL}assets/conductor-lab/parts.png`,
    );
    atlas.source.scaleMode = 'nearest';
    return new ConductorRig(atlas);
  }

  private constructor(atlas: Texture) {
    const textures = Object.fromEntries(
      Object.entries(regions).map(([name, rect]) => [
        name,
        new Texture({ source: atlas.source, frame: new Rectangle(...rect) }),
      ]),
    ) as Record<Part, Texture>;
    const part = (name: Part, w: number, h: number) => {
      const sprite = new Sprite(textures[name]);
      sprite.anchor.set(0.5);
      sprite.width = w;
      sprite.height = h;
      // Temporary generated art has a black matte. Screen compositing removes
      // that matte over this dark study; this is NOT a production alpha pipeline.
      sprite.blendMode = 'screen';
      return sprite;
    };
    this.root.addChild(this.hand);
    const palm = part('palm', 93, 111);
    palm.position.set(0, -63);
    this.hand.addChild(palm);
    // Back fingers first, then the thumb/index grip.
    for (const i of [4, 3, 2, 1, 0]) {
      const spec = fingers[i];
      let parent = this.hand;
      const bones: Container[] = [];
      for (let j = 0; j < 3; j++) {
        const bone = new Container();
        bone.position.set(
          j === 0 ? spec.x : 0,
          j === 0 ? spec.y : -spec.lengths[j - 1],
        );
        bone.rotation = radians(spec.angles[j]);
        parent.addChild(bone);
        const segment = part(
          j === 2 ? 'tip' : 'shaft',
          spec.width,
          spec.lengths[j] + 12,
        );
        // The sheet's segments point down. Rotate so fingertips point away from
        // the bone origin; each joint remains covered during a curl.
        segment.rotation = Math.PI;
        segment.y = -spec.lengths[j] / 2;
        bone.addChild(segment);
        const cap = part('joint', spec.width + 7, spec.width + 7);
        bone.addChild(cap);
        const guide = new Graphics().circle(0, 0, 3).fill(0x83dbd7);
        guide.visible = false;
        bone.addChild(guide);
        this.guidePoints.push(guide);
        bones.push(bone);
        parent = bone;
      }
      this.joints[i] = bones;
      if (i === 1) {
        const grip = new Container();
        grip.y = -spec.lengths[2];
        grip.rotation = radians(78);
        const baton = part('baton', 32, 165);
        baton.y = -70;
        grip.addChild(baton);
        this.batonTip.y = -148;
        grip.addChild(this.batonTip);
        parent.addChild(grip);
      }
    }
    const cuff = part('cuff', 105, 112);
    cuff.position.set(6, 24);
    this.hand.addChild(cuff);
    this.glow.position.set(9, 7);
    this.hand.addChild(this.glow);
    this.root.addChild(this.guides);
  }

  apply(pose: Pose, guides: boolean) {
    this.hand.rotation = pose.wrist;
    this.hand.y = pose.lift;
    this.joints.forEach((bones, i) =>
      bones.forEach((bone, j) => {
        bone.rotation = radians(fingers[i].angles[j]) + pose.fingers[i][j];
      }),
    );
    this.glow.alpha = 0.25 + pose.glow * 0.65;
    this.guidePoints.forEach((p) => (p.visible = guides));
  }
}
