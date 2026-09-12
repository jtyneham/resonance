# Bounded finger material/motion test

Scope approved by user: one detailed ivory finger and brass joint bending
continuously. No full hand, runtime character rig, image-generation batch or
combat change. This is a stylized procedural material study, not exact reference
reconstruction or approval of a new character design.

Observed reference vocabulary: ivory plates with chipped/cracked surfaces, dark
recesses, concentric brass joint rims, crimson linework. Hidden mechanical
interiors and reverse surfaces are inferred. One hinge and two closed, tapered
ivory segments are enough to test attachment and stable texture in motion.

Quality contract, before implementation:

- One fixed proximal segment, one distal segment pivoting at the joint center.
- Ivory surface detail remains attached to geometry, never regenerated per frame.
- Brass rims and recessed axle remain connected throughout 0–72-degree bending.
- Real 3D volume visible in front and side views; no cards or image warping.
- Nearest-neighbor low-resolution render at phone size; sharp bevel highlights,
  warm ivory shading, dark brass recesses and crimson cracks.
- Continuous time-based bending, pause and scrub. No three-frame pose switching.
- One small sample only; stop for user judgment before any full-hand work.

The img2threejs intake/material/attachment guidance informs this test. Its full
reference-reconstruction pipeline (projection baking, exploded assembly,
whole-character specification and fidelity certification) is outside the user's
explicitly bounded experiment. No such gates or reference-fidelity scores are
claimed. Seeded procedural textures are illustrative, not extracted reference art.

## Review

Built two closed lathed segments with elliptical cross sections, one centered
axle, brass rims/caps/rivets, and attached collars. The distal segment rotates
around the axle; proximal geometry remains fixed. Low-resolution canvas is
216 x 256, displayed with nearest-neighbor scaling. Not an authored sprite sheet.

Front straight, front bent and side bent phone screenshots inspected in
`test-results/finger-*.png`. No visible detachment at the tested endpoints.
One correction added deliberate front-facing fissures (random wear was too
subtle at phone resolution), reduced hemisphere intensity from 2.0 to 1.2 and
added a 1.5-intensity cap light. Reference detail and silhouette remain approximate:
this is a two-segment mechanical digit sample, not the full ornate finger design.

Browser verified more than ten distinct poses across twenty animation frames,
side switching, pause and blur. Lint, 43 unit tests, build and formatting passed.
Final acceptance of style remains the user's decision. No further expansion.

## Complete-finger extension

User approved the single-joint sample ("checks out"), then authorized one complete
finger. Available at `finger-lab.html?mode=full`; the original remains unchanged
at `finger-lab.html` with comparison links between them.

Three tapered ivory segments reuse the approved materials and brass hardware.
A fixed base axle supports a hierarchical chain: base flexion 0–0.28 rad,
middle 0–0.85 rad, tip 0–0.55 rad. The tip has a gentler nonlinear onset;
all return continuously over the same 2400 ms cycle. No palm, other fingers,
baton, wrist-motion changes or combat integration. This remains a stylized
construction study, not exact reference reconstruction or a final production rig.

Inspected straight, half-curled, curled and side screenshots. Side inspection
revealed fingertip clipping, corrected by centering the camera on the curl's
depth envelope. Unit tests cover all three continuous joint angles; browser tests
cover playback, scrubbing, side view and original-sample navigation. User approval
of this complete-finger extension is pending; stop before expanding further.
