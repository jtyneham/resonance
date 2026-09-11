"""Key the green source, preserving warm ivory and dark silhouette edges."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / "docs/bosses/conductor/animation-drafts/ictus-sheet-v2-green.png").convert("RGB")
w, h = source.size
assert w % 6 == 0 and h % 5 == 0, "Expected an evenly divisible 6 by 5 grid"
cw, ch = w // 6, h // 5
keyed = Image.new("RGBA", source.size)
pixels = []
for r, g, b in source.get_flattened_data():
    # Green is absent from the hand palette. Cut the key and spill rather than
    # neutral highlights, which damaged the previous checkerboard extraction.
    if g > r + 6 and g > b + 6:
        pixels.append((0, 0, 0, 0))
    else:
        pixels.append((r, min(g, max(r, b)), b, 255))
keyed.putdata(pixels)
out = ROOT / "public/assets/conductor-lab/ictus-whole-hand-v2.png"
packed = Image.new("RGBA", (1536,1280))
rows = [0,221,444,657,889,1145]
palms = [157,158,156,156,157,154,156,156,155,157,155,155,155,156,148,124,121,111,112,114,121,118,121,148,155,155,153,154,153,153]
frames = []
frame_dir = ROOT / "docs/bosses/conductor/animation-drafts/frames-v2"
frame_dir.mkdir(exist_ok=True)
for i in range(30):
    x, row = i % 6 * cw, i // 6
    y, bottom = rows[row], rows[row+1]
    raw = keyed.crop((x, y, x + cw, bottom))
    dy = (256-raw.height)//2
    cell = Image.new("RGBA", (256,256))
    cell.paste(raw, (13,dy))
    # Two-pixel gutters prevent a neighboring cell's stray tip pixels bleeding
    # into this frame. Keep the source intact for future hand cleanup.
    mask_draw = ImageDraw.Draw(cell)
    for box in [(0,0,14,255),(240,0,255,255)]:
        mask_draw.rectangle(box, fill=(0,0,0,0))
    bounds = cell.getbbox()
    assert bounds and bounds[0] > 0 and bounds[2] < 256, f"Clipped cell {i}"
    # The uppermost physical ivory pixels locate the bare baton tip.
    tip_y = bounds[1]
    tip_xs = [px for px in range(256) if cell.getpixel((px, tip_y))[3] > 0]
    tip = [sum(tip_xs) / len(tip_xs), tip_y]
    cell.save(frame_dir / f"ictus-{i + 1:02}.png", optimize=True)
    px, py = i%6*256, i//6*256
    packed.paste(cell,(px,py))
    frames.append({"x":px,"y":py,"w":256,"h":256,"palm":[palms[i]+13,140+dy],"tip":tip})
packed.save(out, optimize=True)
out.with_suffix(".json").write_text(json.dumps({"image":out.name,"fps":30,"frames":frames},indent=2)+"\n",encoding="utf-8")
print("Exported 30 RGBA frames (256x256) and 1536x1280 PNG/JSON atlas")
