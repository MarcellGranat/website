// The meditating Yoda: rises from the bottom middle of the screen, sits cross-legged in the air with
// his eyes closed while little stones circle him, says something wise and sinks back down.
// He and the walking Yoda split the old quotes between them.
export const ZEN_QUOTES = [
  'Do or do not. There is no try. Only try/except.',
  'Reproducible, your pipeline must be.',
  'Stale, your stage is. dvc repro, you must.',
  'Hidden state in notebooks, the dark side it is.',
  'Fear of the terminal leads to the dark side.',
  'Strong with the CLI, this one is.',
  'Much to learn, you still have.',
  'Let the data flow through you, you must. But clean it first.',
  'Clear your mind, you must. Clear your cache, too.',
];

const SVG = `
<svg viewBox="0 0 140 130" class="zen-svg" aria-hidden="true">
  <circle class="zen-aura" cx="70" cy="66" r="54" fill="none" stroke="#0f8f86" stroke-width="2"/>
  <circle class="zen-aura zen-aura-2" cx="70" cy="66" r="44" fill="rgba(15,143,134,.06)" stroke="#0f8f86" stroke-width="1.5"/>
  <g class="zen-body">
    <ellipse cx="70" cy="124" rx="40" ry="4" fill="rgba(20,24,28,.12)" class="zen-shadow"/>
    <path d="M18 112 Q20 92 48 90 L92 90 Q120 92 122 112 Q96 126 70 124 Q44 126 18 112 Z" fill="#d8b47c"/>
    <path d="M38 104 Q70 116 102 104" stroke="#b98e55" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="44" cy="113" rx="10" ry="4.6" fill="#86a86b"/><ellipse cx="96" cy="113" rx="10" ry="4.6" fill="#86a86b"/>
    <path d="M61 42 L79 42 L80 58 L60 58 Z" fill="#86a86b"/>
    <path d="M46 92 Q44 62 54 52 Q70 46 86 52 Q96 62 94 92 Z" fill="#d8b47c"/>
    <path d="M56 54 Q70 66 84 54 L82 76 Q70 82 58 76 Z" fill="#b98e55"/>
    <path d="M48 82 Q70 90 92 82 L93 88 Q70 96 47 88 Z" fill="#5a4630"/>
    <path d="M50 62 Q34 80 40 99" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M90 62 Q106 80 100 99" stroke="#d8b47c" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="41" cy="102" r="4.6" fill="#9cc07f"/><circle cx="99" cy="102" r="4.6" fill="#9cc07f"/>
    <path d="M38 105 L36 108 M42 106 L42 109 M46 105 L47 108 M94 105 L93 108 M98 106 L98 109 M102 105 L104 108" stroke="#9cc07f" stroke-width="2" stroke-linecap="round"/>
    <g class="zen-head"><g transform="translate(10 -21)">
      <path d="M40 55 Q22 42 4 64 Q22 70 40 68 Z" fill="#9cc07f"/>
      <path d="M37 57 Q22 49 11 63 Q24 66 37 65 Z" fill="#d4b08a"/>
      <path d="M80 55 Q98 42 116 64 Q98 70 80 68 Z" fill="#9cc07f"/>
      <path d="M83 57 Q98 49 109 63 Q96 66 83 65 Z" fill="#d4b08a"/>
      <path d="M38 48 Q38 26 60 26 Q82 26 82 48 Q82 62 71 69 Q60 74 49 69 Q38 62 38 48 Z" fill="#9cc07f"/>
      <path d="M46 36 Q60 31 74 36 M48 41 Q60 37 72 41" stroke="#7fa064" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M57 26 Q60 19 63 26" stroke="#c9d6b5" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M44 51 Q50 55.5 56 51 M64 51 Q70 55.5 76 51" stroke="#3f5a30" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M43 44 Q50 40 57 45 M77 44 Q70 40 63 45" stroke="#6f9156" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M58 57 L60 59 L62 57" stroke="#7fa064" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M54 63 Q60 66 66 63" stroke="#5d7a48" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    </g></g>
  </g>
  <g class="zen-orbit">
    <circle cx="70" cy="4" r="4.5" fill="#8c939a"/><circle cx="127" cy="80" r="3.2" fill="#a5abb1"/><circle cx="26" cy="92" r="3.8" fill="#8c939a"/>
  </g>
</svg>`;

const RISE = 1900; // ms to float up
const SINK = 1500;
const LIFT = 56; // px he hovers above the bottom edge

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createZen() {
  const root = document.createElement('div');
  root.className = 'zen';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<div class="yoda-bubble"></div>${SVG}`;
  document.body.appendChild(root);
  const bubble = root.querySelector('.yoda-bubble');

  let bag = [];
  const nextQuote = () => {
    if (!bag.length) bag = [...ZEN_QUOTES].sort(() => Math.random() - 0.5);
    return bag.pop();
  };
  const move = async (from, to, duration, easing) => {
    const anim = root.animate([{ transform: `translateY(${from})` }, { transform: `translateY(${to})` }], { duration, easing, fill: 'forwards' });
    await anim.finished;
    root.style.transform = `translateY(${to})`;
    anim.cancel();
  };

  const visit = async () => {
    const quote = nextQuote();
    const w = document.documentElement.clientWidth;
    root.style.transform = 'translateY(115%)';
    root.classList.add('on');
    await move('115%', `-${LIFT}px`, RISE, 'cubic-bezier(.2, .8, .3, 1)');

    bubble.textContent = quote;
    bubble.style.maxWidth = `${Math.min(260, w - 12)}px`;
    bubble.classList.add('show');
    const bw = bubble.offsetWidth, rw = root.offsetWidth;
    bubble.style.left = `${(rw - bw) / 2}px`;
    bubble.style.setProperty('--tail', `${bw / 2}px`);
    root.classList.add('glow');
    await wait(2800 + quote.length * 50);

    bubble.classList.remove('show');
    root.classList.remove('glow');
    await wait(400);
    await move(`-${LIFT}px`, '115%', SINK, 'ease-in');
    root.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch (e) { console.error('zen visit failed', e); root.classList.remove('on', 'glow'); }
    },
  };
}
