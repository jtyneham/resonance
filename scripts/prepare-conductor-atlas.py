"""Recover alpha from the generated Ictus sheet and validate its 6x4 grid."""

from collections import deque
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/bosses/conductor/animation-drafts/ictus-sheet-v1-opaque.png"
TARGET = ROOT / "public/assets/conductor-lab/ictus-whole-hand-v1.png"

image = Image.open(SOURCE).convert("RGB")
if image.size != (1536, 1024):
    raise SystemExit(f"Expected 1536x1024 sheet, got {image.size}")

width, height = image.size
pixels = image.load()
background = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()


def is_checker(x: int, y: int) -> bool:
    r, g, b = pixels[x, y]
    return max(r, g, b) - min(r, g, b) <= 14 and min(r, g, b) >= 110


def enqueue(x: int, y: int) -> None:
    index = y * width + x
    if not background[index] and is_checker(x, y):
        background[index] = 1
        queue.append((x, y))


for x in range(width):
    enqueue(x, 0)
    enqueue(x, height - 1)
for y in range(height):
    enqueue(0, y)
    enqueue(width - 1, y)

# The grip encloses checkerboard islands. Neutral bright pixels belong to the
# generated matte; the character's ivory highlights are warm, not neutral.
for y in range(height):
    for x in range(width):
        enqueue(x, y)

while queue:
    x, y = queue.popleft()
    if x:
        enqueue(x - 1, y)
    if x + 1 < width:
        enqueue(x + 1, y)
    if y:
        enqueue(x, y - 1)
    if y + 1 < height:
        enqueue(x, y + 1)

rgba = Image.new("RGBA", image.size)
out = rgba.load()
for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        out[x, y] = (r, g, b, 0 if background[y * width + x] else 255)

TARGET.parent.mkdir(parents=True, exist_ok=True)
rgba.save(TARGET, optimize=True)
frames_dir = ROOT / "docs/bosses/conductor/animation-drafts/frames-v1"
frames_dir.mkdir(parents=True, exist_ok=True)
frames = []
for index in range(24):
    x, y = index % 6 * 256, index // 6 * 256
    rgba.crop((x, y, x + 256, y + 256)).save(
        frames_dir / f"ictus-{index + 1:02}.png", optimize=True
    )
    frames.append({"x": x, "y": y, "w": 256, "h": 256})
metadata = {"image": TARGET.name, "fps": 24, "frames": frames}
TARGET.with_suffix(".json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {TARGET.relative_to(ROOT)} ({width // 6}x{height // 4} cells, RGBA)")
