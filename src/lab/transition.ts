import strike from '../../docs/bosses/conductor/key-poses/ictus-strike-review-01.png?url';
import a15 from '../../docs/bosses/conductor/key-poses/transition-01/angle-15.png?url';
import a30 from '../../docs/bosses/conductor/key-poses/transition-01/angle-30.png?url';
import a45 from '../../docs/bosses/conductor/key-poses/transition-01/angle-45.png?url';
import a60 from '../../docs/bosses/conductor/key-poses/transition-01/angle-60.png?url';
import a75 from '../../docs/bosses/conductor/key-poses/transition-01/angle-75.png?url';
import rebound from '../../docs/bosses/conductor/key-poses/ictus-rebound-review-01.png?url';
import preparation from '../../docs/bosses/conductor/key-poses/ictus-preparation-review-01.png?url';
import downstroke from '../../docs/bosses/conductor/key-poses/ictus-downstroke-review-01.png?url';

// Register the wrist opening and hand scale; never deform or blend the drawings.
export const transitionFrames = [
  { url: strike, x: 740, y: 765, scale: 0.525 },
  { url: a15, x: 720, y: 765, scale: 0.7 },
  { url: a30, x: 720, y: 804, scale: 0.7 },
  { url: a45, x: 720, y: 824, scale: 0.7 },
  { url: a60, x: 720, y: 850, scale: 0.7 },
  { url: a75, x: 720, y: 850, scale: 0.7 },
  { url: rebound, x: 720, y: 856, scale: 0.7 },
  { url: preparation, x: 718, y: 842, scale: 0.7 },
  { url: downstroke, x: 730, y: 802, scale: 0.66 },
];

export async function loadTransition() {
  return Promise.all(
    transitionFrames.map(
      ({ url }) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () =>
            reject(
              new Error(
                'A transition drawing could not load. Reload to retry.',
              ),
            );
          image.src = url;
        }),
    ),
  );
}

export function drawTransition(
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  index: number,
) {
  const frame = transitionFrames[index];
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
