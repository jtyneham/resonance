# The Dancer — Animation / Rigging Handoff for Codex

## Reference image

A **reference image is provided alongside this document** and must be treated as the **canonical visual source of truth** for The Dancer.

The reference image shows the intended boss design, palette, silhouette, proportions, grungy semi-pixel / pixel-art treatment, mechanical ballerina construction, ribbons, porcelain-like surfaces, exposed joints, and overall visual character.

Do not redesign the boss into a different character. Preserve the appearance of the reference image as closely as possible while making it suitable for expressive in-game animation.

The Dancer is a **broken mechanical music-box ballerina / automaton**. Her body, limbs, winding-key elements, ribbons, joints, dress fragments, ornaments, and mechanical details are all part of the boss itself.

Her established visual identity should remain clearly separate from The Conductor:

- Cold porcelain / pale blue-white body surfaces
- Deep violet and electric-violet energy / fabric accents
- Midnight-blue shadowing
- Restrained antique bronze / gold only for mechanical joints, trim, and music-box construction

Gold / bronze should remain secondary. The boss should read as **violet, cold, spectral, and porcelain-like first**, mechanical second.

---

## Goal

This is for a boss-rush game heavily inspired by the combat presentation of Everhood.

The Dancer must not feel like a static PNG that merely moves around the screen. The boss should **ooze character in every frame**.

Her personality is:

- Graceful
- Theatrical
- Haunting
- Expressive
- Mechanical
- Elegant
- Brittle
- Uncannily composed
- Increasingly unstable when disrupted

She is not another version of The Conductor.

Where The Conductor is rigid, authoritarian, economical, and exact, The Dancer should feel **flowing, choreographed, emotive, and physically expressive**.

Every animation should communicate those traits.

---

## Recommended asset approach

Do **not** treat the supplied reference image as one permanently flat sprite if avoidable.

Use the image as the visual source of truth, then reconstruct or decompose the boss into a layered, articulated 2D character whose major parts can move independently.

Suggested independently animatable parts include:

- Head
- Neck segments
- Upper torso
- Rib / chest plates
- Waist / central turntable
- Pelvis
- Upper arms
- Forearms
- Hands
- Individual hand / finger groups where practical
- Upper legs
- Lower legs
- Feet / pointe-like mechanical tips
- Shoulder joints
- Elbow joints
- Wrist joints
- Hip joints
- Knee joints
- Ankle joints
- Winding key
- Dress / skirt fragments
- Violet ribbons
- Hanging ornaments
- Halo / circular ornament behind the head
- Orbiting rings or decorative arcs
- Violet internal glow / chest core
- Antique bronze / gold mechanical trim

Build the pieces into a hierarchical rig so the body can perform convincing ballet-inspired poses rather than behaving like a collection of independent sprites.

The rig should support:

- limb rotation
- torso twist
- head tilt
- shoulder and hip counter-rotation
- pointe extension
- controlled arcs
- spins
- broken / overextended joint poses
- ribbon follow-through
- dress-fragment secondary motion

PixiJS, Three.js textured planes/sprites, or another suitable 2D rigging approach may be used depending on the existing project architecture.

The final result should preserve the **grungy semi-pixel / chunky pixel-art look** of the reference rather than becoming clean vector art, smooth 3D, polished anime, or sterile robotic animation.

---

## Animation philosophy

Avoid generic animation where body acting can communicate the event more strongly.

Do not rely mainly on:

- simple floating
- whole-sprite shaking
- repetitive bobbing
- generic rotation
- scale pulsing
- generic tweening
- constant random ribbon motion

Those effects can support the animation, but they should not replace character acting.

The Dancer should behave like a **music-box ballerina that has become alive, self-aware, and slightly wrong**.

Movement should generally be:

- Graceful
- Choreographed
- Purposeful
- Expressive
- Rhythmically musical
- Smooth through arcs
- Occasionally interrupted by mechanical locks or skips
- Capable of sudden unnatural precision

The contrast between **beautiful ballet motion** and **mechanical imperfection** is central to the character.

Tiny gestures matter.

A head tilt held a fraction too long, a wrist finishing a line after the rest of the body, a knee locking with a small mechanical click, or a ribbon continuing after the body freezes can communicate more character than large random motion.

