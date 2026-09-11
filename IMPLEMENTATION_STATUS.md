# Implementation status

## Model workflow preference

Before beginning any development-level implementation for the game—including edits
to game code, assets, build configuration, tests, or deployment files—tell the user
first so they can switch to GPT-6 Astra High if needed. Do not begin that
implementation in the same turn as the reminder unless the user has already said
they are using GPT-6 Astra High. Planning, design discussion, research, and review
can continue on GPT-5.6 Sol Medium.

## Current checkpoint — clean Ictus v2 and live baton magic (2026-09-11)

User rejected v1's white outline noise and rigid baked star. Rebuilt the hand
sheet on a green key, removed the key with explicit prior authorization, and
exported 30 PNG drawings plus a PNG/JSON atlas. Current runtime asset is
`public/assets/conductor-lab/ictus-whole-hand-v2.*`. Metadata now drives frame
rectangles, palm registration and physical baton-tip attachment.

Character playback: 30 fps. Canvas and effects: native display refresh; removed
15/30 display throttles. Separate pulse, sparks, trail and release flare animate
from song time. Release moved to 16/30 seconds with a matching audio accent.
See `docs/bosses/conductor/animation-drafts/ictus-v2-notes.md` for exact generation
prompt, extraction details, outputs and remaining visual-review limits.

Build, ESLint and 26 unit tests pass. All four updated browser scenarios passed
(three together, then the first after fixing its numeric slider input). The first
checks changing magic on an identical resting hand frame after all attacks have
left. Final 390x844 ready/strike/rebound screenshots show clean edges and attached
tip effects. Repository formatting also passes. No remote deployment performed.
Suggested commit: `Refine Conductor animation and add live baton magic`.

## Previous checkpoint — whole-hand Ictus v1 (2026-09-11)

The approved v4 storyboard has a first animated draft in
`/resonance/conductor-lab.html`. The user authorized local alpha recovery after
two built-in image-generation attempts painted a checkerboard into RGB pixels.
The recovered PNG/JSON atlas is `public/assets/conductor-lab/ictus-whole-hand-v1.*`;
24 individual PNG frames and generation provenance are in
`docs/bosses/conductor/animation-drafts/`. See its README for extraction limits.

The complete hand is sampled at 24 fps for one second, then rests for one second.
The forward strike releases a staggered 2-lane, 1-lane, 3-lane red-arc formation.
Vertical rebound has no programmed hold. The clip uses the existing audio clock,
pause/fullscreen/portrait lifecycle and scrub/dropped-draw inspection controls.
The old `src/lab/rig.ts` and `parts.png` were removed; Git history retains them.
The playable Three.js prototype is unchanged.

ESLint, TypeScript, build, formatting and all 26 unit tests pass. Four updated
Chrome study scenarios passed before final matte/CSS cleanup. Final 390x844
screenshots confirm the grip opening is clear, the upright baton fits, and the
clip remains playing across a loop. Main-game browser regressions were not rerun
in this pass. This is a motion-review draft: grip detail varies and the frontal
strike-to-vertical rebound needs visual review. No production art approval or
remote deployment is implied. Suggested commit: `Add whole-hand Ictus animation preview`.

## Historical checkpoint — Conductor motion study (2026-09-10)

Latest artifact: `docs/bosses/conductor/storyboards/ictus-poses-v4.png`, a five-pose
storyboard created from `Conductor_visual_transparent.png` with built-in image
generation. It is ready for gesture/silhouette review, not approved production
frames. At the user's request, pose04 now aims toward the player/camera with a
foreshortened baton; v1's lower-left strike is superseded. See
`storyboards/ictus-v2-notes.md` for that revision. Pose05 now remains frontal with
the baton vertically upward and passes immediately back toward01, with no hold.
The user rejected v3's grip perspective. V4 redraws the thumb/index pinch around
a separate vertical baton handle and restores all three free fingers.
See `storyboards/ictus-v4-notes.md` for the latest edit prompts and review limits.
`storyboards/README.md` records earlier prompts and remaining alignment/detail
issues. No animation or game code changed in this storyboard pass. Resume with
the user's review before producing the full Ictus animation and live preview.

**Design decision after phone review:** the fully modular body-part rig is
rejected. Restart Conductor production animation from the original canonical
reference using complete authored hand-frame clips. Do not use the later idle WebP
as an asset or starting point. Share neutral, raised-preparation and closed-cutoff
poses instead of building every pairwise transition; ordinary clips include their
own preparation and recovery. Preserve the proven audio-clock frame selection and
release synchronization. See
`docs/bosses/conductor/animation-direction.md` for the locked direction.

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
pipeline validation is implied. Phone review found synchronized timing but rejected
the rig's crab-like silhouette, off-center palm, weak Ictus and subtle fingers. No
commit, push or remote deployment has been performed by the agent.

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
