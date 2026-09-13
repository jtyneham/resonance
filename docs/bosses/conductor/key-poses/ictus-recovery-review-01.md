# Ictus recovery review 01

User approved the corrected wind-up and strike sequence, then authorized recovery
to upright idle. Preview: `windup-lab.html?mode=ictus`.

The complete timing follows the approved wrist study:

- 0–130 ms: approved eight-frame wind-up.
- 130–260 ms: approved corrected eight-frame stroke.
- 260–1200 ms: immediate rebound and measured recovery.

The recovery reuses the existing complete hand drawings in reverse anatomical
order. It starts at stroke frame 7's next neighboring drawing (stroke frame 6),
so the pointing endpoint receives no extra hold. It then passes backward through
the stroke and wind-up drawings before settling on wind-up frame 1, the upright
idle. This avoids producing another inconsistent generated character sheet while
giving the recovery its own slower timing. There are 15 recovery drawings across
940 ms; the browser still updates on requestAnimationFrame, but repeated source
drawings are held between changes. No crossfade, warping, modular rig, new raster
generation, attack effect, music synchronization or combat integration.

The preview includes full-sequence and recovery-only playback, quarter speed and
scrubbing. Strike, mid-recovery and final idle screenshots were inspected at the
mobile test viewport. The first recovery frame is stroke frame 6 at exactly
260 ms; the final 1200 ms state is upright idle. Unit tests cover phase boundaries;
three focused browser tests cover sheet transitions, recovery playback and final
idle. User motion approval is pending.
