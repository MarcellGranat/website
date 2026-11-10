// Darth Maul in his iconic stance: he strides in holding the double-bladed saber across his body, then
// switches the blades on one after another, each with a line (the second one is the crazy one).
export const MAUL_LINES = [
  ['Agentic coding', 'Make no mistake'],
  ['Vibe coding', 'Ship it on Friday'],
  ['You are a senior data scientist', 'Make no mistakes'],
  ['Write the unit tests', 'Do not hallucinate. Not even once.'],
  ['Think step by step', 'Then rewrite everything in Rust'],
  ['Context window: 1M tokens', 'Still forgot the first line'],
  ['Prompt engineering', 'Please. Pretty please. Make no mistakes.'],
  ['Fix the failing test', 'By deleting the test'],
  ['Auto-accept all edits', 'What could go wrong?'],
  ['Add one small feature', '+4,000 lines, 0 tests'],
];

const SVG = `
<svg viewBox="0 0 120 150" class="m-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="38" ry="4" fill="rgba(20,24,28,.14)"/>
  <ellipse class="m-foot-a" cx="36" cy="143" rx="9" ry="4.5" fill="#0c0d10"/>
  <ellipse class="m-foot-b" cx="84" cy="143" rx="9" ry="4.5" fill="#0c0d10"/>
  <path d="M46 112 L32 141 L46 141 L58 114 Z" fill="#17181d"/>
  <path d="M74 112 L88 141 L74 141 L62 114 Z" fill="#17181d"/>
  <path d="M42 80 Q60 74 78 80 L84 126 Q60 134 36 126 Z" fill="#101114"/>
  <path d="M50 92 Q60 99 70 92 L72 120 Q60 125 48 120 Z" fill="#1d1f25"/>
  <path d="M38 110 Q60 118 82 110 L83 118 Q60 126 37 118 Z" fill="#2a2c33"/>
  <path d="M52 62 L68 62 L72 80 Q60 86 48 80 Z" fill="#0c0d10"/>
  <path d="M40 80 Q60 68 80 80 L86 92 Q60 82 34 92 Z" fill="#0c0d10"/>
  <g class="m-head">
    <path d="M45 32 L40 18 L51 27 Z M53 26 L52 10 L60 24 Z M62 24 L68 10 L67 27 Z M69 27 L80 18 L75 32 Z M60 24 L60 12 L61 24 Z" fill="#1a1412"/>
    <rect x="53" y="56" width="14" height="10" fill="#b82a28"/>
    <ellipse cx="60" cy="44" rx="15.5" ry="18.5" fill="#d1302d"/>
    <path d="M60 26 V40 M53 28 Q50 38 53 46 M67 28 Q70 38 67 46" stroke="#14100f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M45 41 Q52 35 59 42 Q52 47 45 41 Z M75 41 Q68 35 61 42 Q68 47 75 41 Z" fill="#14100f"/>
    <g class="m-eyes"><ellipse cx="52" cy="41.5" rx="3" ry="2" fill="#ffd21e"/><ellipse cx="68" cy="41.5" rx="3" ry="2" fill="#ffd21e"/>
    <path d="M52 40 V43 M68 40 V43" stroke="#14100f" stroke-width="1" stroke-linecap="round"/></g>
    <path d="M44 36 L58 41 M76 36 L62 41" stroke="#14100f" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M48 52 Q52 58 58 60 M72 52 Q68 58 62 60 M60 48 V54" stroke="#14100f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52 57 Q60 61 68 57" stroke="#3a0d0d" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54 58 L55.5 60 L57 58.6 M63 58.6 L64.5 60 L66 58" stroke="#f2eadf" stroke-width="1" fill="none"/>
  </g>
  <path d="M47 84 Q35 96 50 94" stroke="#1d1f25" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M73 84 Q85 96 70 94" stroke="#1d1f25" stroke-width="9" stroke-linecap="round" fill="none"/>
  <g class="m-blades">
    <g class="m-blade"><rect class="m-bl1" x="34" y="91.7" width="0" height="3.6" rx="1.8" fill="#ff3b3b"/><rect class="m-bl2" x="34" y="92.9" width="0" height="1.2" rx=".6" fill="#ffe6e6"/></g>
    <g class="m-blade"><rect class="m-br1" x="86" y="91.7" width="0" height="3.6" rx="1.8" fill="#ff3b3b"/><rect class="m-br2" x="86" y="92.9" width="0" height="1.2" rx=".6" fill="#ffe6e6"/></g>
  </g>
  <rect x="34" y="90.5" width="52" height="6" rx="2" fill="#8d939d"/>
  <rect x="34" y="89.8" width="4" height="7.4" rx="1.2" fill="#3a3d45"/><rect x="82" y="89.8" width="4" height="7.4" rx="1.2" fill="#3a3d45"/>
  <path d="M42 90.5 V96.5 M46 90.5 V96.5 M74 90.5 V96.5 M78 90.5 V96.5" stroke="#5a5f69" stroke-width="1"/>
  <circle cx="53" cy="93.5" r="4.8" fill="#0c0d10"/><circle cx="68" cy="93.5" r="4.8" fill="#0c0d10"/>
</svg>`;

const SPEED = 120;
const LEN = 72; // blade length in svg units
const EDGE = [0.12, 0.3];

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createMaul() {
  const root = document.createElement('div');
  root.className = 'maul';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<div class="yoda-bubble"></div><div class="m-bob">${SVG}</div>`;
  document.body.appendChild(root);
  const bubble = root.querySelector('.yoda-bubble');
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

  const walk = async (from, to) => {
    root.classList.add('walking');
    const anim = root.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: (Math.abs(to - from) / SPEED) * 1000, easing: 'ease-in-out', fill: 'forwards' },
    );
    await anim.finished;
    root.style.transform = `translateX(${to}px)`;
    anim.cancel();
    root.classList.remove('walking');
  };

  const visit = async () => {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const [first, second] = nextPair();
    const w = document.documentElement.clientWidth;
    const mw = root.offsetWidth;
    const reach = (38 / 120) * mw + 6; // how far the blades stick out past the figure
    const start = dir === 1 ? -mw - reach - 12 : w + reach + 12;
    const stop = clamp(dir === 1 ? rand(...EDGE) * w + reach : w - rand(...EDGE) * w - mw - reach, reach + 6, w - mw - reach - 6);

    root.style.transform = `translateX(${start}px)`;
    root.classList.add('on');
    await walk(start, stop);
    await wait(400);

    const say = (line) => {
      bubble.textContent = line;
      bubble.style.maxWidth = `${Math.min(250, w - 12)}px`;
      bubble.classList.add('show');
      const bw = bubble.offsetWidth;
      const centre = stop + mw / 2;
      const left = clamp(centre - bw / 2, 4, w - bw - 4);
      bubble.style.left = `${left - stop}px`;
      bubble.style.setProperty('--tail', `${centre - left}px`);
    };

    root.classList.add('lit');
    say(first);
    await grow('l', 1);
    await wait(1300 + first.length * 45);
    bubble.classList.remove('show');
    await wait(300);
    say(second);
    await grow('r', 1);
    await wait(2000 + second.length * 55);
    bubble.classList.remove('show');
    await grow('r', 0);
    await grow('l', 0);
    root.classList.remove('lit');
    await wait(400);
    await walk(stop, start);
    root.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch (e) {
        console.error('maul visit failed', e);
        root.classList.remove('on', 'walking', 'lit');
        bubble.classList.remove('show');
        setBlade('l', 0); setBlade('r', 0);
      }
    },
  };
}
