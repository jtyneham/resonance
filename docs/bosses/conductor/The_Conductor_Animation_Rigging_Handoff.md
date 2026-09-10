# The Conductor — Animation / Rigging Handoff for Codex

## Reference image

A **reference image is provided alongside this document** and must be treated as the **canonical visual source of truth** for The Conductor.

The reference image shows the intended boss design, palette, silhouette, proportions, grungy semi-pixel / pixel-art treatment, mechanical construction, and overall visual character.

Do not redesign the boss into a different character. Preserve the appearance of the reference image as closely as possible while making it suitable for expressive in-game animation.

The Conductor is **only the mechanical hand itself**. There is no body, armature, torso, face, or machinery behind it.

---

## Goal

This is for a boss-rush game heavily inspired by the combat presentation of Everhood.

The Conductor must not feel like a static PNG that merely moves around the screen. The boss should **ooze character in every frame**.

Its personality is:

- Precise
- Domineering
- Mechanical
- Controlled
- Aristocratic
- Rhythmically exact
- Intolerant of disorder

Every animation should communicate those traits.

---

## Recommended asset approach

Do **not** treat the supplied reference image as one permanently flat sprite if avoidable.

Use the image as the visual source of truth, then reconstruct or decompose the boss into a layered, articulated 2D character whose major parts can move independently.

Suggested independently animatable parts include:

- Palm / main hand body
- Wrist / cuff
- Thumb segments
- Index finger segments
- Middle finger segments
- Ring finger segments
- Pinky segments
- Knuckle / joint pieces
- Baton
- Crimson internal glow
- Gold trim / mechanical accents
- Loose hanging red strands or secondary details

Build the pieces into a simple hierarchical rig so fingers, joints, palm, wrist, and baton can rotate, translate, scale, and react independently.

PixiJS, Three.js textured planes/sprites, or another suitable 2D rigging approach may be used depending on the existing project architecture.

The final result should preserve the **grungy semi-pixel / chunky pixel-art look** of the reference rather than becoming a clean vector, smooth 3D, polished sci-fi, or sterile robotic asset.

---

## Animation philosophy

Avoid generic animation where articulated acting can communicate the event more strongly.

Do not rely mainly on:

- simple floating
- whole-sprite shaking
- scale pulsing
- generic tweening
- repetitive bobbing

Those effects can support the animation, but they should not replace character acting.

The Conductor should behave like a machine performing music with perfect authority.

Movement should generally be:

- Deliberate
- Economical
- Sharp when required
- Precise
- Synchronized to the music
- Almost unnaturally controlled

Tiny gestures matter.

A small finger correction, an exact wrist snap, a mechanical joint reset, or a perfectly timed pause can communicate more character than large random movement.

---

## Music synchronization

The Conductor's animations should use the **same authoritative musical transport / chart clock as combat**.

Do not run important boss gestures from arbitrary independent timers if they are meant to correspond to attacks or musical events.

Finger taps, attack cues, pose changes, anticipation, Cadenza signals, impacts, recoveries, and phase transitions should be able to land on:

- Beats
- Half-beats
- Quarter-beats
- Subdivisions
- Phrase boundaries
- Tempo changes

The boss should feel like it is **performing the music at the player**.

---

## Animation vocabulary

### Idle

The idle animation should already communicate personality.

The Conductor should not merely float.

Possible behavior:

- Very small metronomic finger motion
- Index finger subtly marking the beat
- Tiny wrist corrections
- Fingers locking into precise positions
- Gold joints settling mechanically
- Crimson internals pulsing subtly with musical subdivisions
- Short moments of complete stillness
- Occasional tiny impatient adjustment

The overall impression should be:

**controlled, superior, exact, and slightly impatient.**

Idle motion should remain restrained enough that attack animation silhouettes remain clear.

---

### Attack anticipation

Before major attacks, the fingers should deliberately arrange into a precise conducting pose.

The anticipation should visually tell the player:

**the boss has decided what happens next.**

Good anticipation ideas:

- fingers fold into position one by one
- wrist rotates to a locked angle
- baton aligns exactly
- crimson light concentrates into specific joints
- the hand becomes perfectly still for a fraction of a beat before striking

Avoid frantic windups unless the musical phrase specifically calls for them.

---

### Single-lane strike

A single finger can snap downward or forward like a conductor giving a hard cue.

The gesture should be:

- Fast
- Clean
- Authoritative
- Immediately recoverable into the next pose

Different fingers may correspond to different lanes if useful for readability.

---

### Marching walls

Use a broader, domineering lateral conducting motion.

Possible character:

- palm turns outward
- fingers flatten into formation
- hand sweeps laterally with absolute authority
- movement stops sharply at the end rather than easing loosely

