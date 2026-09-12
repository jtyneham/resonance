# In-between attempts — rejected, not runtime assets

User rejected the three-pose styled-lab playback as too sparse and authorized proper
in-between work. Four built-in image-generation attempts were inspected and rejected:

- atlas-01-rejected.png: 16-cell sheet repeats near-upright poses, tips baton sideways,
  then jumps to an endpoint. Not a faithful wrist-flexion sequence.
- midpoint-01-rejected.png: nominal 45-degree pose remains close to upright and
  changes the silhouette without establishing reliable joint continuity.
- atlas-02-rejected.png: corrected vertical baton projection but appears to shorten
  the baton rather than convincingly rotate the whole grip/palm through depth.
- construction-guided-01-rejected.png: stronger obedience to geometric guide but
  redesigns the approved palm/fingers and makes baton appear attached to index.

No generated output is approved, imported by runtime code, or installed in the
live preview. More frames alone did not solve this. Existing wrist motion remains
the approved timing source; styled-lab is still the rejected three-pose study.
Do not present it again as improved.

The screenshot player-midpoint-45.png in animation-reference/approved-wrist was
captured from the unmodified wrist lab at 508 ms (about 45 degrees of flexion).
Headless Chrome navigation timed out in sandbox; approved outside-sandbox capture
succeeded. Screenshot capture does not signify approval of styled artwork.

Next approach requires discussion: a single consistent constructed source rendered
to whole-character frames could prevent independent image-generation drift. This
is only a proposal, NOT authorization to rebuild a modular production character or
change art style. No hire/outsource suggestion.

## Exact prompts

### Atlas 1

Use case: stylized-concept.
Asset type: a production-oriented sprite animation sheet, ONE square image containing EXACTLY 16 whole-character drawings, 4 equal columns by 4 equal rows, no grid lines, no labels, no margins between cells, pure black backdrop. Highest available resolution. Each square cell has identical framing and scale.
Input image 1: approved upright Conductor identity and idle. Image 2: bent-wrist strike endpoint, material reference; reconcile its proportions to image 1, do not inflate the hand. Image 3: plain geometric intermediate pose explains the wrist pivot ONLY, not art style. Image 4: side view at strike explains flexion depth ONLY; output always FRONT player view.
Character: floating FIVE-finger mechanical conductor hand, cracked ivory plates, aged brass rings, crimson tendon cords, oval black wrist cuff with crimson core star and hanging brass charms. Long thin ivory baton in stable thumb/index pinch. Three other fingers curled consistently. Every joint, ornament, crack and proportion must remain consistent across frames. Original detailed gritty semi-pixel raster texture, not smooth 3D.
Animation: smoothly progressive wrist flexion in DEPTH toward viewer. Cuff is motionless, centered at x50% y75% inside every cell; wrist-core scale constant. Hand pivots immediately above cuff; no sideways rotation, no camera change, no whole-hand lunge, no growing/shrinking. Baton follows the hand's rigid grip; its tip moves down and toward the camera through foreshortening. Tip plain ivory, NO red sparkle at baton tip. Wrist core red star stays.
ROW MAJOR frame sequence is a pose-angle atlas, NOT a full loop:
1 wrist extension -9 degrees (very subtle backward windup), 2 -4 degrees, 3 perfectly upright 0 degrees (image 1 without baton glow), 4 6 degrees forward;
5 12 degrees, 6 18 degrees, 7 24 degrees, 8 30 degrees;
9 37 degrees, 10 44 degrees, 11 51 degrees, 12 58 degrees;
13 65 degrees, 14 72 degrees, 15 78 degrees, 16 83 degrees (baton pointing directly at viewer like image2).
Every neighboring frame must be a genuinely different small anatomical depth rotation, NOT duplicates. Baton remains long; projected length diminishes smoothly until mostly end-on at frame16. Keep all hand/charms/baton within each cell. No arcs, motion blur, ghost limbs, attacks, scenery, captions, border, extra arms or other characters. Prioritize consistent topology across all 16 drawings.

### Midpoint 1

