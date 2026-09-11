# The Conductor — approved Ictus motion reference

## Approval and scope

The user approved the low-detail wrist-lab motion and specifically praised the
small backward wrist extension before the strike. This pack records that motion;
it does not approve any generated detailed strike pose. The rough geometry is a
movement guide, not the final character design or a proposed production rig.

Open `index.html` for paired player/side captures. Each PNG is a direct canvas
capture, not generated artwork. Images have an opaque background and a faint
baton-path guide; neither should be painted into the final sprite.

## Source hierarchy

1. Motion/timing: `src/lab/wrist-motion.ts` and `wrist-lab.html` in the repository.
2. Resting pose and character treatment:
   `../../key-poses/ictus-rebound-review-01.png` — approved upright idle.
3. Original design: `../../Conductor_visual.png` and the Conductor handoff.
4. The user's Flo321321ic.mp4 informed the gesture, especially 6–8 seconds;
   do not copy its full-arm travel or surrounding footage into the game.

Earlier generated strike attempts are NOT anatomy references. Do not use the
finger-mounted socket/cannon interpretation of the baton.

## Timing to preserve

One complete gesture takes 1200 ms. Angles below are relative to upright, about
the wrist; positive bends forward toward the player. This is an exact record of
the approved test, not a claim about universal conducting technique.

| Time    | Pose             | Wrist angle | Drawing intent                                |
| ------- | ---------------- | ----------- | --------------------------------------------- |
| 0 ms    | Idle             | 0°          | Upright baton, established resting pose       |
| 130 ms  | Wind-up apex     | −9.17°      | Small backward extension; no pause            |
| 260 ms  | Strike / release | +83.08°     | Compact forward flick, baton end-on to player |
| 600 ms  | Recovery sample  | +33.85°     | Already rebounding; not a second attack       |
| 1200 ms | Idle again       | 0°          | Same image/alignment as the start             |

The first 130 ms use smooth easing into extension. The next 130 ms accelerate
into the flick. Recovery begins immediately at 260 ms and eases back over 940 ms.
There is no hold on the pointing pose. The strike/release cue is exactly 260 ms.
The four captured poses are KEY REFERENCES, not sufficient frames for final
animation. Follow the live test or source timing for the in-betweens.

## Anatomy and motion requirements

- Keep the cuff centered and stable. In this approved test it is fully stationary.
  Any secondary cuff drift in final art needs separate review; do not add it silently.
- Palm pivots at the wrist. Do not simulate the bend by shortening the baton,
  curling fingers harder, enlarging the hand or translating the whole character.
- Exactly five digits: thumb and index maintain a believable pinch on the baton;
  middle, ring and little fingers retain their curled relationship to the palm.
- All digits and the rigid baton ride with the palm. No regripping or shaft sliding.
- In player view the strike has strong foreshortening. Use the side view to resolve
  depth rather than treating the end-on baton as a finger, socket or cannon.
- The rough cuff is blue solely for inspection. Final material remains the
  established ornate ivory/brass/crimson character treatment.

## Artwork and delivery proposal

Paint complete whole-hand frames using these projections as guides. Keep the
approved detailed idle as the style/identity anchor, not the primitive box shapes.
Maintain coherent cracks, brass joints and crimson tendons across frames.
No white matte fringes, anatomy substitutions, image crossfades or rubber warps.

Deliver lossless RGBA PNG frames on one shared canvas, with one fixed wrist
registration point, no per-frame auto-cropping, plus frame exposure times and the
260 ms attack marker. Choose final canvas size with the game developer before
painting the full sequence. Preserve room for the full baton sweep and pendants.
Keep baton glow on a separate effects layer if practical so it can change with
motion; it must not appear stuck at one screen position.

The game targets smooth 60 Hz presentation, but 60 Hz display alone does not make
sparse drawings smooth. Decide authored frame count after a short in-between test;
do not pad the sequence with duplicates or assume every exposure must be equal.

## Review gates

1. One detailed beat pose matches the approved bend, five digits and pinch.
2. Idle/wind-up/beat/recovery retain scale, registration and identity together.
3. Short moving sequence preserves the approved wind-up/flick/rebound feel.
4. Verify edges, tip effects and clarity at actual portrait-phone display size.

No gameplay, music, damage response or additional attack is requested by this pack.

## Re-capture

Build and run the repository preview on port 4173, then run:
`node scripts/capture-wrist-reference.mjs` from the repository root.
This overwrites only this pack's eight named reference captures. It does not alter
the approved motion. Player and side views have different camera centers so the
baton arc fits; do not align the two views by image coordinates.
