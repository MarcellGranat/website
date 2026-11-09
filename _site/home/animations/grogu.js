// The little one: waddles in from a random side, spots a logo (Rust, Python or Claude) sitting on the
// ground, crouches and jumps with an open mouth to catch it, like the frog scene.
const LOGOS = [
  {
    svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="none" stroke="#14181c" stroke-width="6" stroke-dasharray="5.6 4.4"/><circle cx="24" cy="24" r="16" fill="#14181c"/><text x="24" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="21" fill="#fff">R</text></svg>`,
  },
  {
    svg: `<svg viewBox="0 0 48 48"><rect x="4" y="3" width="27" height="25" rx="10" fill="#3776ab"/><rect x="17" y="20" width="27" height="25" rx="10" fill="#ffd43b" stroke="#f6f5f1" stroke-width="2.5"/><circle cx="13" cy="11" r="2.4" fill="#fff"/><circle cx="35" cy="37" r="2.4" fill="#14181c"/></svg>`,
  },
  {
    svg: `<svg viewBox="0 0 48 48" fill="none" stroke="#d97757" stroke-width="3.6" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => `<line x1="24" y1="${i % 2 ? 11 : 6}" x2="24" y2="22" transform="rotate(${i * 30} 24 24)"/>`).join('')}</svg>`,
  },
];

const SVG = `
<svg viewBox="0 0 100 120" class="g-svg" aria-hidden="true">
  <ellipse cx="50" cy="116" rx="26" ry="3.5" fill="rgba(20,24,28,.12)"/>
  <ellipse class="g-foot-a" cx="40" cy="112" rx="7.5" ry="4" fill="#aebf8d"/>
  <ellipse class="g-foot-b" cx="60" cy="112" rx="7.5" ry="4" fill="#aebf8d"/>
  <path d="M27 113 Q22 84 37 74 Q50 69 63 74 Q78 84 73 113 Z" fill="#cdb592"/>
  <path d="M44 92 Q42 102 44 111 M56 92 Q58 102 56 111 M35 88 Q33 98 35 108 M65 88 Q67 98 65 108" stroke="#b79c78" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M28 99 Q50 106 72 99" stroke="#8c7452" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M35 74 Q50 88 65 74 L63 83 Q50 94 37 83 Z" fill="#a98d68"/>
  <g class="g-arm-l">
    <path d="M36 80 Q23 90 28 101" stroke="#cdb592" stroke-width="10" stroke-linecap="round" fill="none"/>
    <circle cx="28" cy="104" r="4.2" fill="#aebf8d"/><path d="M25 107 L24 110 M28 108 L28 111 M31 107 L32 110" stroke="#aebf8d" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="g-head">
    <g class="g-ear-l">
      <path d="M31 45 Q8 36 -19 56 Q10 69 31 61 Z" fill="#aebf8d"/>
      <path d="M28 48 Q10 43 -9 56 Q10 64 28 58 Z" fill="#d9b79a"/>
      <path d="M26 53 Q10 52 -2 56 M26 56 Q12 58 2 59" stroke="#c49c80" stroke-width="1" fill="none" stroke-linecap="round"/>
    </g>
    <g class="g-ear-r">
      <path d="M69 45 Q92 36 119 56 Q90 69 69 61 Z" fill="#aebf8d"/>
      <path d="M72 48 Q90 43 109 56 Q90 64 72 58 Z" fill="#d9b79a"/>
      <path d="M74 53 Q90 52 102 56 M74 56 Q88 58 98 59" stroke="#c49c80" stroke-width="1" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M25 50 Q25 26 50 26 Q75 26 75 50 Q75 68 62 73 Q50 77 38 73 Q25 68 25 50 Z" fill="#aebf8d"/>
    <ellipse class="g-cheek" cx="31" cy="63" rx="5" ry="4.5" fill="#9db37e"/><ellipse class="g-cheek" cx="69" cy="63" rx="5" ry="4.5" fill="#9db37e"/>
    <path d="M44 25 Q42 19 45 15 M49 25 Q49 17 52 13 M54 25 Q57 19 61 18" stroke="#d3dbbb" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M40 33 Q50 30 60 33 M42 37 Q50 35 58 37" stroke="#93a875" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M30 44 Q39 39 46 44 M54 44 Q61 39 70 44" stroke="#93a875" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g class="g-eyes">
      <circle cx="39" cy="53" r="8.6" fill="#231c16"/><circle cx="61" cy="53" r="8.6" fill="#231c16"/>
      <circle cx="42" cy="49.5" r="3.2" fill="#fff"/><circle cx="64" cy="49.5" r="3.2" fill="#fff"/>
      <circle cx="36" cy="57" r="1.3" fill="#fff" opacity=".8"/><circle cx="58" cy="57" r="1.3" fill="#fff" opacity=".8"/>
    </g>
    <circle cx="49" cy="62" r=".8" fill="#7f9663"/><circle cx="51" cy="62" r=".8" fill="#7f9663"/>
    <path class="g-mouth" d="M45.5 67 Q50 69.5 54.5 67" stroke="#667f4f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <g class="g-mouth-open"><ellipse cx="50" cy="68" rx="6.5" ry="5" fill="#5a2a26"/><ellipse cx="50" cy="70.5" rx="3.6" ry="2" fill="#c76b6b"/></g>
  </g>
  <g class="g-arm-r">
    <path d="M64 80 Q77 90 72 101" stroke="#cdb592" stroke-width="10" stroke-linecap="round" fill="none"/>
    <circle cx="72" cy="104" r="4.2" fill="#aebf8d"/><path d="M69 107 L68 110 M72 108 L72 111 M75 107 L76 110" stroke="#aebf8d" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const SPEED = 110; // px per second while waddling
