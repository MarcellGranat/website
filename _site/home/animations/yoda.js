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

const ACTIONS = ['force', 'saber'];
const SPEED = 70; // px per second while walking
const FIRST_DELAY = [1200, 1800];
const GAP = [9000, 18000];

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
  <path d="M46 84 Q60 94 74 84 L72 100 Q60 107 48 100 Z" fill="#b98e55"/>
  <path d="M39 112 Q60 119 81 112 L82 119 Q60 126 38 119 Z" fill="#5a4630"/>
  <path d="M42 92 Q31 104 35 118" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
  <circle cx="35" cy="121" r="4.5" fill="#9cc07f"/>
  <g class="y-head">
    <path d="M41 48 Q16 36 2 52 Q14 62 41 60 Z" fill="#9cc07f"/>
    <path d="M38 50 Q20 44 10 52 Q20 57 38 57 Z" fill="#d4b08a"/>
    <path d="M79 48 Q104 36 118 52 Q106 62 79 60 Z" fill="#9cc07f"/>
    <path d="M82 50 Q100 44 110 52 Q100 57 82 57 Z" fill="#d4b08a"/>
    <ellipse cx="60" cy="50" rx="22" ry="21" fill="#9cc07f"/>
    <path d="M46 36 Q60 31 74 36 M48 41 Q60 37 72 41" stroke="#7fa064" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M55 30 Q60 22 65 30" stroke="#d3dcc2" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="51" r="5.5" fill="#fff"/><circle cx="70" cy="51" r="5.5" fill="#fff"/>
    <circle class="y-pupil" cx="51" cy="52" r="2.8" fill="#14181c"/><circle class="y-pupil" cx="71" cy="52" r="2.8" fill="#14181c"/>
    <path d="M43 46 Q50 41 57 47 M77 46 Q70 41 63 47" stroke="#6f9156" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M52 62 Q60 66 68 62 M53 67 Q60 70 67 67" stroke="#5d7a48" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  </g>
  <g class="y-force">
    <circle cx="108" cy="77" r="8"/><circle cx="108" cy="77" r="8"/><circle cx="108" cy="77" r="8"/>
  </g>
  <g class="y-arm">
    <path d="M76 90 Q90 100 88 118" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="y-saber">
      <rect x="86" y="119" width="14" height="4.4" rx="1.5" fill="#8c949b"/>
      <rect class="y-blade" x="100" y="119.2" width="54" height="4" rx="2" fill="#7dffb0"/>
    </g>
    <circle cx="88" cy="121" r="4.6" fill="#9cc07f"/>
    <path d="M85 124 L84 127 M88 125 L88 128 M91 124 L92 127" stroke="#9cc07f" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

export function mount(host, { reduced = false } = {}) {
  if (reduced) return;
  host.classList.add('yoda-host');

  const yoda = document.createElement('div');
  yoda.className = 'yoda';
  yoda.setAttribute('aria-hidden', 'true');
  yoda.innerHTML = `<div class="yoda-bubble"></div><div class="yoda-flip">${SVG}</div>`;
  host.appendChild(yoda);
  const bubble = yoda.querySelector('.yoda-bubble');
  const flip = yoda.querySelector('.yoda-flip');

  let visible = true;
  new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; }).observe(host);

  let bag = [];
  const nextQuote = () => {
    if (!bag.length) bag = [...QUOTES].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const walk = async (from, to) => {
    yoda.classList.add('walking');
    const anim = yoda.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: (Math.abs(to - from) / SPEED) * 1000, easing: 'linear', fill: 'forwards' },
    );
    await anim.finished;
    yoda.style.transform = `translateX(${to}px)`;
    anim.cancel();
    yoda.classList.remove('walking');
  };

  const visit = async () => {
    const dir = Math.random() < 0.5 ? 1 : -1; // 1 = enters from the left
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const quote = nextQuote();
    const w = host.clientWidth;
    const yw = yoda.offsetWidth;
    const offLeft = -yw - 12;
    const offRight = w + 12;
    const start = dir === 1 ? offLeft : offRight;
    const stop = Math.min(Math.max(rand(0.2, 0.7) * w - yw / 2, 6), w - yw - 6);

    flip.style.transform = `scaleX(${dir})`;
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

  const loop = async (delay) => {
    await wait(delay);
    while (document.hidden || !visible) await wait(1500);
    try { await visit(); } catch { yoda.classList.remove('on', 'walking', 'force', 'saber'); }
    loop(rand(...GAP));
  };
  loop(rand(...FIRST_DELAY));
}
