# Everhood footage study for Resonance

Date: 2026-09-09. This is an observational design study of the five recordings supplied by the user. Recommendations below are proposals, not additional locked combat rules or an instruction to implement them immediately.

## Main finding

The desired erratic feel involves several things working together: recognizable formations, changing available routes, concentrated bursts, pauses, boss gestures, and major changes in the presentation of the arena. Projectile count or speed alone would reproduce only a small part of the reference.

Design the sequence of decisions the player makes alongside the boss's performance. The attack chart needs phrases with different movement demands and a dramatic structure; the scene needs to visibly participate in those phrases.

## Sources and method

All timestamps refer to elapsed time in the supplied files, including introductions, dialogue, and outros. They are approximate observation anchors, not exact chart event boundaries.

| Local source                                    | File duration | Source video          |
| ----------------------------------------------- | ------------- | --------------------- |
| `C:/Users/Haizara H5/Desktop/EH-FrogsWrath.mp4` | 08:59.26      | 1280 x 720, 60 fps    |
| `C:/Users/Haizara H5/Desktop/EH_Zigg.mp4`       | 04:46.77      | 1280 x 720, 29.97 fps |
| `C:/Users/Haizara H5/Desktop/EH_LightMan.mp4`   | 02:40.80      | 1280 x 720, 30 fps    |
| `C:/Users/Haizara H5/Desktop/EH_gnomeBoss.mp4`  | 04:26.61      | 1280 x 720, 60 fps    |
| `C:/Users/Haizara H5/Desktop/EH_shopkeeper.mp4` | 04:26.63      | 1280 x 720, 60 fps    |

Review method:

- Timestamped overview frames at five-second intervals across all five recordings.
- Thirteen selected eight-second sequences inspected at half-second intervals.
- Five two-second movement sequences inspected at 12 frames per second, one per fight.
- Approximately 630 sampled frames inspected in total. This is sampled visual and motion analysis, not a claim to have watched every source frame continuously with sound.
- FFmpeg confirmed an audio track in every file. Direct listening was not available in this analysis; musical genre, exact beat alignment, sound-design quality, and audiovisual drift were not assessed. Visual timing observations must not be mistaken for an audio synchronization measurement.

There is one supplied recording per encounter. Repetition within a recording demonstrates recurring motifs, but these files alone cannot prove identical behavior across retries, rule out randomness, or establish reactive targeting. Controller inputs, hitboxes, invulnerability windows, and haptic output are not visible. The displayed movement can be described; actual input latency cannot be measured.

Fight names follow the user's filenames. This study does not assume the files include both Everhood games or verify game versions, difficulty settings, or modifications.

## LightMan: alternating scatter and concentrated discharge

### Observations

- **00:00-00:10:** the luminous figure emerges and becomes the focal point before the sampled attack sequence grows busy.
- **00:15-00:40:** separated gold crescent attacks form staggered routes across the lanes, interrupted by conspicuous upright lightning-marked obstacles. The dark space around them keeps the formations distinct.
- **00:42-00:49.5:** a close sequence shows the transition from gold notes and upright red obstacles into magenta marked notes, rows of cross-marked notes, and tightly spaced gold streams. The boss changes from compact poses to raised arms with branching lightning.
- **00:53-01:00.5:** multicolored formations alternate with concentrated gold trains. Some trains sit on top of the broader pattern, creating two simultaneous scales to read: the general formation and a particularly occupied lane.
- **01:00-01:25:** the overview returns to a more separated gold-note vocabulary.
- **01:30-02:30:** the lightning-and-stream vocabulary recurs extensively. This fight has repeated recognizable material as well as bursts of surprise.
- **02:35:** the sampled field has cleared while the boss remains in a strong lightning pose.

### Design interpretation

The boss feels electrical because its posture, lightning, and concentrated attacks express the same action. The change in attack density is associated with a visible performance change, rather than a stationary character emitting unrelated objects.

The 12 fps sample at **00:54-00:56** is particularly useful: many notes advance while the player can occupy a comparatively quiet part of the field. Visual activity does not translate directly into required inputs per second.

### Application to Resonance

Give a boss a characteristic alternation between dispersed attacks and concentrated bursts. Develop a distinctive release pose and recovery pose alongside the pattern. Preserve enough visual space that a player can identify the occupied lanes even during the discharge.

## Zigg: repeated streams shape a moving route

