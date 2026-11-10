// The little one: waddles in from a random side, spots a logo (Rust, Python or Claude) sitting on the
// ground, crouches and jumps with an open mouth to catch it, like the frog scene.
const LOGOS = [
  {
    svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="none" stroke="#14181c" stroke-width="6" stroke-dasharray="5.6 4.4"/><circle cx="24" cy="24" r="16" fill="#14181c"/><text x="24" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="21" fill="#fff">R</text></svg>`,
  },
  {
    svg: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" fill="#3776ab" d="M14.25 0.18L15.15 0.38L15.88 0.64L16.47 0.94L16.92 1.26L17.26 1.6L17.51 1.94L17.67 2.27L17.77 2.57L17.81 2.83L17.83 3.03L17.82 3.16L17.82 8.5L17.77 9.13L17.64 9.68L17.43 10.14L17.17 10.52L16.87 10.83L16.54 11.08L16.19 11.27L15.84 11.41L15.51 11.51L15.21 11.58L14.95 11.62L14.74 11.64L8.77 11.64L8.08 11.69L7.49 11.83L6.99 12.05L6.58 12.32L6.25 12.64L5.98 12.99L5.78 13.35L5.63 13.72L5.53 14.07L5.46 14.39L5.42 14.66L5.4 14.87L5.4 17.93L3.17 17.93L2.96 17.9L2.68 17.83L2.36 17.71L2.01 17.53L1.65 17.27L1.29 16.91L0.94 16.45L0.62 15.86L0.34 15.13L0.13 14.25L-0.01 13.2L-0.06 11.97L0 10.75L0.16 9.71L0.4 8.84L0.72 8.13L1.08 7.56L1.48 7.12L1.9 6.79L2.32 6.55L2.72 6.39L3.08 6.29L3.4 6.24L3.64 6.23L3.8 6.23L3.86 6.24L12.02 6.24L12.02 5.41L6.18 5.41L6.17 2.66L6.15 2.29L6.2 1.95L6.31 1.64L6.48 1.36L6.73 1.1L7.04 0.87L7.42 0.67L7.86 0.49L8.37 0.34L8.95 0.22L9.59 0.12L10.3 0.06L11.07 0.02L11.91 -0L13.18 0.05ZM7.95 2.16L7.72 2.49L7.64 2.9L7.72 3.31L7.95 3.65L8.28 3.87L8.69 3.96L9.1 3.87L9.43 3.65L9.66 3.31L9.74 2.9L9.66 2.49L9.43 2.16L9.1 1.94L8.69 1.85L8.28 1.94Z"/><path fill-rule="evenodd" fill="#ffd43b" d="M21.04 6.11L21.32 6.17L21.64 6.29L21.99 6.47L22.35 6.74L22.71 7.09L23.06 7.56L23.38 8.15L23.66 8.88L23.87 9.76L24.01 10.8L24.06 12.03L24 13.26L23.84 14.3L23.6 15.16L23.28 15.87L22.92 16.44L22.52 16.89L22.1 17.22L21.68 17.46L21.28 17.62L20.92 17.71L20.6 17.76L20.36 17.78L20.2 17.77L11.98 17.77L11.98 18.59L17.82 18.59L17.83 21.35L17.85 21.71L17.8 22.05L17.69 22.36L17.52 22.65L17.27 22.9L16.96 23.14L16.58 23.34L16.14 23.51L15.63 23.66L15.05 23.79L14.41 23.88L13.7 23.95L12.93 23.99L12.09 24L10.82 23.96L9.75 23.82L8.85 23.62L8.12 23.37L7.53 23.07L7.08 22.74L6.74 22.4L6.49 22.06L6.33 21.73L6.23 21.43L6.19 21.18L6.17 20.98L6.18 20.85L6.18 15.51L6.23 14.87L6.36 14.33L6.57 13.87L6.83 13.49L7.13 13.17L7.46 12.93L7.81 12.73L8.16 12.59L8.49 12.49L8.79 12.43L9.05 12.39L9.26 12.37L9.39 12.36L15.23 12.36L15.92 12.31L16.51 12.17L17.01 11.96L17.42 11.68L17.75 11.36L18.02 11.01L18.22 10.65L18.37 10.29L18.47 9.94L18.54 9.62L18.58 9.34L18.6 9.13L18.6 6.07L20.69 6.07L20.83 6.08ZM14.57 20.36L14.34 20.69L14.26 21.1L14.34 21.51L14.57 21.84L14.9 22.07L15.31 22.15L15.72 22.07L16.05 21.84L16.28 21.51L16.36 21.1L16.28 20.69L16.05 20.36L15.72 20.13L15.31 20.05L14.9 20.13Z"/></svg>`,
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