---

## Music synchronization

The Dancer's animations should use the **same authoritative musical transport / chart clock as combat**.

Do not run important boss gestures from arbitrary independent timers if they are meant to correspond to attacks or musical events.

Poses, steps, turns, attack cues, spins, landings, ribbon sweeps, hit reactions, special-attack phrases, and phase transitions should be able to land on:

- Beats
- Half-beats
- Quarter-beats
- Subdivisions
- Phrase boundaries
- Measure changes
- Tempo changes
- Musical accents
- Sustained notes

The boss should feel like she is **dancing the music at the player**.

The choreography should often span several beats rather than treating each attack as an isolated gesture.

---

## Animation vocabulary

### Idle

The idle animation should already communicate personality.

The Dancer should not merely float or hold one ballet pose forever.

Possible behavior:

- Slow breathing-like expansion of the torso despite being mechanical
- Head gently angled away from the player, then turning back
- One arm held aloft while the wrist subtly finishes a line
- Free hand drifting through a small graceful arc
- One leg slightly extended or poised in a restrained ballet position
- Tiny rotation through the waist as if mounted on a music-box turntable
- Violet ribbons continuing to move after the body stops
- Dress fragments settling with delayed motion
- Porcelain fingers slowly opening and closing
- Brief mechanical locking at a joint before motion resumes
- Small, almost imperceptible wind-up / unwind motion
- Occasional full stillness resembling a music-box figurine that has stopped

The overall impression should be:

**beautiful, poised, melancholic, theatrical, and faintly unsettling.**

The idle should feel choreographed rather than random.

---

### Attack anticipation

Before major attacks, The Dancer should visibly enter a pose that belongs to a dance phrase.

The anticipation should visually tell the player:

**a movement is about to complete.**

Good anticipation ideas:

- weight shifts onto one leg
- shoulders and hips counter-rotate
- arms slowly open into a prepared position
- head turns toward the intended attack direction
- ribbons tighten behind the motion
- chest glow gathers
- foot rises into pointe
- the body becomes completely still at the apex of a pose
- a joint makes a tiny unnatural correction immediately before release

Her anticipation should often be elegant and readable rather than aggressive.

The danger comes from the **completion of the choreography**.

---

### Sweeping lane attack

The Dancer can use broad arm, leg, skirt, or ribbon arcs to correspond to sweeping lane pressure.

The gesture should:

- begin from a clear ballet pose
- travel through a readable curved path
- have strong follow-through
- allow ribbons and dress fragments to lag behind
- finish in another deliberate pose rather than simply resetting

A sweep should feel like part of a dance phrase, not a weapon swing.

---

### Pirouette / rotating patterns

Spins should be one of The Dancer's defining visual tools.

Possible behavior:

- arms close inward before acceleration
- body rises slightly onto pointe
- rotation accelerates cleanly
- skirt fragments and ribbons widen outward
- attack formations rotate or sweep across lanes in synchronization
- the spin ends on an exact musical accent
- head may perform stylized spotting motions, snapping back toward the player

Do not make every attack a spin.

Pirouettes should feel special enough to retain identity.

---

### Spiral Cascade

**Spiral Cascade** is a major recurring signature attack for The Dancer.

A gameplay reference image may be supplied alongside the handoff to illustrate the intended **staggered cascading lane pattern**. Treat that reference as a pattern-flow reference only, not as a visual design reference for The Dancer herself.

The Dancer begins a frantic pirouette. Each revolution sprays a new cascading formation of attacks down the five lanes, creating a staggered wall-like sequence that advances toward the player.

The direction of the attack cascade is physically tied to the direction of her spin.

Example structure:

- clockwise pirouette
- cascade travels left-to-right across the lanes
- abrupt deceleration or stop
- body visibly twists against its existing momentum
- ribbons and skirt fragments overshoot the stop
- violent reversal into counter-clockwise rotation
- cascade direction reverses right-to-left
- optional brief fake reversal or continuation later in the phrase

The attack should feel erratic and frantic, but it must remain **authored, deterministic, and learnable** rather than random.

The spin reversal should have a readable visual tell before the attack direction changes. Possible tells:

