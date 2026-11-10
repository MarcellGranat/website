// Darth Maul in his iconic stance: he jumps up from below the bottom edge holding the double-bladed saber across his body, then
// switches the blades on one after another, each with a line (the second one is the crazy one).
export const MAUL_LINES = [
  ['Agentic coding', 'Make no mistake'],
  ['Vibe coding', 'Ship it on Friday'],
  ['Think step by step', 'Then rewrite everything in Rust'],
  ['Context window: 1M tokens', 'Still forgot the first line'],
  ['Fix the failing test', 'By deleting the test'],
  ['Add one small feature', '+4,000 lines, 0 tests'],
];

const SVG = `
<svg viewBox="0 0 120 150" class="m-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="40" ry="4" fill="rgba(20,24,28,.14)"/>
  <ellipse class="m-foot-a" cx="35" cy="143" rx="9" ry="4.5" fill="#0c0d10"/>
  <ellipse class="m-foot-b" cx="86" cy="143" rx="10" ry="4.5" fill="#0c0d10"/>
  <path d="M28 124 Q26 100 50 80 L56 118 L50 134 Z" fill="#0c0d10"/>
  <path d="M52 112 L38 141 L51 141 L63 114 Z" fill="#17181d"/>
  <path d="M60 112 Q84 118 86 141 L73 141 Q71 128 56 122 Z" fill="#17181d"/>
  <path d="M50 80 Q66 73 77 82 L79 117 Q62 127 47 117 Z" fill="#101114"/>
  <path d="M56 93 Q66 100 75 93 L75 119 Q65 124 55 119 Z" fill="#1d1f25"/>
  <path d="M47 108 Q63 117 79 108 L79 115 Q63 124 47 115 Z" fill="#2a2c33"/>
  <path d="M58 62 L75 62 L77 80 Q66 86 56 80 Z" fill="#0c0d10"/>
  <path d="M45 82 Q64 68 82 82 L86 93 Q64 85 43 93 Z" fill="#0c0d10"/>
  <g class="m-head" transform="translate(7 1) rotate(5 60 62)">
    <path d="M45 32 L40 18 L51 27 Z M53 26 L52 10 L60 24 Z M62 24 L68 10 L67 27 Z M69 27 L80 18 L75 32 Z M60 24 L60 12 L61 24 Z" fill="#1a1412"/>
    <rect x="53" y="56" width="14" height="10" fill="#b82a28"/>
    <ellipse cx="60" cy="44" rx="15.5" ry="18.5" fill="#d1302d"/>
    <path d="M60 26 V40 M53 28 Q50 38 53 46 M67 28 Q70 38 67 46" stroke="#14100f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M45 41 Q52 35 59 42 Q52 47 45 41 Z M75 41 Q68 35 61 42 Q68 47 75 41 Z" fill="#14100f"/>
    <g class="m-eyes"><ellipse cx="52" cy="41.5" rx="3" ry="2" fill="#ffd21e"/><ellipse cx="68" cy="41.5" rx="3" ry="2" fill="#ffd21e"/>
    <path d="M52 40 V43 M68 40 V43" stroke="#14100f" stroke-width="1" stroke-linecap="round"/></g>
    <path d="M44 36 L58 41 M76 36 L62 41" stroke="#14100f" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M47 49 L52 57 M73 49 L68 57 M60 48 V54 M60 61 V64.5" stroke="#14100f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52 59.5 Q60 55.5 68 59.5 Q60 62 52 59.5 Z" fill="#2a0a0a"/>
    <path d="M54 58.4 Q60 56.6 66 58.4 L66 59.6 Q60 58 54 59.6 Z" fill="#f2eadf"/><path d="M57 57.4 V59.2 M60 57 V59 M63 57.4 V59.2" stroke="#2a0a0a" stroke-width=".6"/>
  </g>
  <path d="M52 85 Q40 96 52 94" stroke="#1d1f25" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M70 85 Q90 94 71 94" stroke="#1d1f25" stroke-width="9" stroke-linecap="round" fill="none"/>
  <g class="m-blades">
    <g class="m-blade"><rect class="m-bl1" x="34" y="91.7" width="0" height="3.6" rx="1.8" fill="#ff3b3b"/><rect class="m-bl2" x="34" y="92.9" width="0" height="1.2" rx=".6" fill="#ffe6e6"/></g>
    <g class="m-blade"><rect class="m-br1" x="86" y="91.7" width="0" height="3.6" rx="1.8" fill="#ff3b3b"/><rect class="m-br2" x="86" y="92.9" width="0" height="1.2" rx=".6" fill="#ffe6e6"/></g>
  </g>
  <rect x="34" y="90.5" width="52" height="6" rx="2" fill="#8d939d"/>
  <rect x="34" y="89.8" width="4" height="7.4" rx="1.2" fill="#3a3d45"/><rect x="82" y="89.8" width="4" height="7.4" rx="1.2" fill="#3a3d45"/>
  <path d="M42 90.5 V96.5 M46 90.5 V96.5 M74 90.5 V96.5 M78 90.5 V96.5" stroke="#5a5f69" stroke-width="1"/>
  <circle cx="53" cy="93.5" r="4.8" fill="#0c0d10"/><circle cx="71" cy="93.5" r="4.8" fill="#0c0d10"/>
</svg>`;

