# Ictus storyboard — review draft v1

Latest revision: [v4 board](ictus-poses-v4.png) and
[revision notes and prompts](ictus-v4-notes.md). Pose05's grip is corrected so
thumb and index visibly pinch the separate vertical baton handle, with three
free fingers beside them. At the user's request, pose04 now
aims the baton toward the player/camera; pose05 stays frontal with the baton
vertical, passing directly into recovery without a hold. The lower-left impact below records the
superseded v1 exploration; it is not the current target gesture.

Status: created for user review. Gesture, anatomy and visual fidelity are not yet
approved for animation production.

## Files and source

- Review board: `ictus-poses-v1.png`.
- Canonical production reference: `../Conductor_visual_transparent.png`.
- Original character reference retained: `../Conductor_visual.png`.
- Produced with the built-in image-generation tool, followed by one targeted
  correction for framing and the preparation pose.
- The supplied animated idle WebP and the rejected procedural rig were not used.

## Reading order

Read the top row left to right (01–03), then the bottom row (04–05).
Ready → preparation → downstroke → Ictus/release → rebound.

The important motion is the baton tip rising, sweeping down through horizontal,
stopping at a low beat point, then recovering upward. Fingers retain the pinch
and tighten toward impact. The red crescent under 04 indicates the attack release.
The small trajectory diagram is schematic, not a measured path or final timing.

## Review findings and limits

The board provides five visibly different complete-hand poses and a clear change
in baton-tip height. The second generation improves the framing but does not
establish exact palm registration. Fine ornaments and hand proportions still vary
between poses. Preparation should carry the palm upward along with the baton;
the illustrated change in palm height is currently modest.

This PNG is a labeled storyboard on a dark background. It is not a transparent
sprite atlas, animation, source-frame set or pixel-exact extension of the
reference. Do not crop it into runtime frames and call the animation finished.

Next gate: user reviews the stroke and silhouette. Then create consistent,
individually registered whole-hand frames with true transparency, controlled
in-betweens, recovery to the shared ready pose and the chart-owned release point.
The prior discussion's roughly 24 unique frames/second is a trial target; exact
frame count and musical duration still need the animation proof. More generated
frames alone do not establish smoothness or identity consistency.

No animation code or live-preview content was changed for this storyboard.

## Initial generation prompt

```text
Use case: stylized-concept.
Asset type: ONE five-key-pose animation STORYBOARD review sheet for the pixel-art game boss THE CONDUCTOR.
Reference image 1: canonical original transparent Conductor, sole character design source. Re-pose this exact hand; preserve identity, ivory plates, dense brass joint ornament, crimson ligaments, ornate oval cuff, hanging threads, and the long thin ivory baton with crimson tip. Five fingers total: thumb and index pinch the baton, middle/ring/little cluster naturally beside them. Same handedness and palm-side three-quarter view throughout. No arm, body, face, redesign, detached modules, crab legs, extra fingers or baton.

Output: wide landscape sheet about 3072x2048. Solid near-black review background (this is an illustrated storyboard, NOT a transparent runtime sprite atlas). Subtle panel dividers; five large complete-hand drawings arranged THREE across the top row and TWO across the bottom row; bottom-right sixth area contains a small simple trajectory diagram only, no sixth hand. Label panels clearly "01 READY", "02 PREPARE", "03 DOWNSTROKE", "04 ICTUS", "05 REBOUND"; header "THE CONDUCTOR / ICTUS — POSE STUDY". Small note "KEY POSES • TIMING TO FOLLOW".
All five drawings must be comparably sized, contain full baton tips and hanging threads, with generous padding. PALM center horizontally centered in each panel; scale down sufficiently for the long baton to fit to the left. Fixed camera; no zoom differences. Keep the cuff below the palm, fingers above, as in reference. Same character proportions all panels. Grungy detailed pixel-cluster rendering closely matches reference; avoid smooth 3D shading or airbrushed surfaces.

Pose 01 READY: preserve the reference pinching-hand pose essentially exactly, baton pointing upper-left at a shallow angle, three free fingers naturally curled and grouped.
Pose 02 PREPARE: palm lifts modestly, wrist bends back, thumb/index grip raises the baton tip high toward upper-left at a noticeably steeper angle (roughly 65 degrees above horizontal). Middle/ring/little fingers loosen slightly but stay clustered. Visible preparation tension.
Pose 03 DOWNSTROKE: hand descends through the middle of its stroke; wrist flexes forward, baton tip now sweeps through almost horizontal leftward, free fingers progressively close. The finger poses CHANGE; do not merely rotate the entire unchanged hand. A single thin subdued crimson arrow beside the baton indicates downward travel, with no ghost hands.
Pose 04 ICTUS: at decisive LOWEST beat point the palm is lower than rest by about one-quarter palm height and the wrist sharply flexed. Baton tip points LOWER-LEFT, roughly 40 degrees below horizontal, visibly well below its position in 03; three free fingers have tightened together. Tiny sharp ivory/crimson star at baton tip, no large effects covering anatomy. One small red low-hazard crescent below and separated from baton tip illustrates release. Pose reads a deliberate downbeat with momentum arrested, not a sideways magic spell.
Pose 05 REBOUND: palm recovering upward, wrist has bounced back, baton tip lifted above horizontal again but lower than peak 02; three free fingers begin loosening, trailing crimson threads lag slightly downward. Clearly different from 04 and smoothly approaching 01.
Trajectory diagram bottom-right: thin crimson arc with arrow DOWN and back UP, with five numbered dots in correspondence to 01–05. Text "LIFT → STRIKE → REBOUND" and "Release at 04". No invented BPM or timing.
Priority: unmistakably SAME coherent mechanical HAND in five meaningfully distinct poses; strong tip-height change and believable wrist/finger articulation; reference texture, silhouette and identity preserved. Five storyboard poses only, no game controls or arena.
```

## Targeted correction prompt

```text
Edit image 1: the five-pose Conductor storyboard. Image 2 is the canonical character reference; preserve that character identity. Keep the board layout, headings, panel labels, dark background, trajectory diagram, pixel texture and all five distinct gestures. Targeted corrections:
1. In EACH of the five panels, reduce the complete character to a consistent modestly smaller scale so its full baton and hanging threads fit. Position the actual PALM at the HORIZONTAL CENTER of its panel (approximately 270px into a 512px panel), rather than near its right border. The long baton extends LEFT from this central hand, with at least 25px padding to the panel edge. Leave space on the right; do not balance the bounding box of the baton instead of the palm. No clipping.
2. Pose 02 PREPARE must clearly LIFT: its palm sits about a quarter palm-height higher than pose01, wrist bends back and baton points steeply upper-left, about60degrees above horizontal. Fingers loosen slightly but remain recognizably the same clustered anatomical hand. Keep correct thumb/index pinch.
3. Keep pose03 baton almost horizontal, pose04 baton steeply lower-left with the lowest tip and tightly grouped free fingers, and pose05 a recovering upward baton midway back toward02. Place pose04 palm slightly below rest. In every panel cuff remains below the palm and same size.
4. Preserve the canonical anatomy, correct five fingers, ivory/brass/crimson, oval wrist cuff and naturally curled fingers. Avoid extra joints, a fist replacing the hand, or newly invented machinery.
This remains a storyboard review image, not runtime atlas. No new panels, labels or other changes.
```
