# Resonance

**Five lanes. One spark. Strike the rhythm back.**

A playable, portrait-first browser combat prototype. Survive an authored,
music-driven dummy encounter, absorb resonant notes, and land five counterattacks
before the 45-second track ends. Built with TypeScript, Three.js, Vite and Web Audio.

The dummy proves the shared combat system. The Conductor, The Prism and The Silence
are planned future encounters; their final art, charts and music are not included yet.

## Play

After the first successful GitHub Pages deployment:
[jtyneham.github.io/resonance](https://jtyneham.github.io/resonance/).

On the title screen, use **Fullscreen**, then **Start → Enter battle**.
Open **Options + controls** first for the visual attack guide. Mobile gameplay is
portrait only; rotating a touch device pauses the fight. Desktop keeps a centered
portrait frame. Browser fullscreen and orientation locking are requested where
supported; a rejected request never blocks normal browser play.

| Action         | Touch          | Keyboard               |
| -------------- | -------------- | ---------------------- |
| Move one lane  | Left / Right   | ← / → or A / D         |
| Jump           | Jump           | Space, W or ↑          |
| Absorb / fire  | Resonate       | J, F or Enter          |
| Pause / resume | Pause / Resume | Escape (P also pauses) |

- Coral low waves: jump or sidestep.
- Lime diamond notes: tap Resonate at the hit line, within ±120 ms, while grounded.
- Ivory tall barriers: sidestep; they cannot be jumped or absorbed and block shots.
- Two absorbs charge one shot. Tap Resonate away from an absorb opportunity to fire.
  Absorbing takes priority if a note is in range, even when fully charged.
- One lane change per jump. Holding movement does not repeat.
- Three HP; damage empties charge. Five shots hitting the boss win; timeout loses.
- Music and attacks pause together. Returning to the tab or portrait does not
  resume a battle until you press Resume.

Use speaker audio or wired headphones when checking timing; Bluetooth latency can
make rhythm judgments harder. Volume and reduced motion are available in Options.

## Run locally

Install Node.js **22.12+** (Node 24 recommended), then:

```sh
npm ci
npm run dev
```

Open the `/resonance/` URL printed by Vite. To preview exactly what Pages serves:

```sh
npm run build
npm run preview
```

Open `http://localhost:4173/resonance/`. `dist` is generated output and is ignored by
Git. Dependencies, build files and local test screenshots should not be committed.

## Check the code

```sh
npm run check
npm run format:check
npm run test:e2e
```

`check` runs ESLint, Vitest, TypeScript and the production build. Browser tests run
against the production build under `/resonance/`; run `npm run build` before them.
By default they use installed Google Chrome. Use the `PLAYWRIGHT_CHANNEL=msedge`
environment variable for Edge. On PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_CHANNEL
```

The browser suite covers settings, five lanes, multitouch, jump/move, pause,
rotation, fullscreen, defeat/retry, desktop keyboard, small layouts and a complete
victory with a persisted record. Its winning driver sends keyboard events using
the visible song progress; there is no production invincibility or cheat API.
Ignored screenshots and failure traces are written to `test-results/`.

## Publish with GitHub Desktop

1. In the repository's **Settings → Pages**, select **GitHub Actions** as the source.
   Leave Custom domain blank.
2. Review the local changes in GitHub Desktop. Use commit summary
   **Build mobile-first Resonance prototype**.
3. **Commit to main**, then **Push origin**.
4. Open the repository's **Actions** tab. Wait for **Build and deploy Resonance**
   to finish successfully.
5. Open **Settings → Pages → Visit site** and test the game on your phone.

The workflow installs the lockfile dependencies, runs code checks and formatting
checks, builds `dist`, and deploys it. Pull requests run the build/check job without
deploying. The Vite base path is `/resonance/`, as required by
[Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy#github-pages).
No secrets, backend, custom domain, or manually committed build folder are needed.

## Where to change things

| File                       | Responsibility                                        |
| -------------------------- | ----------------------------------------------------- |
| `src/game/config.ts`       | Health, timing windows, jump, tempo and shot tuning   |
| `src/game/chart.ts`        | Original, deterministic 120-beat attack score         |
| `src/game/battle.ts`       | Combat rules independent of graphics and browser APIs |
| `src/audio/transport.ts`   | Audio clock, synthesized track, sound effects         |
| `src/rendering/arena.ts`   | Procedural arena, boss, player, notes and effects     |
| `src/main.ts`              | Screens, inputs, lifecycle, fullscreen and HUD        |
| `src/style.css`            | Portrait layout, menus, safe areas and touch controls |
| `PROTOTYPE_SPEC.md`        | Agreed scope and current tunable defaults             |
| `IMPLEMENTATION_STATUS.md` | Durable development and verification checkpoint       |

Attack entries specify **impact beats**, lane, width, kind and travel time. Fast
notes have advance lane warnings. The seven main phrases use flanking resonant
pairs, uneven one/two/three-note bursts, mirrored walls, wide waves and accelerated
reprises; the final phrase provides another counterattack opportunity.

## Prototype limits and next playtest

- All art is procedural geometry and all sounds are synthesized specifically for
  this prototype. No Everhood assets, music or charts are used.
- Local records/settings are best effort when storage is blocked or cleared.
- The manifest supports portrait standalone launch, but this is not an offline
  PWA; there is no service worker or stale asset cache to manage.
- Real iOS/Android hardware, audio latency, thumb comfort and thermal performance
  need phone playtesting. Emulated mobile testing does not establish those.
- The locally tested production build still needs its first hosted Pages check
  after the user's push. No commit or push is performed automatically.
- Three.js is the largest bundle (~133 KB compressed); geometry and pixel density
  are kept modest. Final effects, music production and difficulty tuning come
  after feedback on the controls and core loop.
