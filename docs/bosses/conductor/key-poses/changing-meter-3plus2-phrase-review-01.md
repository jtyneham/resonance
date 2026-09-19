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
