const NOTE_PATHS = [
  'M 8 78 C 14 62, 24 43, 47 31 C 64 22, 76 20, 91 27',
  'M 88 18 C 96 34, 94 55, 82 70 C 74 80, 65 84, 53 87',
  'M 7 39 C 18 24, 37 17, 56 21 C 72 24, 83 34, 91 46',
  'M 91 78 C 74 91, 49 94, 27 87 C 17 84, 10 76, 6 66',
  'M 17 91 C 6 73, 7 50, 18 33 C 24 24, 31 18, 42 14',
  'M 79 89 C 90 76, 94 57, 88 40 C 84 28, 77 19, 66 13',
  'M 5 58 C 18 70, 35 74, 53 68 C 70 63, 82 51, 94 36',
  'M 94 61 C 80 51, 66 45, 50 47 C 31 49, 18 59, 7 72',
] as const;

const NOTE_ART = [
  '<ellipse cx="-2.8" cy="4.8" rx="4.1" ry="2.7" transform="rotate(-18 -2.8 4.8)"/><rect x="0.4" y="-8" width="1.7" height="12.4"/>',
  '<ellipse cx="-2.8" cy="4.8" rx="4.1" ry="2.7" transform="rotate(-18 -2.8 4.8)"/><rect x="0.4" y="-8" width="1.7" height="12.4"/><path d="M1-8c4.8.8 7.2 3.3 6.2 6.8C5.7-3 4-3.8 1-4.2z"/>',
  '<ellipse cx="-5" cy="5" rx="3.6" ry="2.5" transform="rotate(-16 -5 5)"/><ellipse cx="5" cy="3" rx="3.6" ry="2.5" transform="rotate(-16 5 3)"/><path d="M-2-8v12h1.5V-4l9-1.8V2h1.5V-9.5z"/>',
  '<path d="M-10-5h20v1H-10zm0 3h20v1H-10zm0 3h20v1H-10zm0 3h20v1H-10z" opacity=".45"/><ellipse cx="-2" cy="4" rx="3" ry="2" transform="rotate(-16 -2 4)"/><rect x=".3" y="-6" width="1.4" height="9.5"/>',
] as const;

type ActiveNote = {
  element: SVGGElement;
  timer: ReturnType<typeof setTimeout>;
};