It should feel like the Conductor is ordering an entire section of the arena to move.

---

### Rapid patterns

Use extremely economical motions.

As tempo rises:

- finger gestures become faster
- movements shorten
- wrist changes become more efficient
- the boss remains precise instead of becoming sloppy

The Conductor should look more impressive as speed increases because it retains perfect control.

---

### Resonant / parryable cue

A resonant cue can briefly feel almost inviting or taunting.

Possible ideas:

- deliberate index-finger extension
- slight beckoning motion
- baton offered forward
- fingers open briefly as though presenting the beat to the player

This should remain consistent enough to become readable during difficult play.

---

### Counterattack hit / boss hit reaction

Do not use only a generic whole-body shake.

A successful player hit should momentarily disrupt the Conductor's precision.

Examples:

- fingers jerk apart unexpectedly
- one joint skips position
- baton alignment breaks
- crimson pulse stutters
- the hand snaps slightly off-axis

Then it should rapidly reassert control and return to a disciplined pose.

The personality beat is:

**the player forced the machine out of perfect order, and it hates that.**

---

### Damage progression / low health

As health falls, the Conductor should remain recognizable and controlled, but tiny imperfections can begin appearing.

Possible escalation:

- slight mechanical tremor
- one finger resets a fraction late
- crimson energy leaks or flickers
- a joint briefly over-rotates and corrects itself
- movement becomes more forceful
- idle pauses become more tense

Do not turn it into chaotic flailing.

Its identity is strongest when it is visibly struggling to maintain perfection.

---

## Special attack — Cadenza

Cadenza should be one of the most character-heavy animations in the encounter.

Recommended structure:

### 1. Absolute stillness

The hand stops almost completely.

Crimson lighting may narrow or stabilize.

This sudden restraint creates tension.

### 2. Sequence signaling

The Conductor displays the upcoming lane sequence through individual, readable finger / baton gestures.

For example:

- one finger moves
- pause
- another finger moves
- pause
- another lane signal
- etc.

Each signal should be exact and memorable.

### 3. Brief lock

After presenting the sequence, the hand returns to a rigid poised position.

### 4. Execution

The entire remembered sequence is then conducted rapidly.

The hand should perform sharp, violent, impossibly exact motions while remaining mechanically controlled.

The animation should sell the idea that the boss has rehearsed the sequence perfectly and expects the player to do the same.

---

## Victory over the player

Do not make the Conductor celebrate wildly.

Victory should feel restrained and arrogant.

Possible ideas:

- slow closing of the fingers
- tiny final baton movement
- one precise cutoff gesture
- the hand returns to perfect stillness
- crimson pulse settles

The feeling should be:

**the performance ended exactly as the Conductor expected.**

---

## Defeat / death

The defeat animation should represent the collapse of the Conductor's defining trait: perfect timing.

Possible progression:

- fingers begin moving on conflicting rhythms
- joints lose synchronization
- baton falls out of alignment
- crimson pulses drift off-beat
- mechanical corrections fail
- fingers lock at different times
- the final movement freezes abruptly

Rather than an ordinary explosion, the strongest thematic defeat is:

**its timing collapses.**

---

## State / animation system

Build a reusable boss animation system rather than hard-coding isolated visual tweaks.

Candidate states include:

- idle
- anticipation
- attack
- recovery
- resonant cue
- hit reaction
- low-health variation
- Cadenza signal
- Cadenza execution
- victory
- defeat
- transition / phase-change states if later required

Transitions should be intentional.

Whenever possible, attack animation should begin from the actual current articulated pose rather than abruptly snapping back to one universal neutral frame first.

---

## Character requirement

The key requirement is not simply that the hand moves.

The requirement is that **every state expresses The Conductor's personality**.

Even utility motions should communicate:

- control
- precision
- musical authority
- mechanical discipline
- superiority
- intolerance of disruption

The boss should feel alive even though it is only a mechanical hand.

---

## Core implementation instruction

Treat the supplied reference image as the canonical visual reference for **The Conductor**.

Reconstruct the boss as a layered, articulated 2D character while preserving its appearance as closely as possible.

Every finger segment and major mechanical component should be independently transformable where useful.

Build a reusable animation/state system for:

- idle
- anticipation
- attacks
- transitions
- hit reactions
- health-dependent behavior
- Cadenza
- victory
- defeat

Animation must communicate the character's **precise, domineering, mechanical personality at all times**.

Avoid generic floating, shaking, or tween-only animation where articulated acting can convey the same event.

Synchronize important animation events to the same musical transport / chart clock used by combat.

The final result should make The Conductor **ooze character in every frame**.
