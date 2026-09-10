# Conductor motion study — isolated technical spike

## Evaluation outcome

The procedural cutout/joint-rig direction was **rejected after phone review on
2026-09-10**. The timing architecture worked, but the assembled boss read as a
crab rather than a coherent hand; its palm was poorly centered, its Ictus appeared
to be only a slight rotation, and its finger motion was too subtle. Do not extend
this rig or reuse its generated atlas as production art.

The replacement direction is documented in
[animation-direction.md](animation-direction.md): complete authored hand frames,
modular animation clips, shared transition poses, a fixed palm anchor and the same
authoritative music-clock synchronization. This page remains a record of what the
technical spike tested.

## Purpose and scope

Test whether a 2D articulated hand can support an idle, an Ictus and independently
sequenced finger joints while following one audio clock. This is not the first
finished boss, an art approval, a complete encounter, or a renderer migration.
The existing Three.js prototype remains at the normal game URL.

Open `/resonance/conductor-lab.html` on the development or production preview
server. The existing GitHub Actions workflow builds both HTML entries and copies
the atlas to `dist`; after the user commits and pushes, the study will also be at
<https://jtyneham.github.io/resonance/conductor-lab.html>.

## What is implemented

- PixiJS 8 WebGL renderer, nearest texture sampling and a DPR cap of 2.
- Five articulated fingers with three nested joints each, a palm, wrist, cuff
  and a baton parented to the index fingertip. Thumb/index form the grip.
- A 12-second, 120 BPM study: restrained idle, four preparation/downstroke/
  release/rebound phrases, independent middle/ring/pinky curls and reverse
  release, then a still hold. This is a motion sketch, not expert-validated
  conducting technique. The final hold is not a designed Cadenza animation.
- Four red arc releases over five neutral staff lanes, without a stationary
  pre-spawn wait. They illustrate gesture timing, not combat or difficulty.
- AudioContext time drives both synthesized timing clicks and pose sampling.
  Poses and wave positions are evaluated from absolute time, not accumulated
  animation deltas. Seeking does not replay old event callbacks.
- Separate clip loops, scrubbing, pause/restart, mute, fullscreen, portrait
  protection on touch devices and explicit resume after losing focus.
- Joint guides, native/30/15 FPS drawing and a 700 ms skipped-drawing test.
  Rendering catches up to the clock; this control does NOT simulate a blocked
  main thread, failed audio engine or low-end phone GPU.

The clicks are temporary timing references, not The Conductor's approved
orchestral/deconstructed-club composition. Clip looping currently seeks the click
transport at a frame boundary; it is not a production gapless music-loop system.

## Art and implementation limits

The [generated cutout atlas and exact prompts](rig-study-art.md) are provisional.
Black-matte screen compositing can brighten overlaps and does not provide correct
occlusion. Rotating textured cutouts also changes their pixel grid. This study
does not prove that final intricate pixel animation should consist only of a rig:
hand-drawn corrective frames, replacement sprites and true-alpha assets may be
needed for the approved visual quality. No PixelOver/Aseprite pipeline has been
validated here. The reference remains the canonical character design.

The browser study does not load the Three.js chunk. Conversely, the normal game
does not import the PixiJS study. Bundle numbers for one entry chunk are not total
download or memory measurements. The original Three.js >500 KB advisory remains.

## Verification and decision gate

Local result on 2026-09-10: lint, TypeScript, production build, formatting and
26 unit tests pass. All 11 Chrome browser tests passed together with exit 0
(four study tests and seven existing game regressions). The production study
page and atlas return HTTP 200 at their `/resonance/` paths. Ictus and finger
screenshots were inspected. The preview is running separately because the
initial Windows managed-server teardown stalled after tests reported results.
No remote deployment or physical-phone test was performed by the agent.

Run `npm run check`, `npm run format:check`, then `npx playwright test` against
the current build. The study adds deterministic pose/wave/continuity tests plus
browser checks for portrait layout, scrubbing, audio pause, skipped drawing,
clip looping, rotation, fullscreen and asset-load failure.

Browser emulation is not physical-phone validation. The diagnostic CPU p95
measures synchronous pose/draw submission, not GPU completion or audio latency;
draws/s and gaps are affected by intentional caps and pauses.

The user completed the relevant phone review. The recorded answers were:

1. The Ictus did not read as conducting; it appeared to be a slight hand rotation.
2. Three fingers articulated, but only slightly.
3. Timing clicks and the red release felt synchronized; the Ictus animation itself
   remained unacceptable.

Keep asset-fidelity approval separate. A smooth provisional rig is not approval
of this hand's proportions, final art, encounter design or full-game UI.
