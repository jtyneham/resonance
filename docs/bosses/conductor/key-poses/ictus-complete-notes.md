# Complete Ictus gesture study 02

The user chose ictus-rebound-review-01.png as the new upright resting idle and
authorized the missing first half plus connection to the existing recovery.
The lab now presents the complete gesture in one second.

Timeline:

- 0 ms: upright idle (same accepted drawing as the endpoint).
- 40 ms: compact backward preparation, new complete drawing.
- 110 ms: forward downstroke, new complete drawing.
- 200 ms: accepted player-facing strike; intended attack-release cue.
- 260–820 ms: existing five recovery drawings.
- 1000 ms: returns to the same upright idle.

The gesture uses 9 unique whole-hand images across 10 timeline entries.
It is sparse motion blocking, not a finished smooth animation or a 60-fps asset.
The two new drawings still require review in motion. Playback uses non-uniform
exposure durations and requestAnimationFrame with the stale-timestamp fix.
No real projectile or music is introduced by this animation-only study.

New images were generated individually with built-in image generation, then
copied without postprocessing:

- ictus-preparation-review-01.png: exec-f4389b63-ccbb-4b6a-a89c-e10280934f46.png
- ictus-downstroke-review-01.png: exec-7fcb3cee-c900-4a38-b474-29684c1dff78.png

Inspection: both preserve a thumb/index grip and three free fingers, with wrist
star and hanging cuff details. Frame registration uses uniform scale and wrist
position; detail/grip variation remains. Black backgrounds and baked glows remain
draft limitations. Original character design is available through the lab toggle.

## Generation brief (summary, not verbatim prompts)

Preparation: use the accepted upright mechanical-hand pose as reference. Draw a
compact backward preparation with a slightly tilted upright baton, preserving
the ivory/brass/crimson style, five digits, wrist opening and hanging cuff.

Downstroke: draw the whole hand driving forward toward the viewer, with a
foreshortened baton and tightening fingers, between preparation and the accepted
player-facing strike. Preserve the same character and five-digit anatomy.
