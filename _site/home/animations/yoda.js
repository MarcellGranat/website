import { createGrogu } from './grogu.js';
import { createVader } from './vader.js';
import { OBI_SVG, OBI_QUOTES } from './obiwan.js';

// A small flat-style Yoda who wanders across the route map from a random side,
// stops, does a Jedi thing (Force push or lightsaber swing) and says something nerdy.
const NS = 'http://www.w3.org/2000/svg';

export const QUOTES = [
  'You want to try out Herdr!',
  'Neovim is super quick. Vim-vim!',
  'Without data, you are just an opinion!',
  'Nice... Now show me your data!',
  'Do or do not. There is no try.',
  'Commit early, commit often, you must.',
  'Reproducible, your pipeline must be.',
  'Query this file with DuckDB, you should.',
  'Stale, your stage is. dvc repro, you must.',
  'Hidden state in notebooks, the dark side it is.',
  'Fear of the terminal leads to the dark side.',
  'uv sync, run you must.',
  'Strong with the CLI, this one is.',
  'Much to learn, you still have.',
];

const ACTIONS = ['force', 'mind']; // Force push, or the Jedi mind trick (hand wave)
const SPEED = 150;
const FROM_RIGHT = 0.7; // chance that he comes in from the right // px per second while walking
const FIRST_DELAY = [1200, 1800];
const GAP = [7000, 10000];
const EDGE = [0.03, 0.22]; // he stays near the side he came from (share of the viewport width)

