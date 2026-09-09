# Implementation status

Last checkpoint: **prototype implementation and local verification complete**
(2026-09-09). All requested work is saved in this working tree. The user will
review, commit and push with GitHub Desktop. No remote deployment or git commit
has been made.

- [x] Save specification and continuation checklist.
- [x] Scaffold dependencies, type checking, linting and Pages workflow.
- [x] Implement deterministic chart and renderer-independent combat.
- [x] Implement audio transport and original synthesized track.
- [x] Implement portrait rendering, screens and touch/keyboard controls.
- [x] Test combat and prove full-chart winning route.
- [x] Verify build and browser behavior; fix findings.
- [x] Update README and hand off commit instructions.

## Verified results

- `npm run check`: ESLint, 22 Vitest combat tests, TypeScript and Vite build pass.
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
  They cover absorb-window endpoints, absorb-over-fire priority, shot interception,
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
