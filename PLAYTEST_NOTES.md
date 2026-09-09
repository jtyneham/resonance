# Prototype playtest notes

This file preserves human playtest findings and the remaining checklist across
Codex tasks. It is product evidence, not a claim that emulation equals phone use.

## Phone test 1 — live GitHub Pages

Positive findings:

- Fullscreen was easy to find, worked on the first tap, hid browser chrome, stayed
  portrait and resized cleanly.
- The goal and Start-versus-controls choice were understandable.
- Both thumbs comfortably reached the controls. Buttons were large enough, were
  not too close, did not cause accidental neighboring inputs, reacted immediately,
  remained responsive in dense patterns and did not cover attacks.
- Multitouch jump plus direction worked. The single airborne lane move was clear.
- The charged Resonate state was visually distinct.
- Gesture navigation did not interfere. Device cutout/edge overlap was minor.
- Each tap moved exactly one lane, never moved twice and was rarely/never ignored.
- Lane occupancy and multi-lane attack width were readable without lane numbers.
- Jump began immediately, had enough visible height, and its rotation was a useful
  touch. The reason tall barriers hit during a jump was understandable.

Changes requested and implemented in revision 2:

- Title felt crowded: remove the battle field, boss and player from title; move
  navigation toward the middle and improve its spacing.
- Absorption becomes automatic when a grounded player meets a resonance wave.
  Resonate is now the charged counterattack button and glows gently when ready.
- Add the lightest supported-device haptic pulse to on-screen control presses.
- Raise the touch controls slightly above the lower fullscreen border.
- Make lateral animation faster. Remove active-lane number/highlight marker.
- Shorten and speed up the jump; buffer a late second move until landing.
- Shorten the visible lanes to reserve more boss performance space; slow incoming
  attack travel slightly to compensate.
- Make resonance waves less visually dominant while keeping their own shape.
- Preserve stronger landing feedback as a later visual-polish item.

Nuanced findings to reassess after revision 2:

- Outer lanes and resonance waves were “too readable/distinct”; test whether the
  revised proportions and muted resonance color are still clear but less dominant.
- The safe portion of a jump was only “kind of” judgeable. The faster jump may
  change this, so check clarity before adding a separate indicator.
- Movement felt slightly delayed and a pre-landing press could be ignored. Recheck
  after faster interpolation and the 120 ms landing buffer.
- The current dummy moveset did not provide enough evidence to judge whether the
  attack speed is right. Treat speed and pattern variety as unvalidated; revise or
  expand the authored chart before asking that question again.

## Follow-up change

- Removed the projectile pre-spawn preview. Attacks had been rendered for 20% of
  their travel duration at a clamped zero-progress position, making them visibly
  wait on the boss-side starting line. They now appear at progress zero and begin
  moving immediately on their first visible frame.

Not answered yet; retain for the next playtest:

- Exact phone, OS/browser/audio-output details.
- Initial loading speed; blank, clipped or misplaced content; immediate recognition
  as a game; Start-button visibility.
- Detailed clarity of every instruction and attack category after auto-absorb copy.
- Reliability of diagonal movement over repeated dense inputs.
- Attack collision alignment, each pattern's readability/fairness, phrase/timer of
  unclear moments, motif learning and difficulty progression.
- Counterattack opening/block clarity and satisfaction.
- Audio/visual synchronization, pause/background drift and Bluetooth comparison.
- Difficulty ratings, attempts, win rate, common failure and desire to retry.
- Performance, heat, battery, repeated-retry degradation, settings persistence,
  reduced motion, low-audio play, text/contrast and result-screen clarity.

For bugs, capture device/browser, phrase name, timer, lane, action and observed
result. A short recording is especially valuable for timing or collision issues.