### Observations

- **00:10-01:10:** the blue tiled arena is comparatively stable. Single crescents, diagonally staggered notes, and upright obstacles carry much of the challenge. The boss uses expressive arm and body poses.
- **01:15-01:35:** warm-colored trains replace the more separated blue-note presentation. The tighter spacing makes a lane look continuously occupied.
- **01:40-02:05:** blue formations and warm streams combine, then adjacent streams create larger occupied regions.
- **01:52-01:59.5:** the close sequence shows streams moving their occupied region from one side to another, with the player repositioning into the available space. These are not simply isolated hazards to answer independently.
- **About 02:10-02:30:** attacks give way to a dialogue break and an announced special. This is an explicit interruption in pressure.
- **02:35-03:00:** separated blue formations return.
- **03:05-04:35:** extended warm-stream passages dominate, including adjacent streams and changing gaps.
- **04:04-04:11.5:** the field looks extremely busy, but the player stays near one side for multiple successive samples before changing position. The space between streams is as important as the streams themselves.
- **About 04:40:** the encounter visually resolves with a changed boss pose and an empty field.

### Design interpretation

A train of short attacks creates duration: a lane remains unsuitable for a period, so the player reads a corridor and when that corridor will change. This is a different decision from dodging one incoming object.

The same vocabulary is reused for long stretches. Variation comes from placement, overlap, duration, and release. This is evidence against interpreting the user's request for erraticness as requiring a completely new attack every second.

### Application to Resonance

Author sustained lane occupation, moving gaps, and release moments. Permit moments where holding a good position is the correct answer. Do not automatically tune difficulty by forcing more thumb taps. A repeated signature formation can establish character if its arrangements change meaningfully.

## Gnome fight: the arena becomes part of the performance

### Observations

- **00:05-00:20:** small gnome figures multiply into a group above attacks in an otherwise sparse dark scene.
- **00:25-00:35:** rails become more apparent and the presentation shifts to two racket-bearing figures with a small object between/near them.
- **00:40-01:00:** repeated gnomes become rows, a radial arrangement, and a tunnel-like background while lane attacks continue.
- **01:05-01:45:** flames and a large expressive face replace the earlier composition. The basic attack silhouettes remain recognizable through the change.
- **01:50-02:10:** two animated characters occupy the boss area.
- **02:18-02:22.5:** a circular figure enters, the arena rotates/tilts, and a dense upright stream occupies one region while separated attacks continue in others. The 12 fps sample at **02:20-02:22** confirms changing screen orientation alongside ongoing player movement and note travel.
- **About 02:30-02:50:** the two-character presentation returns with mixed low and upright attacks.
- **03:01-03:08.5:** accumulated images of notes and the player remain visible. They create visual echoes that can make the current state harder to pick out; this observation does not establish additional players or extra hitboxes.
- **03:20-04:00:** the composition becomes strongly spatial, with tilted rails, jagged side geometry, dense columns, and a patterned object overhead.
- **03:46-03:53.5:** the close sequence changes from magenta upright streams to yellow low-note trains, a broad green sweep, and blue upright streams within the transformed scene.
- **About 04:05-04:20:** the elaborate environment drops away and sparse attacks remain against darkness before the ending.

### Design interpretation

This recording most strongly supports the user's statement that the entire stage belongs to the boss. The encounter presents successive scenes, not merely a background tint behind the same behavior.

Part of the difficulty is perceptual: the player must continue following the lanes and current character position as the image changes. That is distinct from increased projectile speed or increased input demand.

### Application to Resonance

Treat major scene transformations as authored encounter events. Start by testing a readable transformation with a comparatively simple chart. On portrait touch controls, large camera rotations, retained player images, and narrow projected lanes will need specific phone testing. These effects are examples to study, not automatic additions to the first boss.

## Shopkeeper: theatrical transformations and visible offense

### Observations

