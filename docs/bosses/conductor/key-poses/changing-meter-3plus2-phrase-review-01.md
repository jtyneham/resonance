# Changing Meter 3+2 phrase review 01

Date: 2026-09-19

Review URL: `meter-phrase-lab.html`

## Scope

Twenty complete whole-hand raster drawings form the first continuous five-beat
Conductor phrase. The phrase is grouped `3+2`, with major accents on beats one
and four. It is a bounded animation review, not a final encounter chart.

The stage demonstration uses the approved review mapping:

1. one-lane red arc;
2. intentional rest;
3. two-lane red arc;
4. two-lane abstract organ-pipe barrier;
5. one-lane red arc.

No absorbable resonance event belongs to this phrase. Absorbables remain authored
by the stage independently of all boss animation and attacks.

## Calibration and implementation

- Whole-character 2D frames; no layered character rig, 3D reconstruction,
  crossfade or pose morphing.
- The wrist core uses one fixed screen anchor and one constant scale across all
  frames.
- Runtime brightness calibration matches the approved Ictus presentation more
  closely while preserving the source pixels.
- Baton-tip magic, low arcs and pipe barriers are live Canvas effects and are not
  baked into the character drawings.
- Playback is driven by `requestAnimationFrame`; the twenty authored drawings are
  intentionally discrete within the provisional 120 BPM bar.

## Asset generation

The sprite sheet was generated with the built-in image-generation tool using the
approved Ictus wind-up, Ictus stroke and corrected idle sheet as strict identity,
palette and motion references. The production prompt required five digits, fixed
anatomy and registration, a tapered baton without a baked tip effect, true alpha,
and a seamless upright endpoint. The generated project asset is
`changing-meter-3plus2-phrase-review-01.png`.

This sheet still requires user review in motion. Approval of the timing sketch or
Ictus does not automatically approve these new drawings.

## Focused motion revision

The second review pass keeps the original twenty drawings but no longer gives
them equal screen time. Beats now land on authored wrist accents at 250, 750,
1250, 1750 and 2250 ms. Beats one and four receive the clearest tip-impact flash
and still release their attacks at that exact instant. Attack travel is circular
across the bar boundary so the stage does not visibly empty when the character
loop wraps.

Two selected return drawings from
`changing-meter-return-bridge-review-01.png` connect the final rebound to the
exact opening pose. The first two generated bridge candidates remain in the
source strip for provenance but are intentionally unused: their diagonal motion
would move backward relative to the approved final phrase pose. The review page
also includes a paused actual-scale calibration against the approved Ictus pose.
Phrase, Ictus and translucent overlay views occupy the identical wrist-core
anchor and never resize for comparison.

Actual-scale review showed that the phrase silhouette was approximately 8–10%
smaller than the approved Ictus presentation. Phrase playback is therefore
calibrated from `1.80` to `1.96`; the return bridge is increased proportionally
from `0.70` to `0.76`. Wrist-core registration remains unchanged.

### Selected built-in generation prompt

```text
Use case: stylized-concept
Asset type: production-bound 2D whole-character pixel-art animation sprite sheet for the Resonance browser game
Primary request: Create one coherent twenty-frame animation sheet of The Conductor performing a continuous five-beat conducting phrase grouped 3+2. The motion must originate chiefly at the wrist and flow continuously: beat 1 a firm compact downward ictus, beats 2 and 3 smaller connected inward/outward wrist gestures, beat 4 a second strong accented cue with a slightly broader lateral wrist stroke, beat 5 a controlled rebound that resolves exactly into the initial upright baton pose. The animation reads ONE-two-three, FOUR-five. It is a conducting phrase, not five disconnected attack poses.
Input images: Image 1 is the approved upright-to-windup identity, palette, scale and detail reference. Image 2 is the approved wrist-stroke/perspective and forward-pointing baton reference. Image 3 is the approved idle identity, brightness and upright endpoint reference.
Subject: the exact same ornate supernatural five-digit hand called The Conductor, ivory segmented fingers, brass joints and wrist ornament, crimson cloth/energy, one baton pinched between thumb and index finger, central red wrist-core eye, hanging ornaments.
Style/medium: detailed semi-pixel-art raster matching the references exactly; crisp controlled pixels; consistent line weight; no smoothing blur.
Composition/framing: a clean 5-column by 4-row sprite sheet, twenty equal square cells read left-to-right then top-to-bottom; one complete whole-hand drawing centered by the wrist-core in every cell; identical scale and registration in all cells; generous cell margins so nothing crosses cell boundaries.
Lighting/mood: dark restrained theatrical lighting identical to the approved Ictus references.
Color palette: match reference ivory, aged brass, deep crimson and black exactly; identical brightness and contrast across all twenty cells.
Constraints: preserve exactly five digits including thumb; preserve identical anatomy, proportions, ornament count, central wrist-core, grip, baton length and silhouette identity in every frame. Start and final frame must be the exact upright baton pose and match seamlessly. The palm stays spatially stable; motion is mainly wrist flexion/rotation with subtle physically plausible secondary follow-through in free fingers, cloth strips and hanging ornaments. Baton tip is plain and tapered because the live red magical sparkle is added separately in code. Transparent background if possible; otherwise pure uniform black.
Avoid: text, labels, borders, numbers, checkerboard painted into the image, extra fingers, missing fingers, duplicated batons, short batons, round knobs at the baton tip, white edge noise, palette drift, brightness drift, scale drift, moving the whole character around the frame, 3D rendering, skeletal rig appearance, motion trails, attack projectiles, lanes, scenery, crossfades or morphing.
```

### Return bridge generation prompt

```text
Use case: stylized-concept
Asset type: four-frame return bridge for an existing 2D whole-character pixel-art animation
Primary request: Create exactly four sequential in-between drawings that transition The Conductor smoothly from the bottom-right final pose of Image 1 back into the top-left opening upright-baton pose of Image 1. This is the final 300 milliseconds of a seamless looping five-beat conducting phrase. The wrist gently completes its rebound and settles into the exact upright orientation without a visible reset.
Input images: Image 1 is the active twenty-frame phrase sheet; its bottom-right cell is the starting pose for this bridge and its top-left cell is the ending pose. Image 2 is the authoritative identity, scale, palette, brightness, upright endpoint and five-digit anatomy reference.
Subject: the exact same ornate supernatural five-digit hand called The Conductor, with ivory segmented fingers, aged-brass joints and wrist ornament, deep crimson cloth/energy, one tapered baton pinched between thumb and index finger, central red wrist-core eye and hanging ornaments.
Style/medium: detailed semi-pixel-art raster matching both references exactly; crisp controlled pixels; no smoothing blur.
Composition/framing: one horizontal strip of four equal square cells read left-to-right. One complete whole-hand drawing per cell. Identical wrist-core registration, character scale, lighting and proportions in all four cells. Generous empty margins. Transparent background.
Constraints: these four drawings are only the missing bridge between the existing final and opening poses; preserve exactly five digits, identical anatomy, grip, baton length, core size, ornament count, palette and brightness. Motion comes mainly from the wrist; free fingers, cloth and hanging ornaments show subtle natural follow-through. The fourth drawing should arrive immediately before the exact upright opening drawing, not replace it. Baton tip remains plain and tapered because live magic is separate.
Avoid: text, labels, borders, numbers, checkerboard, black background, extra/missing fingers, duplicated baton, round baton-tip knob, pose reset, scale drift, center drift, white or green edge noise, baked glow, attacks, lanes, scenery, motion trails, 3D rendering, skeletal rigging, crossfades or morphing.
```
