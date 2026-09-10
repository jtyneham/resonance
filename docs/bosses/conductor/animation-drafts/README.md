# Ictus animation draft — not runtime-ready

2026-09-10. Generated using the built-in image-generation tool from the original
transparent Conductor reference and approved `storyboards/ictus-poses-v4.png`.

`ictus-sheet-v1-opaque.png` contains 24 drawings in a 6 × 4 grid, 256 px cells.
It is RGB, NOT transparent. The checkerboard is painted into the image. A second
background-extraction request also returned RGB. Neither output is production art.
No runtime animation has been replaced, and no new live preview is ready yet.

Next: obtain approval for local programmatic background extraction, or obtain a
genuinely transparent export. Then register palms, inspect grip and continuity,
and implement/test the isolated animation preview. The generated drawings still
need motion review: the frontal strike-to-vertical rebound changes abruptly;
24 drawings alone do not establish smoothness or production quality.

## Generation prompt (built-in mode)

Use case: stylized-concept. Create ONE production animation sprite sheet, exactly 6 columns by 4 rows of equal square cells, 24 sequential whole-hand frames in reading order. Transparent PNG with actual alpha, no checkerboard drawn, no black background, no text, borders or labels. Image 1 is character identity reference; image 2 is approved gesture storyboard. Detailed ivory brass crimson pixel-art mechanical conductor HAND ONLY, five fingers with thumb and index gripping thin baton, three curled free fingers, ornate cuff. Consistent proportions texture and scale, palm fixed at cell center horizontally, palm at 60 percent cell height. Entire baton and dangling cuff inside every cell with padding. 24 frames of a single smooth Ictus cycle: frames1-5 ready three-quarter pose baton upperleft then lift; frames6-9 lifted preparation; frames10-13 accelerated downstroke and perspective turning toward viewer; frame14-15 frontal hand aiming baton directly at camera foreshortened; frames16-19 continuous frontal rebound turning baton vertically upward, anatomically correct thumb-index pinch handle with small butt below grip; frames20-24 turn smoothly back to initial threequarter ready. NO pause at vertical rebound. Meaningful incremental in-between drawings, NOT repeated silhouettes, no extra hands, no disconnected baton, no motion trails. Use storyboard pose05 correct grip. All 24 equal cells exactly aligned, no uneven packing. This is a texture atlas not a presentation.

## Attempted correction prompt

Background extraction only: remove the painted gray/white checkerboard and return
RGBA with alpha-zero empty pixels; preserve all 24 drawings and their positioning;
no matte or simulated transparency. Result remained RGB and was rejected.
