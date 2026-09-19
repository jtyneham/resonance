# Conductor idle sheet review 03

Preview: `idle-lab.html`. Continuity preview: `continuity-lab.html`.

An intermediate correction fixed the general direction but still reconstructed
the character's hand-to-baton proportions. Review 03 uses a stricter canonical
template made from sixteen exact copies of the first approved Ictus cell. Image
generation was then limited to introducing the idle micro-movement. This makes
the actual Ictus frame the direct authority for occupied size, palm registration,
anatomy, palette, lighting, materials, proportions, perspective and padding.

The idle and Ictus renderers now share the canonical Ictus wrist-core coordinate:
`(246, 327)` inside its `443.5 × 443.5` source cell. Both present that anchor at
canvas coordinate `(300, 500)`. The Ictus retains its approved `1.25` presentation
scale. Runtime continues to play the idle drawings 1→16→1 and renders the
baton-tip magic separately.

The generated neutral checkerboard is removed in memory through the shared idle
sheet helper. Unlike the first sheet, cleanup is color-based rather than assuming
the baton sits at the cell center; this preserves the canonical left-offset baton
and removes neutral checker residue enclosed by the grip. The source raster
remains untouched.

The user's motion correction makes the whole hand's vertical float the primary
idle action. Runtime moves the complete drawing twelve canvas pixels upward and
back over two seconds with a seamless baseline-to-baseline curve. The sixteen
drawings remain useful only as secondary gravitational follow-through: free
fingers, cloth and hanging ornaments subtly trail the rise and reversal. They
still play 1→16→1 in the same cycle. There is no lateral drift, scaling or
progressive vertical accumulation, and both idle/Ictus seams retain zero offset.

## Selected generation prompt

Use case: precise-object-edit. Asset type: 16-frame 4×4 pixel-art idle sprite
sheet. The input is an exact edit target containing sixteen identical copies of
the approved upright Ictus frame and is absolute authority for layout, identity,
scale, palm registration, anatomy, palette, lighting, materials, proportions,
perspective, detail and padding. Keep drawing 1 faithful to the input. Across
drawings 2–16, introduce only the outward half of an almost imperceptible idle
breath: minute wrist extension, tiny tightening of the three free fingers and
subtly delayed hanging-ornament movement, with at most two source pixels of
displacement. Runtime reverses 16→1. Preserve exactly four columns by four rows,
sixteen equal cells, the same wrist-core coordinate and complete baton/ornament
padding. No reconstruction, restyling, resizing, palette drift, anatomical
change, attack gesture, motion blur, labels or text.