const LEN = 72; // blade length in svg units

const rand = (a, b) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createMaul() {
  const root = document.createElement('div');
  root.className = 'maul';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<div class="m-label m-label-l"></div><div class="m-label m-label-r"></div><div class="m-bob"><div class="m-flip">${SVG}</div></div>`;
  document.body.appendChild(root);
  const labelL = root.querySelector('.m-label-l');
  const labelR = root.querySelector('.m-label-r');
  const bob = root.querySelector('.m-bob');
  const flip = root.querySelector('.m-flip');
  const q = (c) => root.querySelector(c);
  const sides = {
    l: { rects: [q('.m-bl1'), q('.m-bl2')], f: 0 },
    r: { rects: [q('.m-br1'), q('.m-br2')], f: 0 },
  };
  // each blade grows out of the hilt's end (plain attribute animation)
  const setBlade = (side, f) => {
    const s = sides[side];
    s.f = f;
    for (const r of s.rects) {
      const w = LEN * f;
      r.setAttribute('width', String(w));
      if (side === 'l') r.setAttribute('x', String(34 - w));
    }
  };
  const grow = (side, to) => new Promise((done) => {
    const from = sides[side].f, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 380);
      setBlade(side, from + (to - from) * k);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });

  let bag = [];
  const nextPair = () => {
    if (!bag.length) bag = [...MAUL_LINES].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const visit = async () => {
    const [first, second] = nextPair();
    const w = document.documentElement.clientWidth;
    const mw = root.offsetWidth;
    const margin = (38 / 120) * mw + 70; // room for the blades and the labels on them
    const x = w - mw - 2 * margin > 0 ? rand(margin, w - mw - margin) : (w - mw) / 2;
    labelL.textContent = first;
    labelR.textContent = second;
    for (const l of [labelL, labelR]) l.style.maxWidth = `${Math.min(120, w / 2 - 10)}px`;

    flip.style.scale = `${x + mw / 2 < w / 2 ? 1 : -1} 1`; // turned sideways, facing the middle of the screen

    // he jumps up from below the bottom edge and lands in his stance
    root.style.transform = `translateX(${x}px)`;
    const away = 'translateY(125%)';
    bob.style.transform = away;
    root.classList.add('on');
    await bob.animate([
      { transform: away, easing: 'cubic-bezier(.2, .7, .3, 1)' },
      { offset: 0.6, transform: 'translateY(-70px) scale(.96, 1.06)', easing: 'cubic-bezier(.5, 0, .8, .4)' },
      { offset: 0.86, transform: 'translateY(0) scale(1.1, .88)', easing: 'ease-out' },
      { transform: 'none' },
    ], { duration: 1100, fill: 'forwards' }).finished;
    bob.getAnimations().forEach((a) => a.cancel());
    bob.style.transform = '';
    await wait(300);

    root.classList.add('lit');
    labelL.classList.add('show');
    await grow('l', 1);
    await wait(1400 + first.length * 45);
    labelR.classList.add('show');
    await grow('r', 1);
    await wait(2200 + second.length * 55);
    labelL.classList.remove('show');
    labelR.classList.remove('show');
    await grow('r', 0);
    await grow('l', 0);
    root.classList.remove('lit');
    await wait(350);

    // a little hop, then he drops back out of sight
    await bob.animate([
      { transform: 'none', easing: 'ease-out' },
      { offset: 0.3, transform: 'translateY(-34px)', easing: 'ease-in' },
      { transform: away },
    ], { duration: 800, fill: 'forwards' }).finished;
    bob.getAnimations().forEach((a) => a.cancel());
    root.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch (e) {
        console.error('maul visit failed', e);
        root.classList.remove('on', 'lit');
        labelL.classList.remove('show');
        labelR.classList.remove('show');
        bob.getAnimations().forEach((a) => a.cancel());
        setBlade('l', 0); setBlade('r', 0);
      }
    },
  };
}
