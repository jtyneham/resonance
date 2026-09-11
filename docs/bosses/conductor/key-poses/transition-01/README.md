# Strike-to-rebound transition study 01

User approved both draft key poses and requested the next step immediately.
Seven complete drawings: accepted strike, five individually generated in-betweens,
accepted rebound. All sources preserved; built-in image generation used.
This is a sparse 0.4-second motion study (six intervals), not 30/60 unique fps.
The display uses requestAnimationFrame, with discrete whole-image changes.
No crossfade, body-part rig or optical-flow morphing is used.

The lab plays once, offers quarter-speed playback and scrubbing, and retains an
original-reference toggle. Stopping at the last frame is an inspection boundary,
not an authored hold. The eventual rebound must continue into the return.
This excerpt starts at impact; the approved fast approach is outside its scope.
All media preloads before playback. Fullscreen and portrait presentation remain.

Registration is explicit in src/lab/transition.ts: wrist-opening position and a
uniform scale for each full drawing align the hand. Source PNGs are not changed.
The generated in-betweens were requested at 15/30/45/60/75 degrees, but filenames
describe requested positions, not geometrically verified angles. The first 60
degree attempt was replaced because its baton drifted sideways too far.
Remaining limitations: sparse temporal sampling, grip/detail variation, baked
magic, black backgrounds, approximate registration. This study needs visual
review before additional frames or a complete clip. No final-art claim.

## Source IDs

15: exec-363fcfd5-5f84-470d-a3c5-c9e0e2507434.png
30: exec-99059230-f0a8-4b3c-92a1-889d96216794.png
45: exec-5f4334da-cfa0-47a8-9e7c-8918e70ba27a.png
60 rejected: exec-9b539969-ae90-4a1c-8174-450b29636789.png
60 corrected: exec-d02fce49-a4d5-4240-8bf9-6c9944808779.png
75: exec-06662904-7c5f-4274-b05e-e11bd6322947.png

## Exact prompts

### 15 degrees

Use case: stylized-concept. Create ONE whole-hand in-between drawing, not a sheet. Image 1 is accepted strike (baton toward camera), image 2 accepted vertical rebound. Interpolate the physical pose at 15/90 of the upward rotation. Keep image 2's exact hand scale, wrist cuff position, framing, black background, ivory/brass/crimson pixel-art rendering. Baton is now lifted 15 degrees above the camera axis toward vertical; apparent shaft length is 26 percent of the upright shaft in image 2. Tip projects straight above grip along screen vertical, with foreshortening, and has a small red star. Rotate the thumb/index grip coherently between references, preserving five digits: opposing thumb, separate curled index behind pinch, all three free fingers to right. Keep free fingers, cuff, wrist star, hanging charms and all ornamentation as close to image 2 as possible; change only the grip angle and physical baton direction. Slender ivory taper, no extra collars. This is a precise animation in-between between supplied keys, no character redesign, no extra hand or text. Match the second image canvas.

### 30 degrees

Use case: stylized-concept. Create ONE whole-hand in-between drawing, not a sheet. Image 1 is accepted strike (baton toward camera), image 2 accepted vertical rebound. Interpolate the physical pose at 30/90 of the upward rotation. Keep image 2's exact hand scale, wrist cuff position, framing, black background, ivory/brass/crimson pixel-art rendering. Baton is now lifted 30 degrees above the camera axis toward vertical; apparent shaft length is 50 percent of the upright shaft in image 2. Tip projects straight above grip along screen vertical, with foreshortening, and has a small red star. Rotate the thumb/index grip coherently between references, preserving five digits: opposing thumb, separate curled index behind pinch, all three free fingers to right. Keep free fingers, cuff, wrist star, hanging charms and all ornamentation as close to image 2 as possible; change only the grip angle and physical baton direction. Slender ivory taper, no extra collars. This is a precise animation in-between between supplied keys, no character redesign, no extra hand or text. Match the second image canvas.

### 45 degrees

Use case: stylized-concept. Create ONE whole-hand in-between drawing, not a sheet. Image 1 is accepted strike (baton toward camera), image 2 accepted vertical rebound. Interpolate the physical pose at 45/90 of the upward rotation. Keep image 2's exact hand scale, wrist cuff position, framing, black background, ivory/brass/crimson pixel-art rendering. Baton is now lifted 45 degrees above the camera axis toward vertical; apparent shaft length is 71 percent of the upright shaft in image 2. Tip projects straight above grip along screen vertical, with foreshortening, and has a small red star. Rotate the thumb/index grip coherently between references, preserving five digits: opposing thumb, separate curled index behind pinch, all three free fingers to right. Keep free fingers, cuff, wrist star, hanging charms and all ornamentation as close to image 2 as possible; change only the grip angle and physical baton direction. Slender ivory taper, no extra collars. This is a precise animation in-between between supplied keys, no character redesign, no extra hand or text. Match the second image canvas.

### 60 degrees

Use case: stylized-concept. Create ONE whole-hand in-between drawing, not a sheet. Image 1 is accepted strike (baton toward camera), image 2 accepted vertical rebound. Interpolate the physical pose at 60/90 of the upward rotation. Keep image 2's exact hand scale, wrist cuff position, framing, black background, ivory/brass/crimson pixel-art rendering. Baton is now lifted 60 degrees above the camera axis toward vertical; apparent shaft length is 87 percent of the upright shaft in image 2. Tip projects straight above grip along screen vertical, with foreshortening, and has a small red star. Rotate the thumb/index grip coherently between references, preserving five digits: opposing thumb, separate curled index behind pinch, all three free fingers to right. Keep free fingers, cuff, wrist star, hanging charms and all ornamentation as close to image 2 as possible; change only the grip angle and physical baton direction. Slender ivory taper, no extra collars. This is a precise animation in-between between supplied keys, no character redesign, no extra hand or text. Match the second image canvas.

### 75 degrees

Use case: stylized-concept. Create ONE whole-hand in-between drawing, not a sheet. Image 1 is accepted strike (baton toward camera), image 2 accepted vertical rebound. Interpolate the physical pose at 75/90 of the upward rotation. Keep image 2's exact hand scale, wrist cuff position, framing, black background, ivory/brass/crimson pixel-art rendering. Baton is now lifted 75 degrees above the camera axis toward vertical; apparent shaft length is 97 percent of the upright shaft in image 2. Tip projects straight above grip along screen vertical, with foreshortening, and has a small red star. Rotate the thumb/index grip coherently between references, preserving five digits: opposing thumb, separate curled index behind pinch, all three free fingers to right. Keep free fingers, cuff, wrist star, hanging charms and all ornamentation as close to image 2 as possible; change only the grip angle and physical baton direction. Slender ivory taper, no extra collars. This is a precise animation in-between between supplied keys, no character redesign, no extra hand or text. Match the second image canvas.

### 60-degree correction

Use case: precise-object-edit. Image1 edit target is a near-upright mechanical conductor hand key. Keep hand, five fingers, grip, all ornaments and their EXACT positions and scale unchanged. Change only the baton: shorten visible ivory shaft by 12 percent while keeping its grip base fixed, and tilt its tip very slightly to the RIGHT (5 degrees from vertical). Move its little red sparkle to new tip. This is the in-between just before this supplied image. Keep background black, entire image dimensions and all hand pixels as closely as possible. No other changes.
