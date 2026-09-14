# Conductor idle sheet review 01

User authorized the first dedicated idle loop after approving the upright endpoint
of Ictus as The Conductor's resting pose. Preview: `idle-lab.html`.

This is a bounded review asset, not final production animation. Sixteen complete
hand drawings form a provisional two-second rise-and-return loop. Playback moves
from drawing 1 through 16 and then reverses through 1, avoiding the generated
sheet's abrupt high-to-low wrap. The intended motion is almost still: tiny
mechanical tension through the wrist and free fingers, a restrained hover, and
delayed movement in the hanging ornaments. Five-finger anatomy, the thumb/index
baton pinch and vertical baton silhouette are invariants. The player-facing palm
remains centered. No attack cue or conducting beat belongs in idle.

The red baton-tip magic is not baked into the drawings. It is rendered as an
independent live effect, tracks the detected tip in every drawing, and has a
small irregular pulse, rotation and orbiting motes. The wrist-core light remains
part of the character artwork.

## Asset handling

The built-in image-generation tool produced
`conductor-idle-sheet-review-01.png` as a 4 × 4 sheet. Although transparency was
requested, the first result contains a painted neutral checkerboard. The review
lab flood-removes edge-connected neutral matte pixels and recolors one exposed
pixel of pale silhouette fringe to the character's dark outline in memory;
enclosed character highlights remain protected and the source stays unaltered.
Runtime frame crops use shared integer cell boundaries because the generated
1261 × 1247 sheet is not evenly divisible by four. This prevents pixels from the
neighboring row bleeding below drawings 9–12; a four-pixel bottom gutter also
excludes the next row's baton tip where the generated artwork itself crosses the
cell boundary. A second background-extraction attempt returned true alpha but
introduced colored edge noise, so it was rejected and not copied into the
repository. The existing approved upright pose and Ictus sheets are untouched.

## Generation prompt

Use case: stylized-concept. Asset type: production-review sprite sheet for a
browser game's boss idle animation. Create one exact 4 columns by 4 rows sprite
sheet containing 16 sequential whole-character pixel-art drawings of The
Conductor performing a seamless restrained idle loop. Image 1 is the approved
upright idle pose and pose/composition authority. Image 2 is supporting
identity/material reference only. The same single floating mechanical five-finger
hand boss, palm facing the player, thumb and index pinching one slender conductor
baton vertically upward, three distinct curled free fingers, ivory joint segments,
aged brass joints and cuffs, crimson sinew/cloth, ornate oval wrist core and
dangling ornaments. A controlled nearly-static cycle: the palm hovers down a tiny
amount and back up; wrist settles by only a few degrees; the three free fingers
tighten and release by tiny increments; crimson tassels and the lowest ornaments
trail the hover slightly. Frames 1 and 16 connect seamlessly. No attack wind-up,
conducting beat, pointing or dramatic gesture. Intricate gritty semi-pixel art
matching the references exactly, consistent pixel scale, sharp edges, warm ivory,
tarnished brass and deep crimson. Exactly 16 equal square cells in a clean 4 × 4
grid, reading order. In every cell the whole hand, full baton and all hanging
ornaments are visible with padding. Keep the wrist/palm core registered at the
same exact cell coordinate, same scale and same perspective. Genuine transparent
PNG alpha. Identical five-finger anatomy, grip, silhouette, ornament count,
proportions, materials, lighting and perspective in every cell. Baton remains
straight, tapered and vertically upward in every frame; no round upper-tip knob.
Remove the baked baton-tip star because it will be animated separately; retain
the wrist-core light. No checkerboard, black painted background, labels, borders,
text, missing fingers, extra hands, crab-like silhouette, altered grip, crooked or
changing-length baton, white fringe, pose drift, redesign, camera movement, motion
blur, tween smearing or tip glow.
