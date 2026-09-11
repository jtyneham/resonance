# Ictus animation drafts — historical experiments

The lab now shows the original reference as a static image. V3 was rejected and
removed; v1/v2 are historical artifacts and are not loaded by the lab. Its passing
technical tests did not establish acceptable art or animation quality.
See [the reset and next pose-review steps](../animation-direction.md).
The notes below describe the superseded v1 experiment.

2026-09-10. Generated using the built-in image-generation tool from the original
transparent Conductor reference and approved `storyboards/ictus-poses-v4.png`.

`ictus-sheet-v1-opaque.png` contains 24 drawings in a 6 × 4 grid, 256 px cells.
It is RGB, NOT transparent. The checkerboard is painted into the image. A second
background-extraction request also returned RGB. Neither output is production art.
On 2026-09-11, local extraction (authorized by the user) produced actual RGBA.
The script `scripts/prepare-conductor-atlas.py` removes the neutral matte including
enclosed grip islands, exports 24 PNGs in `frames-v1/`, and writes a PNG/JSON atlas
to `public/assets/conductor-lab/ictus-whole-hand-v1.*`. Warm ivory is retained;
neutral highlights and edge pixels can be affected by matte recovery. Treat this
as cleaned draft art, not a lossless production extraction.

After rerunning the extraction script, format the generated JSON with
`npx prettier --write public/assets/conductor-lab/ictus-whole-hand-v1.json`
before the repository formatting check.

The isolated `/resonance/conductor-lab.html` preview now uses those complete
drawings, sampled at 24 fps from the audio clock. One second of motion is followed
by one second in ready pose. The first frontal frame (index13) releases the
formation at 13/24 seconds. The vertical rebound has no added hold. Attacks and
animation are functions of absolute time, so scrubbing does not accumulate attacks.

Next: review the motion in the live preview. The frontal strike-to-vertical
rebound changes abruptly, and generated detail varies across drawings; 24 frames
alone do not establish smoothness or production quality. Refining that transition
requires better in-between drawings, not merely a higher display refresh rate.

## Generation prompt (built-in mode)

Use case: stylized-concept. Create ONE production animation sprite sheet, exactly 6 columns by 4 rows of equal square cells, 24 sequential whole-hand frames in reading order. Transparent PNG with actual alpha, no checkerboard drawn, no black background, no text, borders or labels. Image 1 is character identity reference; image 2 is approved gesture storyboard. Detailed ivory brass crimson pixel-art mechanical conductor HAND ONLY, five fingers with thumb and index gripping thin baton, three curled free fingers, ornate cuff. Consistent proportions texture and scale, palm fixed at cell center horizontally, palm at 60 percent cell height. Entire baton and dangling cuff inside every cell with padding. 24 frames of a single smooth Ictus cycle: frames1-5 ready three-quarter pose baton upperleft then lift; frames6-9 lifted preparation; frames10-13 accelerated downstroke and perspective turning toward viewer; frame14-15 frontal hand aiming baton directly at camera foreshortened; frames16-19 continuous frontal rebound turning baton vertically upward, anatomically correct thumb-index pinch handle with small butt below grip; frames20-24 turn smoothly back to initial threequarter ready. NO pause at vertical rebound. Meaningful incremental in-between drawings, NOT repeated silhouettes, no extra hands, no disconnected baton, no motion trails. Use storyboard pose05 correct grip. All 24 equal cells exactly aligned, no uneven packing. This is a texture atlas not a presentation.

## Attempted correction prompt

Background extraction only: remove the painted gray/white checkerboard and return
RGBA with alpha-zero empty pixels; preserve all 24 drawings and their positioning;
no matte or simulated transparency. Result remained RGB and was rejected.
