// Darth Vader marches in from a random side wearing a paper label, stops, and switches on his red lightsaber
// with glowing red eyes. The label is different every visit.
export const LABELS = [
  'final_final_v13.xlsx',
  'data_clean_REAL_final.csv',
  'works_on_my_machine',
  'TODO_fix_later',
  'model_v2_new_FINAL(2).pkl',
  'git push --force',
  'no_tests.py',
  'main is your father',
  'dataset_v9_dont_touch',
  'SELECT * FROM everything',
  'merge_conflict_unresolved',
  'p < 0.05 (somehow)',
  'Untitled17.ipynb',
  "it's not a bug, it's a feature",
  'df_final_USE_THIS_ONE',
  'I find your lack of tests disturbing',
  'results_new_new_OLD.csv',
  'requirements.txt (lost)',
  'cron job: nobody knows',
];

const SVG = `
<svg viewBox="0 0 120 150" class="v-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="32" ry="4" fill="rgba(20,24,28,.14)"/>
  <ellipse class="v-foot-a" cx="46" cy="141" rx="10" ry="5" fill="#0e0f12"/>
  <ellipse class="v-foot-b" cx="74" cy="141" rx="10" ry="5" fill="#0e0f12"/>
  <path d="M27 143 Q16 100 38 82 L82 82 Q104 100 93 143 Z" fill="#0b0c0f"/>
  <path d="M36 141 Q31 102 44 88 Q60 82 76 88 Q89 102 84 141 Z" fill="#1a1c21"/>
  <rect x="49" y="91" width="22" height="15" rx="2.5" fill="#2a2d34"/>
  <g class="v-lights"><circle cx="54" cy="96" r="1.7" fill="#e03a3a"/><circle cx="60" cy="96" r="1.7" fill="#3aa66a"/><circle cx="66" cy="96" r="1.7" fill="#3a78d8"/><circle cx="54" cy="101" r="1.7" fill="#3a78d8"/><circle cx="60" cy="101" r="1.7" fill="#e03a3a"/><circle cx="66" cy="101" r="1.7" fill="#3aa66a"/></g>
  <rect x="38" y="113" width="44" height="7" rx="2" fill="#2d3037"/><rect x="55" y="112" width="10" height="9" rx="2" fill="#4a4e57"/>
  <g class="v-arm-l">
    <path d="M42 94 Q31 106 35 120" stroke="#1a1c21" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="35" cy="123" r="4.8" fill="#0e0f12"/>
  </g>
  <g class="v-head">
    <path d="M32 76 L88 76 L82 88 L38 88 Z" fill="#101114"/>
    <path d="M34 54 Q34 24 60 24 Q86 24 86 54 L86 66 Q86 74 78 77 L42 77 Q34 74 34 66 Z" fill="#1d1f25"/>
    <path d="M41 39 Q47 30 60 29" stroke="#4b505c" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M39 50 Q60 43 81 50 L79 54 Q60 49 41 54 Z" fill="#0f1013"/>
    <path class="v-eye" d="M43 57 Q51 52 58 59 Q50 63 43 57 Z" fill="#050506"/>
    <path class="v-eye" d="M77 57 Q69 52 62 59 Q70 63 77 57 Z" fill="#050506"/>
    <path d="M58 63 L62 63 L60 69 Z" fill="#0f1013"/>
    <rect x="50" y="70" width="20" height="6" rx="1.5" fill="#0f1013"/>
    <path d="M54 70 V76 M58 70 V76 M62 70 V76 M66 70 V76" stroke="#3a3d45" stroke-width="1"/>
    <path d="M37 62 Q39 72 46 77 M83 62 Q81 72 74 77" stroke="#0f1013" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
    <g class="v-arm">
    <path d="M76 92 Q90 102 88 120" stroke="#1a1c21" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="v-saber">
      <g class="v-blade"><rect x="86.2" y="131" width="3.6" height="62" rx="1.8" fill="#ff3b3b"/><rect x="87.4" y="131" width="1.2" height="62" rx=".6" fill="#ffe6e6"/></g>
      <rect x="85.5" y="109" width="5" height="23" rx="1.2" fill="#9aa0aa"/><path d="M85.5 111.5 H90.5 M85.5 114.5 H90.5 M85.5 117.5 H90.5 M85.5 128 H90.5" stroke="#5a5f69" stroke-width=".8"/><rect x="84.6" y="108" width="6.8" height="2.4" rx="1" fill="#4a4e57"/><rect x="84.8" y="130.5" width="6.4" height="2" rx=".8" fill="#4a4e57"/>
    </g>
    <circle cx="88" cy="123" r="5.2" fill="#0e0f12"/><path d="M85 121 H91 M85 124 H91" stroke="#3a3d45" stroke-width="1" stroke-linecap="round"/>
  </g>
</svg>`;

const SPEED = 90; // a slow, heavy march (px per second)
const EDGE = [0.03, 0.22];

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createVader() {
  const root = document.createElement('div');
  root.className = 'vader';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<div class="v-bob"><div class="v-flip">${SVG}</div><div class="v-label"></div></div>`;
  document.body.appendChild(root);
  const flip = root.querySelector('.v-flip');
  const label = root.querySelector('.v-label');

  let bag = [];
  const nextLabel = () => {
    if (!bag.length) bag = [...LABELS].sort(() => Math.random() - 0.5);
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
    const dir = Math.random() < 0.5 ? 1 : -1; // 1 = enters from the left
    label.textContent = nextLabel();
    const w = document.documentElement.clientWidth;
    const gw = root.offsetWidth;
    const extra = Math.max(0, (label.offsetWidth - gw) / 2); // the label may be wider than he is
    const start = dir === 1 ? -gw - extra - 12 : w + extra + 12;
    const gap = rand(...EDGE) * w;
    const stop = clamp(dir === 1 ? gap : w - gap - gw, 6 + extra, Math.max(6 + extra, w - gw - 6 - extra));

    flip.style.scale = `${dir} 1`;
    root.style.transform = `translateX(${start}px)`;
    root.classList.add('on');
    await walk(start, stop);

    root.classList.add('saber'); // raises his hand with the hilt
    label.classList.add('pop');
    await wait(700);
    root.classList.add('lit'); // switches the blade on
    await wait(2200);
    root.classList.remove('lit'); // and off again
    await wait(450);
    root.classList.remove('saber');
    await wait(500);
    label.classList.remove('pop');
    await walk(stop, start);
    root.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch {
        root.classList.remove('on', 'walking', 'saber', 'lit');
        label.classList.remove('pop');
      }
    },
  };
}