- **00:05-00:30:** a compact figure presides over green lanes; separated notes develop into stacked cyan formations and diagonal groupings. Boss health becomes visible in the early sampled combat.
- **00:35-00:42.5:** repeated figures surround the arena while attack formations continue down the center.
- **00:43.5-01:00:** the figure opens into a larger silhouette as the background becomes a saturated psychedelic field. Upright obstacles and low-note groups overlap. Damage numbers at the boss provide visible evidence of successful offense.
- **About 01:05:** the scene returns to a dark, comparatively restrained presentation.
- **01:25-01:35:** the large silhouette and psychedelic field recur.
- **01:40-02:15:** new palettes, rings of shapes, and block-like decorations accompany further formations. The viewpoint also changes in some sampled passages.
- **02:18-02:23.5:** busy blocks and stacked attacks drain away, leaving the distinct magenta-rail scene with cross-shaped decorations and more separated upright attacks.
- **02:25-04:15:** the magenta scene holds while the attack vocabulary continues to vary. Player glows, upward-looking effects, and repeated damage numbers associate offense with the ongoing lane fight.
- **03:07-03:14.5:** the close sequence combines low and upright silhouettes in several colors. A large bright player-origin effect appears around **03:10**, with additional boss damage feedback later in the sequence.
- **About 04:20:** a damage number is visible at the boss as the field clears.

### Design interpretation

This is the clearest supplied reference for how retaliation can remain part of the attack-reading process. However, the footage does not reveal the buttons pressed, the exact absorption condition, charge requirement, or reasons a particular shot might fail.

The return to a restrained scene gives the large transformations more contrast. Even the spectacular part is not one constant maximum-intensity effect.

### Application to Resonance

Compose absorption opportunities and firing opportunities inside interesting formations. The player should be able to see successful energy collection, readiness, release, and boss impact. Our automatic absorption remains the accepted rule; this study does not reintroduce manual parrying.

## Frog's Wrath: escalation, interruption, and return

### Observations

- The file's **08:59** duration is not the battle's duration. It includes substantial dialogue, traversal, aftermath, and credits. Active battle presentation is approximately **01:38-05:50**.
- **01:40-01:50:** the relatively compact frog figure attacks over dark red rails, with low-note trains and upright obstacles already combined.
- **01:51-01:58.5:** after a brief clearing, a bright transformation around **01:53** expands the boss silhouette into a wheel of instruments. Attacks continue as the image changes.
- **01:55-01:57**, inspected at 12 fps: gold trains and magenta upright attacks form interleaved sequences while the player changes lane and jumps. The successive player poses show compact movement cycles, but do not reveal button timing or collision windows.
- **02:05-02:10:** a red backdrop increases the scene's intensity. Because red can also be damage feedback, its precise triggering rule is not established here.
- **02:30-02:50:** a purple field accompanies mixed upright obstacles and adjacent gold trains.
- **03:00-03:35:** the background becomes dark again while the instrument-ring silhouette persists and familiar formations return.
- **03:40-04:05:** the purple presentation and concentrated gold trains recur.
- **About 04:15-04:39:** the scene strips down to blue rails and a distant silhouette framed by windows, with dialogue and more separated attacks. The close sequence at **04:33-04:40.5** shows that this is not entirely idle: attacks still arrive before the transition back.
- **04:40-05:10:** the purple scene returns, the instruments gather again, and the boss becomes visually expansive.
- **05:09-05:16.5:** concentrated streams and upright attacks give way to broad multicolored formations, adding another distinct demand late in the fight.
- **About 05:50 onward:** the encounter gives way to dialogue, aftermath, and credits rather than continuing as nine minutes of uninterrupted combat.

### Design interpretation

The encounter communicates an emotional progression through the boss's silhouette, interruptions, scenery, and attacks. The passage with windows creates contrast before the return. Its narrative impact cannot be reproduced simply by raising spawn frequency.

### Application to Resonance

Compose a boss's emotional arc alongside its chart: assertion, escalation, an interruption or apparent retreat, and a changed return. The exact arc should come from the character. For an approximately one-minute encounter, compress this into a few purposeful changes rather than copying a four-minute fight's structure or simply speeding it up.

## What creates the erratic feel across these recordings

| Ingredient                    | Evidence                                                    | Consequence for encounter design                                      |
| ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| Staggered arrivals            | Blue Zigg passages; early LightMan; late Frog               | Players must track the next arrival, not only current occupied lanes. |
| Repeated trains               | Zigg's later fight; LightMan gold bursts                    | Lane occupation has duration and release.                             |
| Overlapping formations        | Frog around 01:55; Shopkeeper around 00:45                  | Read a combined route through multiple demands.                       |
| Contrasting phrases           | LightMan scatter/stream alternation; Zigg dialogue break    | Change the kind of attention demanded, not just the quantity.         |
| Scene transformation          | Gnome around 02:18 and 03:20; Shopkeeper around 00:43.5     | Presentation participates in the encounter's structure.               |
| Expanded boss silhouette      | Frog around 01:53; Shopkeeper's large form                  | Escalation is expressed through the character.                        |
| Deliberate relief             | Frog's blue-window passage; gnome ending                    | A reduction in pressure can make the next passage more consequential. |
| Recognizable recurring shapes | Crescent low forms and upright forms across varied settings | Basic reading can survive substantial changes in presentation.        |

