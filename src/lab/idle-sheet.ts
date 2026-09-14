import {
  IDLE_FRAME_COUNT,
  idleCellBounds,
  isBrightEdgeFringe,
  isPaintedMatteCandidate,
  isPaintedMatteSeed,
} from './idle-score';

const COLUMNS = 4;
const ROWS = 4;

function floodPaintedMatte(pixels: ImageData) {
  const { width, height } = pixels;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const enqueueSeed = (pixel: number) => {
    if (visited[pixel]) return;
    const offset = pixel * 4;
    if (
      !isPaintedMatteSeed(
        pixels.data[offset],
        pixels.data[offset + 1],
        pixels.data[offset + 2],
      )
    )
      return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) {
    enqueueSeed(x);
    enqueueSeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueueSeed(y * width);
    enqueueSeed(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    pixels.data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    const neighbors = [
      x > 0 ? pixel - 1 : -1,
      x < width - 1 ? pixel + 1 : -1,
      pixel >= width ? pixel - width : -1,
      pixel < width * (height - 1) ? pixel + width : -1,
    ];
    for (const neighbor of neighbors) {
      if (neighbor < 0 || visited[neighbor]) continue;
      const offset = neighbor * 4;
      if (
        !isPaintedMatteCandidate(
          pixels.data[offset],
          pixels.data[offset + 1],
          pixels.data[offset + 2],
        )
      )
        continue;
      visited[neighbor] = 1;
      queue[tail++] = neighbor;
    }
  }
}

function neutralizeBrightEdgeFringe(pixels: ImageData) {
  const { width, height } = pixels;
  const alpha = new Uint8Array(width * height);
  for (let pixel = 0; pixel < alpha.length; pixel++)
    alpha[pixel] = pixels.data[pixel * 4 + 3];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixel = y * width + x;
      if (alpha[pixel] === 0) continue;
      const touchesTransparency =
        alpha[pixel - 1] === 0 ||
        alpha[pixel + 1] === 0 ||
        alpha[pixel - width] === 0 ||
        alpha[pixel + width] === 0 ||
        alpha[pixel - width - 1] === 0 ||
        alpha[pixel - width + 1] === 0 ||
        alpha[pixel + width - 1] === 0 ||
        alpha[pixel + width + 1] === 0;
      if (!touchesTransparency) continue;
      const offset = pixel * 4;
      if (
        isBrightEdgeFringe(
          pixels.data[offset],
          pixels.data[offset + 1],
          pixels.data[offset + 2],
        )
      ) {
        pixels.data[offset] = 5;
        pixels.data[offset + 1] = 3;
        pixels.data[offset + 2] = 4;
      }
    }
  }
}

function locateBatonTips(pixels: ImageData) {
  const positions: { x: number; y: number }[] = [];
  for (let frame = 0; frame < IDLE_FRAME_COUNT; frame++) {
    const cell = idleCellBounds(frame, pixels.width, pixels.height);
    const left = cell.left;
    const top = cell.top;
    const bottom = cell.top + cell.height;
    const center = left + cell.width * 0.49;
    const searchLeft = Math.floor(center - cell.width * 0.07);
    const searchRight = Math.ceil(center + cell.width * 0.07);
    const searchBottom = Math.floor(top + (bottom - top) * 0.3);
    let tipY = searchBottom;
    let tipXTotal = 0;
    let tipPixels = 0;

    for (let y = top; y < searchBottom; y++) {
      let rowFound = false;
      for (let x = searchLeft; x <= searchRight; x++) {
        if (pixels.data[(y * pixels.width + x) * 4 + 3] < 80) continue;
        if (y < tipY) {
          tipY = y;
          tipXTotal = 0;
          tipPixels = 0;
        }
        if (y <= tipY + 2) {
          tipXTotal += x;
          tipPixels++;
          rowFound = true;
        }
      }
      if (rowFound && y > tipY + 2) break;
    }
    positions.push({
      x: (tipPixels ? tipXTotal / tipPixels : center) - left,
      y: tipY - top,
    });
  }
  return positions;
}

export function isolateIdleSheet(
  source: HTMLImageElement,
  target: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
) {
  target.width = source.naturalWidth;
  target.height = source.naturalHeight;
  context.drawImage(source, 0, 0);
  const pixels = context.getImageData(0, 0, target.width, target.height);
  floodPaintedMatte(pixels);
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const pixel = offset / 4;
    const x = pixel % target.width;
    const y = Math.floor(pixel / target.width);
    const cellWidth = target.width / COLUMNS;
    const cellHeight = target.height / ROWS;
    const localX = x % cellWidth;
    const localY = y % cellHeight;
    const outsideUpperBaton =
      localY < cellHeight * 0.27 &&
      Math.abs(localX - cellWidth * 0.49) > cellWidth * 0.052;
    const unmistakableChecker = isPaintedMatteSeed(
      pixels.data[offset],
      pixels.data[offset + 1],
      pixels.data[offset + 2],
    );
    if (outsideUpperBaton || unmistakableChecker) pixels.data[offset + 3] = 0;
  }
  neutralizeBrightEdgeFringe(pixels);
  const tipPositions = locateBatonTips(pixels);
  context.clearRect(0, 0, target.width, target.height);
  context.putImageData(pixels, 0, 0);
  return tipPositions;
}