const EDGE = [0.03, 0.2]; // where he stops, as a share of the viewport width from the entry side
const DIST = [0.14, 0.3]; // distance to the logo, as a share of the viewport width
const MIN_DIST = 150;
const MAX_DIST = 340;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createGrogu() {
  const root = document.createElement('div');
  root.className = 'grogu';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<span class="g-alert">!</span><div class="g-jump"><div class="g-flip">${SVG}</div></div>`;
  const logoEl = document.createElement('div');
  logoEl.className = 'g-logo';
  logoEl.setAttribute('aria-hidden', 'true');
  document.body.append(root, logoEl);
  const jump = root.querySelector('.g-jump');
  const flip = root.querySelector('.g-flip');

  let bag = [];
  const nextLogo = () => {
    if (!bag.length) bag = [...LOGOS].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const move = async (from, to, { duration, easing }) => {
    const anim = root.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration, easing, fill: 'forwards' },
    );
    await anim.finished;
    root.style.transform = `translateX(${to}px)`;
    anim.cancel();
  };
  const walk = async (from, to) => {
    root.classList.add('walking');
    await move(from, to, { duration: (Math.abs(to - from) / SPEED) * 1000, easing: 'ease-in-out' });
    root.classList.remove('walking');
  };

  const visit = async () => {
    const dir = Math.random() < 0.5 ? 1 : -1; // 1 = enters from the left, and the logo is ahead of him
    const logo = nextLogo();
    const w = document.documentElement.clientWidth;
    const gw = root.offsetWidth;
    const start = dir === 1 ? -gw - 12 : w + 12;
    const gap = rand(...EDGE) * w;
    const stop = clamp(dir === 1 ? gap : w - gap - gw, 6, w - gw - 6);
    const logoC = clamp(stop + gw / 2 + dir * clamp(rand(...DIST) * w, MIN_DIST, MAX_DIST), 40, w - 40);
    const target = logoC - gw / 2;

    flip.style.scale = `${dir} 1`;
    root.style.transform = `translateX(${start}px)`;
    root.classList.add('on');
    await walk(start, stop);

    // a logo shows up on the ground, hopping around like a frog
    logoEl.style.left = `${logoC - 22}px`;
    logoEl.innerHTML = logo.svg;
    await wait(250);
    logoEl.classList.add('show', 'hop');
    await wait(400);
    root.classList.add('alert');
    await wait(1000);
    root.classList.remove('alert');

    // crouch, then jump with the mouth open
    const squash = 'translateY(0) scale(1.14, .78)';
    await jump.animate([{ transform: 'none' }, { transform: squash }], { duration: 340, easing: 'ease-out', fill: 'forwards' }).finished;
    await wait(80);
    root.classList.add('jumping');
    const dur = 760;
    const height = clamp(Math.abs(target - stop) * 0.4, 50, 130);
    const jumpAnim = jump.animate([
      { transform: squash, easing: 'ease-out' },
      { offset: 0.1, transform: 'translateY(0) scale(.9, 1.16)', easing: 'ease-out' },
      { offset: 0.5, transform: `translateY(${-height}px) scale(.96, 1.06)`, easing: 'ease-in' },
      { transform: 'translateY(0) scale(1.16, .84)' },
    ], { duration: dur, fill: 'forwards' });
    const caught = wait(dur * 0.9).then(() => { logoEl.classList.remove('hop'); logoEl.classList.add('gone'); });
    await Promise.all([move(stop, target, { duration: dur, easing: 'linear' }), jumpAnim.finished, caught]);

    // got it: puffed cheeks, chewing, a comment
    root.classList.remove('jumping');
    root.classList.add('chew');
    await jump.animate([{ transform: 'translateY(0) scale(1.16, .84)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out', fill: 'forwards' }).finished;
    jump.getAnimations().forEach((a) => a.cancel());
    await wait(1700); // chews in silence
    root.classList.remove('chew');
    await wait(350);
    await walk(target, start);
    root.classList.remove('on');
    logoEl.className = 'g-logo';
    logoEl.innerHTML = '';
  };

  return {
    async visit() {
      try { await visit(); } catch {
        root.classList.remove('on', 'walking', 'alert', 'jumping', 'chew');
        logoEl.className = 'g-logo';
        jump.getAnimations().forEach((a) => a.cancel());
      }
    },
  };
}