Use case: precise-object-edit. Asset: ONE intermediate whole-hand animation drawing, not a sheet.
Image 1 is the upright Conductor identity. Image 2 is the forward-facing strike endpoint. Produce the EXACT halfway anatomical pose: wrist flexed FORWARD 45 degrees out of the image plane toward the viewer. Wrist cuff and crimson core remain upright fixed at the same place, same size as image1. Bend above the cuff. Entire PALM AND ALL FIVE DIGITS rotate together around wrist, not merely the baton. Show foreshortened palm and more of the top/back planes of the curled fingers. Thumb on left pinches baton against curved index; three curled fingers to right retain their relative positions. Baton rigidly follows that grip, pointing diagonally up AND toward camera, still projecting vertically upward in image (not toward left). It is about 70 percent the projected length of upright. Same object orientation about yaw, no side rotation. AVOID sideways tipping, moving the whole wrist upward, changing camera, enlarging the hand, changing finger count, redesigning grip. Treat the gap between references as wrist motion in depth, NOT a transition from one unrelated hand design to another.
Copy image1's exact aged ivory, brass, crimson cords, ornaments, fine crunchy pixel detail and black background. Keep cuff oval/core and dangling charms aligned with image1. Whole hand and baton inside the frame. Plain ivory baton tip with NO sparkle, retain crimson star in wrist core. No labels or effects. One centered character, same full image size and framing as first reference.

### Atlas correction

Use case: precise-object-edit. Input 1 is a draft 4x4 animation sprite sheet to correct; input 2 is the required frontal strike endpoint; input 3 is upright identity reference.
Keep sheet layout EXACTLY 4 columns 4 rows, black background, NO captions, NO border, 16 complete sprites. Keep intricate cracked-ivory/brass/crimson pixel art. Correct MOTION only, but make the changes substantial enough: the draft repeats too many poses and changes only baton tilt. We need 16 distinct sequential projections of the SAME hand flexing at its wrist toward camera, with no change to camera, finger count, grip or cuff position.
Use row-major these wrist depths: -9deg, -4deg, 0deg, 20deg; 30deg, 38deg, 45deg, 51deg; 57deg, 62deg, 67deg, 71deg; 75deg, 78deg, 81deg, 84deg.
Cuff/core remains absolutely stationary at same size and relative x50% y75% in EVERY cell. Hand foreshortens and knuckle tops become visible progressively. In FINAL row especially: all four curled fingers face viewer with their knuckle arches increasingly over the curled lower segments; thumb stays pinched to index around baton. By LAST cell the hand MUST match input2's forward bent silhouette (scaled so cuff size unchanged), NOT upright input3 with a shorter stick.
Baton projects VERTICALLY UP in player view, never points left or right. Gradually shorten its projected length with depth: upright longest, 45deg about70%, 62deg about45%, 75deg about25%, 78deg about20%, 81deg about12%, 84deg nearlyend-on circular ivory tip aimed at viewer. Its near end should appear progressively rounder and larger, without changing actual baton thickness. Entire grip must rotate in depth along with palm, not just the stick.
No glow at tip. Keep wrist-core crimson star and dangling ornaments identical. All sprites in equal square cells, fixed scale, fixed framing, enough padding for whole baton/charms. No smearing, ghost images, duplicate poses, gibberish, limbs growing/shrinking, added objects. Aim for a coherent drawn in-between animation, not a concept art variations sheet.

### Construction-guided midpoint

Use case: sketch-to-render. Image1 is the EDIT TARGET and mandatory pose/silhouette guide. Image2 is MATERIALS AND CHARACTER DETAIL reference ONLY; do not copy its pose or framing.
Paint the geometrical hand in image1 into The Conductor's detailed gritty pixel-art finish from image2. Keep image1's camera, exact positions of every digit, thumb-index pinch, full baton line, wrist-palm pivot, foreshortening and relative scale. This is a 45-degree wrist flexion pose and cannot be made upright. Keep FIVE digits. Replace white finger tubes with cracked ivory armor, gold spheres with segmented brass knuckles/rings, palm slab with ornate layered ivory palm armor and crimson tendons. Make the palm and each finger continuous anatomically without altering their existing joint locations. Replace the BLUE CUFF with ornate brass-bordered oval black wrist core with crimson star and a few hanging charms in image2's vocabulary. Do not widen fingers or spread them sideways. Do not shift joints to match image2! Keep baton thin and at exact angle/projection of image1, held through fixed thumb-index pinch. Remove red tip sphere and red trace line; ivory tip. Pure black background. No blue remains. Detailed game sprite, crisp textured pixel clusters, same light direction and palette as image2. ONE whole character, no labels, no arrows, no extra arms. Faithfulness to IMAGE1's anatomical arrangement is more important than copying the outline of image2.
