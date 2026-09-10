# The Conductor — move-pool draft

Status: broadly accepted at the concept level on 2026-09-10. Individual visuals,
timings, combinations, and names remain provisional; this is not authorization for
implementation.

## Combat identity

**Precision under deceptive timing.**

The Conductor is difficult because it makes the player read exact preparation,
placement, and release timing. Its patterns can become erratic and severe, but its
own movement remains disciplined. It does not imitate the reference fights by
specializing in constant arena disorientation, pure projectile volume, or one long
moving corridor.

## Conducting basis

The baton, wrist, and hand should partly follow recognizable real-world orchestral
conducting technique:

- a preparatory upbeat establishes the next entrance;
- the ictus, or clear beat point, coincides with an attack release;
- two-, three-, four-, and five-beat paths can organize attack sequences;
- crisp angular rebounds communicate staccato or accented attacks;
- rounded continuous motion communicates legato or sustained formations;
- larger spatial gestures communicate greater intensity or lane coverage;
- cues, fermatas, cutoffs, and resumptions retain their real musical functions.

The character is still supernatural. Mechanical finger articulation, impossible
joint precision, crimson energy, and exaggerated poses may extend the authentic
foundation. The result should resemble a real conductor transformed into a boss,
not generic magical baton waving.

## Six core phrases

### 1. Ictus

The smallest and most reusable statement.

- **Gesture:** a compact preparatory lift, exact downward baton stroke turning
  into a forward aim toward the player/camera at the crisp beat point, then a
  controlled upward withdrawal/rebound. The baton is foreshortened at impact;
  it does not physically shorten. See `storyboards/ictus-v2-notes.md` for the
  requested pose revision, which supersedes the lower-left storyboard strike.
- **Attack:** a red low-hazard arc releases on the beat point in one lane.
- **Player demand:** jump on time or make a single-lane escape.
- **Variations:** displaced accents, closely spaced double strokes, or a broader
  stroke occupying two or three adjacent lanes.
- **Character:** economical and dismissive, as though one tiny motion is sufficient
  to command violence.

### 2. Changing Meter

An authored sequence built from real conducting paths.

- **Gesture:** the baton traces recognizable three-, four-, or five-beat patterns.
  Direction changes and beat points remain clean at gameplay scale.
- **Attack:** each beat releases a one-lane low arc, tall barrier, or deliberately
  placed rest. Spatial direction helps foreshadow which region is being addressed.
- **Player demand:** recognize the phrase, track staggered arrivals, and respond to
  the next beat rather than only the nearest object.
- **Variations:** switch meter at a phrase boundary; alternate `3+2` and `2+3`
  groupings in five; repeat a familiar path with different lane coverage.
- **Character:** the hand appears perfectly comfortable commanding an awkward
  rhythm that destabilizes the player.

### 3. Sectional Entrance

The Conductor calls a selected part of the battlefield into action.

- **Gesture:** a preparatory lift followed by a precise finger or palm cue toward a
  lane region. The hand locks at the end of the cue.
- **Attack:** one to three adjacent organ-pipe tall barriers enter as a rank. A
  sequence of cues can move the surviving gap from side to side.
- **Player demand:** commit to the open region early enough and avoid firing a
  counterattack into the pipe rank.
- **Variations:** stagger two sections, overlap a pipe rank with a low arc, or leave
  an apparent firing lane that closes on the next cue.
- **Character:** it treats lanes like orchestra sections that obey individually.

### 4. Fermata

Timing pressure created through deliberate suspension.

- **Gesture:** the baton rises and holds; the fingers maintain visible tension and
  the hand becomes unnaturally still.
- **Attack:** a clearly energized formation is held near the boss, then released
  only after a visible resumption gesture. This must look intentionally sustained,
  never like the projectile delay previously rejected in the prototype.
- **Player demand:** resist moving or jumping too early, then react to the precise
  release.
- **Variations:** a short or long authored hold, one false relaxation without a
  release, or a held formation layered above attacks already in motion.
- **Character:** it controls not only what arrives, but whether musical time itself
  seems permitted to continue.

### 5. Resonant Invitation

The boss appears to offer the player something worth absorbing, but the invitation
is baited with genuine danger.

- **Gesture:** the fingers open and the baton is presented forward as a formal cue,
  invitation, or taunt.
- **Attack:** hollow pale resonance waves are embedded within damaging low arcs,
  pipe barriers, or a rapidly changing route. They never arrive as isolated, safely
  collected charge.
- **Player demand:** dodge or jump through the surrounding formation, reach the
  offered lane, and remain grounded at the correct moment to absorb. Pursuing the
  wave is optional, valuable, and meaningfully more dangerous than declining it.
- **Variations:** successive offerings change lane, a safe absorption lane becomes
  a poor counterattack lane because of an organ pipe, or the firing opening arrives
  after the next cutoff.
- **Character:** The Conductor treats the player's power as something that must be
  won by accepting its terms.

### 6. Cutoff and Re-entry

A phrase transition weaponized as a false ending.

- **Gesture:** a real cutoff closes the current motion into absolute stillness,
  followed by a small preparatory upbeat for the next entrance.
- **Attack:** a sustained train or occupied region ends exactly on the cutoff. The
  re-entry immediately establishes a different lane demand, meter, or safe region.
- **Player demand:** release the old movement plan, read the preparation, and avoid
  treating the silence as safety.
- **Variations:** change articulation, reverse the previous lane order, place a
  resonance wave on the re-entry, or create a brief clean counterattack window.
- **Character:** it ends and restarts the battlefield with complete authority.

## Special phrase: Cadenza

Cadenza recombines the established vocabulary rather than introducing unrelated
rules.

1. The hand becomes completely still.
2. Individual fingers and the baton signal a memorable lane and response sequence.
   A finger-to-lane relationship may be used here even if it is not literal during
   the rest of the fight.
3. The hand locks into a poised configuration.
4. It performs the signaled sequence at high speed using Ictus strokes, pipe ranks,
   resonance waves, held releases, and one decisive cutoff.

The difficulty is memory plus execution. The signaling must be readable enough
that failure feels attributable to the player rather than hidden information.

## Shared choreography rules

Production choreography uses complete authored hand-frame clips rather than a
runtime-assembled palm/finger joint rig. See `animation-direction.md` for shared
poses, transitions, anchoring, timing and export requirements.

- Gesture preparation precedes the relevant attack by a musically meaningful
  interval; the beat point and gameplay release share the same transport clock.
- Attacks never sit visibly at an ordinary starting line before moving. Only the
  explicitly staged Fermata may hold a formation, and its animation must make that
  intention unmistakable.
- Large gestures are reserved for large musical or gameplay consequences.
- Rapid passages shorten the motion while preserving precision instead of making
  the hand flail.
- A successful player counterattack produces strong graphic impact feedback but no
  boss stagger, flinch, animation reset, chart pause, or attack cancellation.
- The source handoff's proposed disruptive hit reaction is superseded by the
  accepted non-interruption rule.

## Still needed before an authored chart

- Accept, revise, or reject the six phrases and Cadenza structure.
- Develop the accepted mechanical-chamber-orchestra/deconstructed-club direction
  into a composition brief: approximate duration, meter map, tempo regions,
  instrumentation, and musical motif.
- Decide exact telegraph lengths and projectile travel times through playtesting.
- Arrange the accepted phrases into a scored encounter timeline with purposeful
  recurrence, contrast, and transformation.
