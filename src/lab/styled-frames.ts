import idle from '../../docs/bosses/conductor/key-poses/ictus-rebound-review-01.png?url';
import windup from '../../docs/bosses/conductor/key-poses/ictus-styled-windup-review-01.png?url';
import strike from '../../docs/bosses/conductor/key-poses/ictus-styled-strike-clean-01.png?url';

// Register the wrist-core center and equalize cuff width. Whole drawings only:
// no warping, crossfading, cut-out fingers or sprite rotation.
export const styledFrames = [
  { url: idle, x: 720, y: 856, scale: 0.7, label: 'Upright idle' },
  { url: windup, x: 716, y: 839, scale: 0.7, label: 'Wind-up' },
  { url: strike, x: 670, y: 886, scale: 0.49, label: 'Strike' },
];

export async function loadStyled() {
  return Promise.all(
    styledFrames.map(
      ({ url }) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () =>
            reject(
              new Error('A styled drawing could not load. Reload to retry.'),
            );
          image.src = url;
        }),
    ),
  );
}

export function drawStyled(
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  index: number,
) {
  const frame = styledFrames[index];
  const image = images[index];
  context.fillStyle = '#000';
  context.fillRect(0, 0, 600, 900);
  context.imageSmoothingEnabled = false;
  context.drawImage(
    image,
    300 - frame.x * frame.scale,
    680 - frame.y * frame.scale,
    image.naturalWidth * frame.scale,
    image.naturalHeight * frame.scale,
  );
}
