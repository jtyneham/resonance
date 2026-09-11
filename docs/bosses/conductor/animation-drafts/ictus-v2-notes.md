# Ictus revision 2 — clean matte and live magic

2026-09-11. Replaces the noisy checkerboard-keyed v1 in the isolated preview.

## Assets

Built-in image generation produced `ictus-sheet-v2-green.png` from the original
transparent character reference and the approved v4 gesture storyboard.
`scripts/prepare-conductor-v2.py` keys the green background into RGBA, including
enclosed finger spaces, preserving neutral highlights and removing green spill.

Generated rows were uneven. Measured row cuts and horizontal gutters prevent
neighboring drawings entering frames. Thirty complete hand drawings are saved in
`frames-v2/` and packed into `public/assets/conductor-lab/ictus-whole-hand-v2.png`
with matching JSON. Metadata drives rectangles, registered palms and bare tips.
After rerunning the script, run Prettier on its generated JSON.

## Playback and review limits

Character drawings advance at 30 fps for one second, then rest for one second.
Canvas/effects use native requestAnimationFrame cadence. On a 60 Hz display the
intended cadence is two refreshes per drawing; device load can cause drops.
No 60-fps guarantee is made for every phone.

The bare baton receives a separate red pulse, drifting sparks, short movement
trail and expanding Ictus flare. These sample absolute song time on each display
refresh, including while the PNG remains unchanged. Their center uses the current
frame tip. Pausing freezes both hand and effects; scrubbing reproduces them.
The 15/30 display-throttle selector is removed. Diagnostics still show measured
draw frequency and provide the deliberate 700 ms dropped-draw test.

Release now occurs at frame index16, 16/30 seconds. Preview audio accents use
finer beat subdivisions to match; the main game audio branch is unchanged.
Attack widths and authored offsets are unchanged.

This remains generated animation draft art. Detail and perspective consistency
require artistic review; frame count alone does not settle them.

## Exact generation prompt — built-in mode

Use case: stylized-concept. One animation texture atlas, exactly 6 columns x 5 rows = 30 sequential frames, 1536x1280 canvas with equal 256x256 cells, reading order. NO labels, lines, borders or numbers. Solid flat pure green #00ff00 background throughout including all holes between fingers, absolutely NO green on character and NO green lighting. Dark crisp pixel silhouette edges, no white outlines, no antialias halo.
References: first image is canonical detailed mechanical hand identity, second is approved gesture poses. Match gritty ivory armor, aged brass joints, crimson ligaments, ornamented open wrist cuff. A single five-finger mechanical HAND ONLY per cell, thumb/index pinch a slender ivory baton with all three other fingers curled. Consistent drawing scale and palette in every frame, palm centered at x150,y160 in every cell with little intentional lift. Entire object stays in cell including baton and tassels, margin 12px.
CRITICAL baton is completely BARE: no star, no glow, no red energy, no trails, no sparks at tip or anywhere else. Plain pointed ivory physical tip only. Effects will be animated separately in code.
30 different whole-hand drawings of smooth gesture. Frames1-7: three-quarter ready holding baton diagonally upper left, lifting in a small curved anticipation. Frames8-12 lift completes then moves into downstroke. Frames13-16 swing down and turn palm forward, progressively foreshorten shaft as it aims toward viewer. Frame17: aim baton DIRECTLY AT CAMERA, tight thumb/index grip with tiny foreshortened shaft. Frames18-23: continuous FRONT FACING rebound, lift short foreshortened shaft through convincing intermediate tilt angles to fully VERTICAL UP in frame23, real opposing thumb/index pads holding handle, visible small baton butt below. No hold in this pose. Frames24-30 rotate back to original ready orientation and position, continuous recovery. Do not jump instantly between front-facing short shaft and vertical long shaft: draw transition. Last frame closely matches first. Whole hand must retain five fingers, coherent construction and identical cuff design. All thirty cells contain one unique frame. Do not copy labels, sparkles, effect arcs or borders from reference.