- torso counter-rotates against the current spin
- one foot or leg braces as if digging into the turn
- head snaps toward the new direction
- ribbons continue in the old direction for a fraction of a beat
- dress fragments lag behind
- the body compresses briefly before releasing into the reverse spin

The attack should strongly express The Dancer's personality:

- graceful movement pushed into dangerous excess
- beautiful choreography becoming unstable
- mechanical joints maintaining impossible speed
- ribbons and dress fragments tracing violent arcs
- elegance turning frantic without becoming visually random

The attack itself should feel as though **her body motion generates the lane pattern**.

Do not reserve Spiral Cascade only for one special-attack moment. It is strong enough to become a recurring signature motif during the fight, with more difficult variants later.

**Broken Coda** may reuse Spiral Cascade in a denser or corrupted form together with other established choreography.

---

### Jump / leap patterns

Use ballet-inspired leaps for attacks that correspond to large musical phrases or crossing formations.

Possible movement:

- deep preparation
- sudden elegant extension
- long airborne silhouette
- stretched limbs creating a strong readable shape
- ribbons trailing dramatically
- mechanically perfect landing
- a tiny unnatural knee lock after impact

The leap should feel weightless at first, then surprisingly mechanical on landing.

---

### Delayed follow-through patterns

The Dancer should make strong use of **movement that continues after the player thinks the gesture is finished**.

Examples:

- arm stops, ribbon continues
- leg completes a sweep, skirt fragments produce the delayed danger
- body turns away, then the head snaps back
- a graceful landing is followed by a delayed mechanical extension
- one limb repeats the final piece of choreography half a beat later

This can become part of her gameplay identity: beauty first, danger in the follow-through.

---

### Resonant / parryable cue

A resonant cue can look almost like an invitation to dance.

Possible ideas:

- one open hand offered toward the player
- a formal curtsy-like preparation
- both arms briefly frame the chest core
- violet light travels from the chest through one arm
- ribbons draw inward toward the offered hand
- the head tilts directly toward the player

The cue should be elegant and consistent enough to remain readable during difficult play.

It should feel less like "attack charging" and more like:

**your turn.**

---

### Counterattack hit / boss hit reaction

Do not use only a generic whole-body shake.

A successful player hit should interrupt the choreography.

Examples:

- a pose collapses halfway through completion
- one knee buckles
- head snaps to an incorrect angle
- raised arm drops unexpectedly
- torso twists too far
- ribbons momentarily lose their graceful path
- chest glow fractures or flickers
- a joint locks and must mechanically reset
- the music-box winding motion visibly skips

Then The Dancer should recover **into choreography**, not simply return to neutral.

The personality beat is:

**the player ruined the performance.**

Her reaction can communicate hurt, offence, embarrassment, or desperate insistence on continuing the dance without needing facial dialogue.

---

### Damage progression / low health

As health falls, The Dancer should retain her grace, but the choreography becomes increasingly difficult for the machine to maintain.

Possible escalation:

- one arm finishes poses slightly late
- a leg trembles while held extended
- head movements become too sharp
- joints occasionally lock
- violet glow flickers through cracks
- ribbons move less symmetrically
- dress fragments drag behind
- a turn briefly over-rotates
- a landing requires an obvious correction
- one pose is held too long
- movements alternate between beautiful fluidity and abrupt mechanical snapping

Do not immediately turn her into a broken puppet.

The strongest effect comes from watching **grace slowly fail**.

Even near defeat, she should still attempt to complete every phrase.

---

## Special attack — Broken Coda

**Broken Coda** is the recommended signature special attack for The Dancer.

The name and exact gameplay can remain configurable until the combat chart is finalized, but the animation concept should be built around a complete ballet phrase gradually becoming corrupted.

Recommended structure:

### 1. Opening pose

The Dancer enters a striking, perfectly composed ballet pose.

Everything becomes unusually still.

Ribbons settle.

The chest glow stabilizes.

### 2. Choreographed phrase

She performs a short, readable sequence of movements:

- extension
- sweep
- turn
- leap
- landing

Each movement corresponds to an attack pattern.

The sequence should initially feel elegant and predictable.

