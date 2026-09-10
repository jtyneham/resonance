# Implementation status

## Model workflow preference

Before beginning any development-level implementation for the game—including edits
to game code, assets, build configuration, tests, or deployment files—tell the user
first so they can switch to GPT-6 Astra High if needed. Do not begin that
implementation in the same turn as the reminder unless the user has already said
they are using GPT-6 Astra High. Planning, design discussion, research, and review
can continue on GPT-5.6 Sol Medium.

## Current checkpoint — Conductor motion study (2026-09-10)

Implemented a separate `/resonance/conductor-lab.html` PixiJS 8 technical study.
The existing Three.js game remains intact. It includes a temporary generated
cutout hand with 15 nested finger joints, idle/Ictus/finger clips, an audio-clock
pose sampler, timing clicks, scrubbing, pause, fullscreen and drawing diagnostics.
See `docs/bosses/conductor/rig-study.md` for scope and remaining decision gates,
and `rig-study-art.md` beside it for asset provenance and exact generation prompts.

Build, ESLint, TypeScript, 26 unit tests, repository formatting and diff checks
pass. All 11 Chrome browser scenarios passed together (2.6 minutes, exit 0):
four study checks plus all seven existing game regressions, including a real
audio-clock victory. Rendered Ictus and finger poses were visually inspected.
The built study page and its atlas both return HTTP 200 under `/resonance/`.
The first runner stalled during managed-server teardown after reporting its
results; rerunning against a separately started preview completed cleanly.

No PixiJS migration decision, production art approval or PixelOver/Aseprite
pipeline validation is implied. Real-phone smoothness, perceived audio alignment
and gesture readability still need the user's test after publishing. No commit,
push or remote deployment has been performed by the agent.

Suggested commit summary: `Add isolated Conductor animation study`.
After push and a green Pages workflow, open
<https://jtyneham.github.io/resonance/conductor-lab.html>.
The existing workflow already builds and publishes both entries; no Pages
settings change is required. Two older design documents received formatting-only
cleanup so the existing CI formatting gate can pass; their prose is preserved.

## Earlier prototype checkpoint

Previous checkpoint: **phone playtest revision 2 complete and locally verified**
(2026-09-09). The first prototype is live on GitHub Pages. Revision 2 implements
automatic absorption, faster/shorter jump, landing input buffer, faster movement
animation, shorter field, slower attacks, cleaner title, raised controls, subtle
haptics, no active-lane marker, softer resonance-wave styling and a gently glowing
charged button. These revision-2 edits are uncommitted and ready for user review.

Follow-up: removed the stationary projectile pre-spawn interval after live-preview
feedback. The dummy chart's variety/speed remains unvalidated by the human test and
needs a dedicated chart pass before asking for another speed judgment.

- [x] Save specification and continuation checklist.
- [x] Scaffold dependencies, type checking, linting and Pages workflow.
- [x] Implement deterministic chart and renderer-independent combat.
- [x] Implement audio transport and original synthesized track.
- [x] Implement portrait rendering, screens and touch/keyboard controls.
- [x] Test combat and prove full-chart winning route.
- [x] Verify build and browser behavior; fix findings.
- [x] Update README and hand off commit instructions.

## Verified results

- Revision 2: `npm run check`, formatting and `git diff --check` pass. The revised
  Vitest suite has 21 focused tests, including automatic grounded absorption,
  jumping a resonance wave, full-charge absorption, late landing input buffering,
  revised travel values and a zero-damage winning route.
- All seven Chrome browser scenarios completed successfully against the revision-2
  production build. The key revised title/options/storage, touch/rotation and real
  AudioContext victory scenarios were rerun together and exited cleanly (2 passed,
  1.2 minutes for the final focused run). Revised screenshots were inspected.
- Haptics use the optional Vibration API with a 7 ms pulse. Unsupported browsers
  simply omit vibration; physical-phone feel remains a human playtest item.

- The first deployed revision passed ESLint, 22 Vitest combat tests, TypeScript and Vite build.
- `npm run format:check`: passes. `git diff --check`: passes.
- Seven Playwright tests pass in installed Google Chrome against the production
  build at `/resonance/` (six flow tests together, plus the render test separately).
- Three cross-browser tests pass in installed Microsoft Edge: multitouch and
  rotation/pause, fullscreen and defeat/retry, and wide-wave rendering.
- Browser tests cover a real AudioContext-driven win via normal keyboard handlers,
  saved clear record, volume/reduced-motion persistence, all five lane labels,
  simultaneous jump/move touches, frozen pause, explicit resume after rotation,
  fullscreen toggle, defeat/retry and desktop keyboard controls.
- Layouts checked at 320x568, 390x844, Pixel 7 portrait, 412x915 and 1440x900.
  Screenshots inspected for title, battle, defeat and wide-wave presentation.
- Unit tests prove a zero-damage winning route through the main phrases and coda.
  They covered the original manual absorb window and priority, shot interception,
  one airborne lane move, low/tall collisions, immunity, retry and timeout ordering.
- Fixed a real async resume/rotation race caught by the browser suite, guarded
  pending transitions, and adjusted small-screen/title safe-area spacing.
- The Three.js bundle produces Vite's advisory >500 KB raw chunk warning
  (~133 KB compressed). Build succeeds; no downloaded art or audio is required.

## Next steps for the user

1. In GitHub Desktop, review Changes on main.
2. Commit summary: `Build mobile-first Resonance prototype`.
3. Commit to main, then Push origin.
4. Wait for the `Build and deploy Resonance` workflow's green result.
5. Open https://jtyneham.github.io/resonance/ on a phone and test.

Pages source must be GitHub Actions; custom domain stays blank. The included
workflow checks and builds before deploying. The first live deployment is not
locally verifiable before the push.

## Remaining product work (after this prototype)

Physical Android/iOS playtesting for timing, thumb comfort, safe-area/fullscreen
behavior and performance. Browser mobile emulation is not physical-phone testing.
Tune the exposed config and chart from that feedback before building The Conductor.
The other bosses, final music/art, calibration and controller support remain later
work. Do not expand into those merely because the user says "continue"; first
inspect any new feedback or deployment result.

## Resume procedure

Read this file and PROTOTYPE_SPEC.md; inspect git diff/status and source files.
Run the existing checks; continue at the earliest incomplete checkpoint.
Completed edits are in this working tree. Do not discard them or restart the project.
The user will commit and push; no remote deployment has occurred yet.
