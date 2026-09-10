# Temporary Conductor rig art

Generated on 2026-09-10 with the built-in image-generation tool, using
`docs/bosses/conductor/Conductor_visual.png` as the user-provided reference.

Output: `public/assets/conductor-lab/parts.png` (1536 × 1024).

This is provisional cutout art for the isolated motion study, NOT an approved
replacement for the canonical Conductor design. It was generated as six reusable
parts, not manually traced from the reference. Texture and proportions differ.

The first generation returned a checkerboard baked into RGB pixels rather than
true transparency. A second image-generation edit replaced it with black.
The runtime uses screen blending over the dark study background. That makes
black disappear but can brighten overlapping joints. It is unsuitable as a final
alpha/occlusion pipeline. Production art needs real transparency, cleaned joint
coverage, explicit layering and a reviewed source asset/export workflow.

No PixelOver project, Aseprite source, frame-by-frame animation sheet or production
rig export was created. The hierarchy and animation in this study are TypeScript.

## Generation prompt

```text
Use case: stylized-concept. Asset type: transparent game sprite PARTS ATLAS for a temporary articulated 2D rig.
Reference image: supplied Conductor image is the character design and texture reference. Preserve its antique ivory porcelain plates, rich aged brass circular joints, crimson internal strands, heavily stippled grungy chunky pixel art. No whole character; no background.
Create exactly SIX isolated disconnected pieces in a 3 columns x 2 rows grid on a 1536x1024 genuinely TRANSPARENT canvas. Each cell 512x512. Each part completely inside its own cell with at least 45 px margins. No labels, no drawn grid, no text, no shadows outside parts.
Cell top left: JUST the broad mechanical PALM plate, viewed from the same palm-side angle, fingers and wrist removed, ivory segmented shell over crimson dark inner material, approximately 270 px wide x 350 px tall, upright.
Cell top center: JUST the ornate wrist CUFF with oval dark hollow core, crimson inner rim and brass trim, loose red threads hanging down, approximately 330 px wide x 330 px tall, upright.
Cell top right: one elongated isolated straight FINGER PHALANX segment, ivory with dark red exposed underside, 95 px wide x 310 px tall, upright with rounded covered ends so it can overlap a joint.
Cell bottom left: one shorter isolated straight FINGERTIP segment, ivory plate with dark crimson underside, 90 px wide x 210 px tall, upright with rounded end.
Cell bottom center: ONE circular BRASS KNUCKLE joint, concentric intricate aged gold rings with black and crimson center, 170 px diameter, round face straight toward camera.
Cell bottom right: isolated straight thin ivory BATON with tiny ornate brass grip at bottom and crimson star at tip TOP, 45 px wide x 400 px tall, vertical.
These are movable cutout pieces, NOT six versions of a hand. No assembled fingers. Match reference texture and appearance, visibly coarse pixel clusters. No smooth 3D or clean vector. Fully transparent background and separated components.
```

## Cleanup edit prompt

```text
Edit target: this exact six-piece Conductor parts sheet. Change ONLY the checkered background to perfectly uniform solid RGB black (#000000). Remove EVERY gray/white checker square, including between hanging threads, holes, and outside objects. Keep all six objects, their details, pixel texture, exact positions and sizes unchanged. No grid, text, lighting, shadows or new elements. This is a sprite atlas to be composited over black in a game. Pure black background, NOT a checkerboard and NOT a transparency preview.
```