The recordings suggest three separate quantities to consider when tuning a phrase:

1. Visual activity: how much of the picture is changing.
2. Reading demand: how difficult it is to identify the next viable response.
3. Action demand: how frequently and how far the player must move or jump.

They need not peak together. Zigg demonstrates high visual activity with periods of modest movement demand. The gnome's transformations increase reading demand even when familiar attack silhouettes remain in use.

## Implications for the current Resonance prototype

The inspected `src/game/chart.ts` uses seven 16-beat phrases based on substantially the same skeleton: two center resonance notes, flanking barriers, a 1-2-3 lane burst, a two-lane tall wall, and wide low attacks. Mirroring and tighter subdivisions provide variation before a short ending phrase.

That is useful for exercising mechanics, but it does not yet represent the reference's range of encounter composition. The missing evidence is not another claim that movement is broken; the user has accepted the revised movement and automatic absorption. The next encounter needs meaningful phrase differences and boss performance.

Recommended design requirements for the next chart experiment:

- A recognizable opening motif and at least one changed return of that motif.
- Several contrasting demands: a staggered traverse, a sustained occupied region with a moving gap, a mixed jump/evade formation, and an absorption/counterattack passage.
- At least one deliberate reduction in pressure.
- A visible boss cue or performance change associated with the major transition.
- Viable routes checked using Resonance's actual jump duration, one airborne lane move, landing buffer, and mobile tap controls.
- Arrival times and readable travel time considered separately. Dense attacks do not have to travel faster.
- A clearly defined hit/interaction plane even if the lane rails are visually understated.
- For a stage transformation, preserve controls and test whether the player can still locate their current lane and the incoming formation on a phone.

These are design proposals, not a request to reproduce any sampled chart or automatically add every spectacle effect.

## Corrections to earlier discussion

- Everhood in these recordings is already strongly spatial: receding lanes, perspective scaling, tilted views, and dimensional stage elements are visible. Using Three.js or perspective alone would not distinguish Resonance.
- Absorption and counterattacks should not have been described earlier as an invention unique to Resonance. Our identity must come from our implementation, boss characters, choreography, music, and presentation.
- Do not infer precise beat placement, genre, or music changes from these visual samples. Audio assessment remains a separate uncompleted part of a full audiovisual reference study.
- Do not call the boss behavior proven deterministic based on one run. The footage supports authored-looking recurring phrases; exact retry repeatability requires additional evidence.
- Dramatic red flashes and dense effects are not evidence that every moment is easy to read. Some sampled gnome and Shopkeeper passages visibly make reading harder. Our desired level of distortion still needs a deliberate choice and phone testing.

## Evidence locations

Original videos remain at the Desktop paths above. No source recording or extracted image was added to the repository.

Local timestamped contact sheets are stored outside the repository at:

`C:/Users/Haizara H5/.codex/visualizations/2026/09/09/01a08608-c5e6-7f22-ad5b-fc4e63e9cf89/everhood-study/`

- Overview: `EH-FrogsWrath-01.jpg` through `-07.jpg`; `EH_Zigg-01.jpg` through `-04.jpg`; `LightMan-01.jpg` and `-02.jpg`; `EH_gnomeBoss-01.jpg` through `-04.jpg`; `EH_shopkeeper-01.jpg` through `-04.jpg`.
- Half-second sequences: filenames begin `detail-`, followed by the source stem and starting time in seconds. Start times: LightMan 42 and 53; Zigg 112 and 244; gnome 135, 181, and 226; Shopkeeper 41, 138, and 187; Frog 111, 273, and 309.
- 12 fps sequences: filenames begin `motion-`. Start times: LightMan 54; Zigg 114; gnome 140; Shopkeeper 188; Frog 115.

This document is the durable, textual study. The contact sheets are local analysis artifacts and are not required for the game's build or deployment.
