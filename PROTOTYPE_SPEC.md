# Resonance prototype — agreed scope

This is the playable neutral combat prototype, not the finished three-boss game.
The latest conversation takes precedence over the original desktop handoff.

## Presentation and delivery

- Vite, TypeScript, Three.js; native HTML/CSS menus and touch controls.
- Mobile first. Portrait gameplay only. Desktop uses a centered portrait frame.
- Landscape phones/tablets show a rotate-back screen and pause safely.
- Fullscreen on title; request portrait lock where supported, retain a usable browser fallback.
- GitHub Pages project path `/resonance/`; Actions builds and deploys on push to main.
- User reviews, commits, and pushes with GitHub Desktop. Do not commit or push automatically.
- Procedural geometry and original synthesized music; no external assets or licensed game content.

## Combat defaults (tunable in config)

- Exactly five channel bands, indexed 0–4, with six visible boundaries.
- Left/right: one lane per touch-down or non-repeated key press.
- Jump: 0.40 seconds; one lane change per jump; low attacks can be cleared. A
  second movement press in the final 120 ms is buffered until landing.
- A grounded player automatically absorbs a resonant low wave on contact and takes no damage.
- Resonate fires only when fully charged; absorbing does not require a button press.
- Two absorbs charge one shot. One stored shot; no separate fire button.
- One resonance color in the prototype. Dark waves and tall barriers cannot be absorbed.
- Damage clears stored charge. Three player HP; brief invulnerability after damage.
- Five successful counterattacks win. Tall barriers can intercept shots.
- Encounter: 120 beats at 160 BPM = 45 seconds, plus a short count-in.
- Boss alive at timeout means defeat. Immediate retry creates fresh state.
- AudioContext clock drives rendering, attacks, collision and synthesized music.
- Pause/visibility loss freezes the transport. Resume requires a player action.

## Controls

- Four persistent bottom buttons: left, right, jump, Resonate.
- Left thumb moves; right thumb jumps/fires. Multitouch, subtle supported-device haptics and pointer cancellation are supported.
- Keyboard: arrows/A/D move, Space/W/up jumps, J/F/Enter resonates, Escape/P pauses.
- Controls never cover the battle travel area. Safe areas respected.

## Dummy encounter

Authored and deterministic, with one-, two-, and three-lane low waves, unjumpable
tall formations, shield barriers, staggered bursts, outer-to-inner cascades,
alternating attacks, uneven subdivisions, faster telegraphed notes, and reprise
variations. Erratic but readable: 2.5-beat baseline travel, explicit warning marks
for faster notes. Resonant pairs and shot openings are spread through the chart.
Every chart formation must retain a viable dodge/jump response. A deterministic
simulation test will prove at least one winning route through the full chart.

## Screens and persistence

Title, encounter selection (one dummy), options/how-to-play, battle, pause,
victory/defeat and retry. The Conductor, Prism and Silence are future work.
Volume, reduced motion and best clear score persist locally, with safe fallback
if browser storage is unavailable. No intense full-screen flashes.

## Verification

Test movement bounds, jump and landing input buffer, automatic absorption, damage, immunity,
counterattack interception, victory/timeout, deterministic chart and winnability.
Run lint, type checking, unit tests and production build. Exercise production
subpath in a browser at phone sizes, multitouch, pause/resume, fullscreen,
rotation, results/retry and settings. Physical-phone feel and hosted deployment
require user follow-up after push; do not claim those checks happened locally.
