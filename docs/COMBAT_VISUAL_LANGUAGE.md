# Resonance — combat visual language

This document records accepted universal combat-reading rules. Exact artwork,
animation frames, colors, proportions, and timing remain subject to visual
mockups and playtesting.

## Locked attack alphabet

### Low hazard

- Uses a broad, shallow silhouette close to the lane surface.
- The player can jump over it or leave its affected lane or lanes.
- It is damaging rather than absorbable.
- Bosses may restyle it, but its low profile must remain obvious at gameplay size.

### Tall barrier

- Uses a dense, upright silhouette rising clearly above a low hazard.
- The player must change lanes; an ordinary jump does not clear it.
- It blocks or destroys a player counterattack that collides with it.
- Tall and shot-blocking behavior remain one combined category. Do not introduce
  tall non-blockers or separate shot blockers without a demonstrated design need.

### Resonance wave

- Uses a hollow, open, visibly permeable wave silhouette.
- A grounded player in its affected lane or lanes absorbs it automatically and
  does not take damage from that compatible wave.
- Its shape, motion, and sound must communicate absorbability without relying on
  color alone.
- Resonance waves are never free or isolated recharge pickups. Bosses place them
  inside active hostile formations so reaching the correct lane and remaining
  grounded requires a deliberate risk.
- Their difficulty varies. Some are moderately contestable and others are buried
  inside dense sequences that demand fast dodging, lane changes, or precisely timed
  jumps before absorption.
- Earning charge must feel valuable and high-risk/high-reward. The route must still
  be readable and mechanically possible; obscurity or unavoidable damage is not a
  substitute for difficulty.

### Player counterattack

- Firing stored resonance launches a boss-specific counterattack projectile from
  the player through the active lane.
- The projectile crosses the arena extremely quickly, making release-to-impact
  feel nearly immediate. It remains visible for enough frames to communicate its
  direction and any collision with a tall barrier, but never reads as a slow or
  lingering projectile.
- It must remain recognizable through dense formations and must not resemble the
  player character itself.
- Its visual form is unique to each boss encounter because the player is returning
  resonance absorbed from that boss.
- A successful hit receives strong impact presentation, such as a sharp impact
  frame, flash, particles, sound, and clear health loss.
- The hit does **not** stagger, stun, flinch, displace, interrupt, or cancel the
  boss. The boss's animation, attack sequence, and encounter timeline continue
  through it without pausing or losing synchronization. A graphic impact frame
  may briefly overdraw the action, but the underlying gameplay clock keeps moving.
- The shared input, charge requirement, travel direction, collision behavior, and
  damage rules remain consistent unless later playtesting establishes a strong
  reason for a mechanical variation.

## Shared presentation rules

- Shape carries the primary gameplay meaning; color reinforces it.
- Each boss may reinterpret materials, texture, animation, and accent color while
  preserving the universal silhouettes and player response.
- Incoming attacks may occupy one, two, or three contiguous lanes.
- Formations, staggering, travel speed, and rhythm create variety without adding
  unnecessary categories.
- The player must be able to distinguish low hazard, tall barrier, resonance wave,
  and counterattack at portrait-phone gameplay size.

## The Conductor's expression

- Normal attacks use abstract conducting and mechanical forms rather than literal
  notes, rests, or clefs. Recognizable notation is reserved for rare special
  moments such as Cadenza.
- Low hazards resemble decisive horizontal baton strokes or slashes.
- Tall barriers are abstract flue-organ-pipe silhouettes or small ranks of pipes.
  They use a long, dark, solid tube edged by rough crimson energy, a flat/open
  circular crown, and a small horizontal mouth with a visible lower lip near the
  lower portion. Their upright silhouette communicates that they cannot be jumped
  and can block a counterattack. They share the low hazards' energy-stroke language
  rather than resembling physical components taken from The Conductor. The earlier
  generic spikes, ornate mechanical pipes, and long gothic openings are rejected.
- Resonance waves are presented as deliberate temptations. The Conductor appears to
  offer them while surrounding them with enough danger that accepting the offer is
  an earned commitment.
- Counterattack routes can be obstructed by The Conductor's dense mechanical
  barriers, making the firing opening part of the authored phrase.
- The appearance of The Conductor counterattack projectile in the latest accepted
  combat mockup is the approved visual direction. It strikes The Conductor very
  quickly without embedding in or tethering to its wrist/core.
- The Conductor receives the hit without recoiling or losing the beat. The impact
  is forceful in presentation only; its conducting gesture and the authored attack
  phrase continue uninterrupted.
- Major attack releases correspond to readable finger movements, wrist snaps,
  baton cues, or broader conducting gestures.

## Accepted and open visual decisions

- Accepted for The Conductor: red horizontal baton-stroke arcs as low hazards.
- Accepted for The Conductor: hollow pale rings as resonance waves.
- Accepted for The Conductor: abstract flue-organ-pipe tall barriers, singly or in
  adjacent ranks.
- Rejected: the counterattack resembling the luminous player spark.
- Rejected: the projectile embedding in or tethering to the boss, or a hit reaction
  that throws The Conductor's wrist, fingers, or baton out of synchronization.
- Selected player direction: the Broken Resonance Mote recorded in
  `docs/PLAYER_VISUAL_DIRECTION.md`.
- Locked universally: a very fast boss-specific counterattack projectile, strong
  impact feedback, and no boss interruption.
- Locked for The Conductor: the projectile appearance shown in the latest accepted
  combat mockup.
- Open: exact frame timing after the fast travel is tuned in playtesting, plus the
  counterattack styling for later bosses.
