# 2D wind-up review draft

User explicitly returned to finished 2D whole-hand drawings based on the approved
upright-baton image. No further 3D finger/hand/rig work is authorized by this step.
Earlier finger studies remain preserved, not the active direction.

Built-in image generation (imagegen skill), one attempt only. Asset:
`ictus-windup-eight-frame-study-01.png`. Eight cells, four columns/two rows.
Actual output is 1774 x 887, not the requested 2048 square; use measured cell
dimensions. Each cell contains a whole hand; no cut-out rig, warping or crossfade.
Wrist cores are registered by translation at constant scale. Frame selection
covers the approved 130 ms preparation with requestAnimationFrame playback.
Eight drawings is not a guarantee of 60 displayed frames per second on devices.

Preview: `windup-lab.html`. Normal/quarter speed, scrub and replay. Stops at
wind-up endpoint for review, not an intended hold in the complete attack.
No strike, recovery, combat changes or new tip effect. Original approved art is
linked for comparison and not overwritten. This generated sheet is NOT
pixel-identical to the original. General anatomy is retained, but ornaments,
surface detail and apparent proportions vary; exact depth extension is unproven.
Review draft only: do not promote to production or claim animation quality passed.
User should judge this in motion before any further generation.

## Exact built-in prompt

Use case: precise-object-edit. Asset: ONE 2D animation sprite sheet, 2048x2048, EXACTLY FOUR equal columns and TWO equal rows (8 frames row-major). Each cell 512x1024. Pure black background, no labels, no separators.
Image1 is the approved Conductor upright-idle identity, proportions, five-digit anatomy, precise brass machinery and cuff. Image2 is only the tiny wrist-extension endpoint guide; do not import its changed ornaments.
Draw a temporally coherent EIGHT-FRAME sequence from image1's upright baton pose into a subtle NINE-degree backward wrist extension, NOT the strike. Progression 0%, 5%, 20%, 40%, 60%, 80%, 95%, 100%. Wrist extends in DEPTH away from viewer; baton remains nearly vertical in screen projection, no sideways sweep. Subtle change is intended. All fingers preserve identical grip throughout: thumb/index pinch plus three curled free fingers. No shape redesign.
Whole hand in EVERY cell, same scale and camera, fixed cuff core at local x256 y760, unchanged cuff and hanging charms. Entire long baton and ornaments visible with padding. Copy image1's gritty detailed ivory/brass/crimson semi-pixel artwork, never smooth 3D or vector. Keep exact same silhouette details, crack placement and ornament count across cells. Only palm/grip rotation about cuff changes slightly; do not slide or scale the character.
Frame1 faithfully matches upright image1 except REMOVE red tip sparkle from ALL frames, plain ivory baton tip. Keep wrist-core crimson star. No intermediate glowing effect, no blur, no crossfade, no duplicate hands. Maintain same exposure and detail in all frames. This is animation inbetweening of a SINGLE design, not eight design variations.