### 3. Mechanical repetition

The phrase begins repeating, but fragments of it are displaced.

Examples:

- the arm sweep repeats without the torso
- the head performs the previous turn again
- one leg repeats a leap preparation
- ribbons reproduce an earlier path
- attack echoes arrive from the movement that happened one phrase ago

The player must recognize the dance phrase while accounting for its broken repetitions.

### 4. Final coda

The Dancer forces the entire sequence into a rapid, increasingly unstable finale.

The body moves beautifully but impossibly fast.

Joints lock and release.

Ribbons trace overlapping arcs.

The final movement lands on one decisive musical accent.

Afterward, The Dancer freezes in a beautiful pose for a brief moment as though nothing went wrong.

The special should sell the idea that:

**the music box remembers the dance, but the broken mechanism can no longer reproduce it correctly.**

---

## Victory over the player

Do not make The Dancer celebrate aggressively.

Victory should feel like the completion of a performance.

Possible ideas:

- slow turn away from the player
- controlled lowering of the arms
- small mechanical curtsy
- head dips
- ribbons settle
- chest glow softens
- body rotates back into a traditional music-box figurine pose
- winding key turns once
- complete stillness

The feeling should be:

**the dance is finished, and the audience is no longer required.**

---

## Defeat / death

The defeat animation should represent the collapse of The Dancer's defining trait: **graceful choreography**.

Possible progression:

- she attempts to begin another familiar phrase
- one limb fails to follow
- another joint locks
- a turn stops halfway
- ribbons fall instead of flowing
- chest light flickers irregularly
- winding mechanism unwinds
- posture gradually collapses
- she makes one final attempt to reach the opening pose
- the body freezes before completing it

Avoid a generic explosion if possible.

A stronger thematic ending is:

**the dancer can no longer finish the dance.**

Optionally, the very last movement can be a tiny involuntary mechanical twitch after apparent stillness.

---

## State / animation system

Build a reusable boss animation system rather than hard-coding isolated visual tweaks.

Candidate states include:

- idle
- anticipation
- sweeping attack
- spin / pirouette
- Spiral Cascade
- leap
- delayed follow-through
- recovery
- resonant cue
- hit reaction
- low-health variation
- Broken Coda opening
- Broken Coda phrase
- Broken Coda corruption
- Broken Coda finale
- victory
- defeat
- transition / phase-change states if later required

Transitions should be intentional and choreographed.

Whenever possible, attack animation should begin from the actual current articulated pose rather than abruptly snapping back to one universal neutral frame first.

One animation should be able to **flow naturally into the next pose**, creating the impression of a continuous performance.

---

## Character requirement

The key requirement is not simply that The Dancer moves.

The requirement is that **every state expresses The Dancer's personality**.

Even utility motions should communicate:

- grace
- theatricality
- musicality
- mechanical fragility
- elegance
- uncanny beauty
- the compulsion to continue performing
- increasing difficulty maintaining perfect choreography

The boss should feel alive despite being a mechanical music-box figurine.

She should never feel like The Conductor with a humanoid skeleton.

The contrast is essential:

**The Conductor commands the music.  
The Dancer surrenders herself to it.**

---

## Core implementation instruction

Treat the supplied reference image as the canonical visual reference for **The Dancer**.

Reconstruct the boss as a layered, articulated 2D character while preserving her appearance as closely as possible.

Major body segments, joints, ribbons, dress fragments, winding-key components, and important secondary details should be independently transformable where useful.

Build a reusable animation/state system for:

- idle
- anticipation
- sweeping attacks
- pirouettes / rotating attacks
- Spiral Cascade
- leaps
- delayed follow-through
- transitions
- hit reactions
- health-dependent behavior
- Broken Coda
- victory
- defeat

Animation must communicate the character's **graceful, theatrical, haunting, mechanical personality at all times**.

Avoid generic floating, shaking, rotation, or tween-only animation where articulated acting and choreography can convey the same event.

Synchronize important animation events to the same musical transport / chart clock used by combat.

Preserve the established **cold porcelain + violet + midnight-blue palette**, using antique bronze / gold only as restrained mechanical support.

The final result should make The Dancer **ooze character in every frame**.