const rand = (a, b) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SVG = `
<svg viewBox="0 0 120 150" class="yoda-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(20,24,28,.12)"/>
  <g class="y-feet">
    <ellipse class="y-foot-a" cx="46" cy="141" rx="9" ry="4.5" fill="#86a86b"/>
    <ellipse class="y-foot-b" cx="74" cy="141" rx="9" ry="4.5" fill="#86a86b"/>
  </g>
  <path d="M38 141 Q33 100 46 84 Q60 78 74 84 Q87 100 82 141 Z" fill="#d8b47c"/>
  <path d="M46 84 Q60 96 74 84 L72 102 Q60 109 48 102 Z" fill="#b98e55"/>
  <path d="M39 114 Q60 121 81 114 L82 121 Q60 128 38 121 Z" fill="#5a4630"/>
  <g class="y-arm-l">
    <path d="M42 94 Q31 106 35 120" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="35" cy="123" r="4.5" fill="#9cc07f"/>
  </g>
  <g class="y-head"><g transform="translate(0 16)">
    <path d="M40 55 Q22 42 4 64 Q22 70 40 68 Z" fill="#9cc07f"/>
    <path d="M37 57 Q22 49 11 63 Q24 66 37 65 Z" fill="#d4b08a"/>
    <path d="M80 55 Q98 42 116 64 Q98 70 80 68 Z" fill="#9cc07f"/>
    <path d="M83 57 Q98 49 109 63 Q96 66 83 65 Z" fill="#d4b08a"/>
    <path d="M38 48 Q38 26 60 26 Q82 26 82 48 Q82 62 71 69 Q60 74 49 69 Q38 62 38 48 Z" fill="#9cc07f"/>
    <path d="M46 36 Q60 31 74 36 M48 41 Q60 37 72 41" stroke="#7fa064" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M57 26 Q60 19 63 26" stroke="#c9d6b5" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g class="y-eyes"><circle cx="50" cy="49" r="5.2" fill="#fff"/><circle cx="70" cy="49" r="5.2" fill="#fff"/>
    <circle class="y-pupil" cx="51" cy="50" r="2.7" fill="#14181c"/><circle class="y-pupil" cx="71" cy="50" r="2.7" fill="#14181c"/></g>
    <path d="M43 44 Q50 40 57 45 M77 44 Q70 40 63 45" stroke="#6f9156" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M58 57 L60 59 L62 57" stroke="#7fa064" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M53 63 Q60 67 67 63" stroke="#5d7a48" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  </g></g>
  <g class="y-force">
    <circle cx="109" cy="91" r="8"/><circle cx="109" cy="91" r="8"/><circle cx="109" cy="91" r="8"/>
  </g>
  <g class="y-swirl">
    <path d="M98 80 Q108 74 118 82"/><path d="M100 92 Q112 84 124 94"/><path d="M100 104 Q112 98 122 106"/>
  </g>
  <g class="y-arm">
    <path d="M76 92 Q90 102 88 120" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="y-hand">
      <circle cx="88" cy="123" r="4.8" fill="#9cc07f"/>
      <path d="M85 126 L84 130 M88 127 L88 131 M91 126 L92 130 M93 123 L96 125" stroke="#9cc07f" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

// One Jedi character: walks in from a random side, stops near the edge, says a line and does a
// Force trick. `svg` is the figure, `actions` are CSS classes (force, mind).
export function createJedi({ svg, quotes, actions, fromRight = 0.5, speed = SPEED, cls = '' }) {
  const host = document.documentElement;

  const yoda = document.createElement('div');
  yoda.className = `yoda ${cls}`.trim();
  yoda.setAttribute('aria-hidden', 'true');
  yoda.innerHTML = `<div class="yoda-bubble"></div><div class="yoda-flip">${svg}</div>`;
  document.body.appendChild(yoda);
  const bubble = yoda.querySelector('.yoda-bubble');
  const flip = yoda.querySelector('.yoda-flip');

  let bag = [];
  const nextQuote = () => {
    if (!bag.length) bag = [...quotes].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const walk = async (from, to) => {
    yoda.classList.add('walking');
    const anim = yoda.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: (Math.abs(to - from) / speed) * 1000, easing: 'ease-in-out', fill: 'forwards' },
    );
    await anim.finished;
    yoda.style.transform = `translateX(${to}px)`;
    anim.cancel();
    yoda.classList.remove('walking');
  };

  const visit = async () => {
    const dir = Math.random() < fromRight ? -1 : 1; // 1 = enters from the left
    const action = actions[Math.floor(Math.random() * actions.length)];
    const quote = nextQuote();
    const w = host.clientWidth; // viewport width without the scrollbar
    const yw = yoda.offsetWidth;
    const offLeft = -yw - 12;
    const offRight = w + 12;
    const start = dir === 1 ? offLeft : offRight;
    const gap = rand(...EDGE) * w;
    const stop = Math.min(Math.max(dir === 1 ? gap : w - gap - yw, 6), w - yw - 6);

    flip.style.scale = `${dir} 1`; // `scale` composes with the walking animation, unlike an inline transform
    yoda.style.transform = `translateX(${start}px)`;
    yoda.classList.add('on');
    await walk(start, stop);

    // say it and do the Jedi thing
    bubble.textContent = quote;
    bubble.style.maxWidth = `${Math.min(240, w - 12)}px`;
    bubble.classList.add('show');
    const bw = bubble.offsetWidth;
    const centre = stop + yw / 2;
    const left = Math.min(Math.max(centre - bw / 2, 4), w - bw - 4);
    bubble.style.left = `${left - stop}px`;
    bubble.style.setProperty('--tail', `${centre - left}px`);
    yoda.classList.add(action);
    await wait(2200 + quote.length * 45);

    bubble.classList.remove('show');
    yoda.classList.remove(action);
    await wait(450);
    await walk(stop, start);
    yoda.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch { yoda.classList.remove('on', 'walking', 'force', 'mind'); }
    },
  };
}

// Walks along the bottom of the viewport. With `watch` (a selector) he only shows up while that
// element is on screen, otherwise he roams the whole page.
export function mount({ reduced = false, watch = null } = {}) {
  if (reduced) return;
  const target = watch ? document.querySelector(watch) : null;
  if (watch && !target) return;

  let visible = true;
  if (target) {
    visible = false;
    new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; }, { threshold: 0.25 }).observe(target);
  }

  // Yoda, the little one, Darth Vader and Obi-Wan take turns.
  const cast = [
    createJedi({ svg: SVG, quotes: QUOTES, actions: ACTIONS, fromRight: FROM_RIGHT }),
    createGrogu(),
    createVader(),
    createJedi({ svg: OBI_SVG, quotes: OBI_QUOTES, actions: ['mind'], fromRight: 0.5, cls: 'obi' }),
  ];
  let turn = 0;
  const loop = async (delay) => {
    await wait(delay);
    while (document.hidden || !visible) await wait(1500);
    await cast[turn++ % cast.length].visit();
    loop(rand(...GAP));
  };
  loop(rand(...FIRST_DELAY));
}
