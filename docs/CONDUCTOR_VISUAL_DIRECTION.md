# The Conductor — visual direction

This document records design decisions accepted during planning. It is not an
implementation instruction and does not replace the supplied canonical character
reference or animation handoff.

## Locked battlefield structure

- The battle is presented in portrait orientation.
- There are exactly five dark playable lanes.
- Six thin, neutral-gray longitudinal rails separate and bound those five lanes.
- Sparse, faint crossbars recede toward the boss and suggest measures on a musical
  staff while providing depth information.
- The lanes and rails remain restrained against the near-black field. Attacks, the
  player character, and the boss have greater visual contrast.
- The image-generation mockup produced on 2026-09-10 is the composition reference
  for this lane treatment, not a production asset or a pixel-exact layout.

## Locked Conductor direction

- `docs/bosses/conductor/Conductor_visual.png` is the canonical character
  reference.
- The Conductor is only the floating mechanical hand; it has no humanoid body.
- Preserve the ivory, antique-gold, crimson, and near-black palette and the rough,
  chunky semi-pixel treatment.
- The backdrop suggests a ruined concert hall or musical machine, but remains
  barely visible and subordinate to gameplay and the boss.
- Character animation communicates precision, authority, restraint, and increasing
  difficulty maintaining perfect timing under damage.
- The Conductor's hand and baton animation is partly grounded in recognizable
  real-world orchestral conducting technique. Authentic beat patterns,
  preparatory/upbeat gestures, downbeats, cues, cutoffs, fermatas, subdivisions,
  articulation, dynamics, and tempo changes form a physical vocabulary for its
  attacks.
- The animation is not limited to literal conducting. Supernatural and mechanical
  motions may exaggerate, combine, or violate that vocabulary when doing so serves
  the character, but the underlying hand mechanics should remain intentional rather
  than generic baton waving.
- Conducting gestures act as readable performance cues: preparation precedes the
  corresponding attack release, while gesture size, sharpness, and flow help convey
  force and articulation.
- The counterattack projectile appearance shown in the latest accepted combat
  mockup is approved. It travels from the player to The Conductor extremely fast,
  creates strong impact feedback, and disappears without embedding or lingering.
- The Conductor does not flinch or stop conducting when hit; its animation and
  authored attack timeline continue uninterrupted.

## Still open

- Exact production-frame cleanup and final travel duration for the approved
  counterattack projectile.
- Exact arena architecture and background fragments.
- Boss scale, resting pose, and use of the circular wrist opening.
- Music, authored chart, phase structure, and Cadenza details.
- Whether later bosses retain the exact same neutral rail treatment or transform it
  while preserving the five-lane layout and readability.