/** Independent, infrequent accents and a sparse, unsynchronised musical current. */
export function titleAmbience(game: HTMLElement, title: HTMLElement) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 600px), (max-height: 700px)');
  const noteLayer = title.querySelector<SVGSVGElement>('.musical-notes')!;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const accents = new Set<Animation>();
  const notes = new Set<ActiveNote>();
  let noteSpawnTimer: ReturnType<typeof setTimeout> | undefined;
  let running = false;

  const random = (min: number, max: number) =>
    min + Math.random() * (max - min);
  const noteLimits = () =>
    smallScreen.matches ? { min: 7, max: 12 } : { min: 10, max: 18 };

  function removeNote(note: ActiveNote) {
    clearTimeout(note.timer);
    timers.delete(note.timer);
    note.element.remove();
    notes.delete(note);
  }

  function spawnNote(seeded = false) {
    if (!running || notes.size >= noteLimits().max) return;
    const near = Math.random() < 0.34;
    const duration = near ? random(4200, 6400) : random(6100, 8000);
    const elapsed = seeded ? duration * random(0.12, 0.72) : 0;
    const peakOpacity = near ? random(0.44, 0.58) : random(0.27, 0.39);
    const scale = near ? random(0.22, 0.28) : random(0.15, 0.205);
    const turn = random(-8, 8);
    const reverse = Math.random() < 0.22;
    const path = NOTE_PATHS[Math.floor(Math.random() * NOTE_PATHS.length)];
    const art = NOTE_ART[Math.floor(Math.random() * NOTE_ART.length)];
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add(
      'ambient-note',
      near ? 'ambient-note-near' : 'ambient-note-distant',
    );
    group.innerHTML = `
      <animateMotion dur="${duration}ms" begin="indefinite" path="${path}" rotate="0" fill="freeze"${reverse ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}/>
      <animate attributeName="opacity" dur="${duration}ms" begin="indefinite" values="0;${peakOpacity * 0.72};${peakOpacity};${peakOpacity * 0.66};0" keyTimes="0;.16;.48;.78;1" fill="freeze"/>
      <g transform="rotate(${turn}) scale(${scale})">${art}</g>`;
    noteLayer.append(group);
    group
      .querySelectorAll<SVGAnimationElement>('animateMotion, animate')
      .forEach((animation) => animation.beginElementAt(-elapsed / 1000));

    const note = {} as ActiveNote;
    const remaining = Math.max(120, duration - elapsed);
    note.element = group;
    note.timer = setTimeout(() => {
      removeNote(note);
      ensureMinimumNotes();
    }, remaining);
    notes.add(note);
    timers.add(note.timer);
  }

  function ensureMinimumNotes() {
    if (!running) return;
    while (notes.size < noteLimits().min) spawnNote(notes.size > 0);
  }

  function scheduleNoteSpawn() {
    if (!running || noteSpawnTimer) return;
    const delay = smallScreen.matches ? random(160, 450) : random(100, 300);
    noteSpawnTimer = setTimeout(() => {
      const timer = noteSpawnTimer!;
      noteSpawnTimer = undefined;
      timers.delete(timer);
      const limits = noteLimits();
      if (
        running &&
        notes.size < limits.max &&
        (notes.size < limits.min || Math.random() < 0.96)
      ) {
        spawnNote();
      }
      scheduleNoteSpawn();
    }, delay);
    timers.add(noteSpawnTimer);
  }

  function startNotes() {
    ensureMinimumNotes();
    scheduleNoteSpawn();
  }

  function stopNotes() {
    noteSpawnTimer = undefined;
    [...notes].forEach(removeNote);
  }

  function resizeNotes() {
    if (!running) return;
    const { max } = noteLimits();
    while (notes.size > max) removeNote(notes.values().next().value!);
    ensureMinimumNotes();
  }

  function schedule(
    selector: string,
    min: number,
    max: number,
    frames: Keyframe[],
    duration: number,
  ) {
    const timer = setTimeout(
      () => {
        timers.delete(timer);
        if (!running) return;
        const target = title.querySelector<HTMLElement>(selector)!;
        const animation = target.animate(frames, {
          duration,
          easing: 'ease-in-out',
        });
        accents.add(animation);
        animation.onfinish = () => accents.delete(animation);
        schedule(selector, min, max, frames, duration);
      },
      min + Math.random() * (max - min),
    );
    timers.add(timer);
  }

  function sync() {
    const enabled =
      !document.hidden &&
      !title.hidden &&
      !preference.matches &&
      !game.classList.contains('reduced-motion');
    if (enabled === running) return;
    running = enabled;
    title.dataset.ambient = running ? 'running' : 'paused';
    if (running) {
      schedule(
        '.brass-light',
        8000,
        12000,
        [
          { opacity: 0, backgroundPosition: '0% 50%' },
          { opacity: 0.22, offset: 0.45 },
          { opacity: 0, backgroundPosition: '100% 50%' },
        ],
        2300,
      );
      schedule(
        '.artwork-ring-inner',
        7000,
        14000,
        [
          { translate: '0 0' },
          { translate: '1px -0.7px', offset: 0.18 },
          { translate: '-0.45px 0.4px', offset: 0.4 },
          { translate: '0 0' },
        ],
        420,
      );
      startNotes();
    } else {
      timers.forEach(clearTimeout);
      timers.clear();
      accents.forEach((animation) => animation.cancel());
      accents.clear();
      stopNotes();
    }
  }
  title.dataset.ambient = 'paused';
  const observer = new MutationObserver(sync);
  observer.observe(game, {
    attributes: true,
    attributeFilter: ['class', 'data-screen'],
  });
  observer.observe(title, { attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  smallScreen.addEventListener('change', resizeNotes);
  sync();
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    preference.removeEventListener('change', sync);
    smallScreen.removeEventListener('change', resizeNotes);
    timers.forEach(clearTimeout);
    accents.forEach((animation) => animation.cancel());
    stopNotes();
  };
}
