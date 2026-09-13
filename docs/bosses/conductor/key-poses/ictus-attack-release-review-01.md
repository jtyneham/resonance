# Ictus attack-release review 01

Date: 2026-09-13

## Scope

This review adds a separate combat-effects layer to the approved complete Ictus
body motion. It does not alter, regenerate, warp or composite anything into the
whole-character raster drawings.

Review URL: `windup-lab.html?mode=attack`

## Release timing

- The baton light gathers during the 130 ms preparation and fast wrist stroke.
- The release occurs at 244 ms, when the final forward-pointing drawing appears.
- A short cross-flash marks that exact release; the residual glow fades over the
  next 110 ms.
- The body rebounds immediately and completes its established 1200 ms motion.

## Demonstration phrase

The preview emits six red low-hazard arcs across the five-lane field. It includes
one-, two- and three-lane widths and alternates center, outer and offset targets.
These events are an authored readability demonstration, not a locked Conductor
chart and not timing copied from any reference boss footage.

|   Time | Lane start |   Width |
| -----: | ---------: | ------: |
| 244 ms |          3 |  1 lane |
| 342 ms |          1 |  1 lane |
| 407 ms |          5 |  1 lane |
| 493 ms |          2 | 2 lanes |
| 628 ms |          4 |  1 lane |
| 702 ms |          1 | 3 lanes |

## Implementation boundary

- Baton energy, release flash, staff lines and red arcs are Canvas 2D effects.
- Baton-tip positions are registered per complete source drawing so the light
  follows the moving baton without becoming part of the character artwork.
- The character is framed above the lane field; attacks enter below its hanging
  ornaments instead of being drawn across the body.
- This study has no collision, player, damage, audio or final music synchronization.

## Review question

Judge the causal link in motion: does the gathering baton energy, sharp pointing
release and following red-arc phrase feel like one deliberate Conductor attack?
