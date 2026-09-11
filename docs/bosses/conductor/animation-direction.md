# The Conductor — animation production direction

Status: **locked design decision on 2026-09-10**. This supersedes the proposed
fully modular cutout/joint-rig approach.

## Reset after rejected whole-hand animation (2026-09-11)

The v3 generated sheet failed visual review: identity, anatomy, perspective and
frame-to-frame consistency were inadequate. Technical test success is not visual
approval. The lab now shows only the canonical reference as a static baseline.

Proceed through individually reviewed poses: original idle-ready, preparation,
directly player-facing strike, and frontal upright rebound. Preserve five digits
(thumb and index gripping the baton, three free fingers), proportions and detail.
Then review a short transition before expanding into a complete clip. Do not
generate another entire multi-frame atlas as the next production step.

Approved timing intent: the approach to the strike is fast, almost abrupt, with
weight conveyed through deliberate motion. Raising the baton and returning to
ready use a measured pace; the upright rebound has no hold. The previous 0.20 s
approach / 0.80 s recovery is provisional, pending review of coherent drawings.

## Source of truth

Latest pose decision (2026-09-11): the accepted
`key-poses/ictus-rebound-review-01.png`, with the baton vertically upright, is now
the resting idle reference. Ictus begins in that pose and recovers to it. The
earlier instruction to avoid a held vertical rebound meant no interruption while
recovering; it does not prohibit resting in the newly chosen upright idle after
the gesture is complete. Original artwork remains the character/style reference.

- Start the production animation work from zero using
  `Conductor_visual_transparent.png` as the canonical production reference.
  This is the user's transparent version of the original `Conductor_visual.png`,
  which remains the original design reference alongside it.
- Do not reuse the generated cutout atlas from the technical study as production
  art.
- Do not use the subsequently supplied animated idle WebP as a game asset or as
  the starting animation. It was useful feedback because its coherent silhouette
  demonstrated why a complete hand reads better than the cutout study.

## Chosen approach: authored whole-hand clips

The Conductor will be animated as finished sequences of complete hand images.
The runtime does not construct the character from a palm, cuff, fifteen finger
joints and a separately transformed baton. Anatomy, overlaps, silhouette, pixel
clusters, loose threads and the baton grip are resolved inside every authored
frame.

Modularity exists at the **animation-clip level**, not the body-part level. Likely
clips include idle, small and broad Ictus, changing-meter phrases, sectional
entrances, Fermata hold/release, resonant invitation, cutoff, re-entry and the
Cadenza signal/execution. This list describes asset organization; it does not
require every musical phrase to be one monolithic file.

This decision favors authored character performance and consistent pixel art over
the ability to synthesize arbitrary poses at runtime. A procedural joint rig may
still be useful as an off-line posing reference, but its output is not the rendered
boss and it is not a production requirement.

## Shared poses and transitions

Do not author a unique transition for every possible pair of clips. The encounter
is scored on an authored timeline, so its valid transitions are known in advance.
Clips connect through a small shared pose vocabulary:

1. **Neutral / idle-ready** — the standard starting and recovery pose.
2. **Raised preparation** — shared by Ictus, meter patterns and re-entry.
3. **Closed cutoff** — shared by silence, Fermata transitions and Cadenza.

An ordinary attack clip contains its own preparation from a shared pose, attack
stroke, release, rebound and recovery to a shared pose. For example, there is no
separate generic `idle-to-ictus` asset: those transitional frames belong at the
start of the Ictus clip. Purposeful transitions such as Fermata hold to release,
cutoff to re-entry, Cadenza signal to execution, and a meter phrase contracting
into a cutoff receive explicitly authored animation because the transition itself
communicates gameplay information.

Avoid runtime crossfades between pixel-art clips. Pose-matched frames or deliberate
hard cuts preserve the pixel language and keep gameplay cues exact.

## Placement and anchoring

- The **palm center**, not the image bounds, is the stable registration point.
- At rest, that palm anchor is centered horizontally in the boss performance area.
  A long diagonal baton must not push the hand off-center merely because it expands
  the sprite's bounding box.
- Every exported frame records the same canvas size and palm-anchor coordinate.
- Large gestures may move the palm deliberately, but the movement is authored
  relative to that anchor and returns cleanly. Accidental positional wobble is not
  acceptable.

## Timing contract

The successful part of the technical study remains:

- Music, encounter chart, animation and attack releases share one authoritative
  transport clock.
- Each clip declares its musical duration, loop behavior, palm anchor and named
  event frames, especially the Ictus/release frame.
- The chart chooses the clip and owns the actual attack event. Animation callbacks
  do not independently spawn attacks.
- The displayed frame is derived from musical time. Seeking, pausing or dropping a
  render frame therefore returns to the correct pose instead of accumulating
  timing drift or replaying missed attack callbacks.

An animated WebP must not free-run as an HTML image in production. Approved frames
should be exported to a true-alpha sprite sheet/atlas or an equivalently seekable
frame set so the runtime can select an exact frame.

## Asset requirements

- Whole-hand frames must retain one recognizable anatomy and baton grip across the
  sequence. Finger length, joint ornament, cuff construction and surface details
  cannot mutate between frames.
- The final export requires genuine transparency. Baked black backgrounds and
  screen blending are not the production pipeline.
- Nearest-neighbor presentation alone does not make an asset valid pixel art.
  Pixel clusters, outlines, overlaps and corrective frames require visual review.
- Intricate movement may use key poses, in-betweens, held frames and selective
  replacement drawings. There is no requirement to animate every element on every
  frame.
- Phone-scale silhouette and gameplay readability take priority over subtle joint
  movement that disappears at the intended display size.

## Technical-study conclusion

The isolated PixiJS study proved that audio-clock sampling, pausing, seeking,
frame-drop recovery and release synchronization can work. Its visual approach was
rejected after phone review:

- the assembled character read more like a crab than a hand;
- the palm was not the centered visual anchor;
- the Ictus read as a slight rotation instead of a conducting stroke;
- three fingers moved, but their articulation was too subtle at phone size;
- the generated black-matte parts and screen compositing produced unsuitable
  overlap and fidelity compromises.

The study remains historical evidence and a timing experiment. Do not continue
polishing its procedural hand or treat its atlas as production work. Whether the
final 2D renderer is PixiJS remains a separate decision; choosing authored clips
does not by itself commit the complete game to PixiJS.

## First production proof required

Before producing the full attack library, create one new whole-hand Ictus sequence
from the original canonical reference. It must establish:

- a centered palm and unmistakable hand silhouette;
- preparation, a decisive spatial stroke, exact Ictus, rebound and recovery;
- consistent anatomy and pixel treatment across all frames;
- a true-alpha, seekable frame export;
- readable motion and synchronized release on an actual portrait phone.

Only after that proof is accepted should the same pipeline expand to the remaining
phrases.
