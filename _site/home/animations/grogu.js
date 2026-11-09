// The little one: waddles in from a random side, spots a logo (Rust, Python or Claude) sitting on the
// ground, crouches and jumps with an open mouth to catch it, like the frog scene.
const LOGOS = [
  {
    say: 'Crunchy!',
    svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="none" stroke="#14181c" stroke-width="6" stroke-dasharray="5.6 4.4"/><circle cx="24" cy="24" r="16" fill="#14181c"/><text x="24" y="31" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="21" fill="#fff">R</text></svg>`,
  },
  {
    say: 'Tastes like snake!',
    svg: `<svg viewBox="0 0 48 48"><rect x="4" y="3" width="27" height="25" rx="10" fill="#3776ab"/><rect x="17" y="20" width="27" height="25" rx="10" fill="#ffd43b" stroke="#f6f5f1" stroke-width="2.5"/><circle cx="13" cy="11" r="2.4" fill="#fff"/><circle cx="35" cy="37" r="2.4" fill="#14181c"/></svg>`,
  },
  {
    say: 'Mmm, so helpful!',
    svg: `<svg viewBox="0 0 48 48" fill="none" stroke="#d97757" stroke-width="3.6" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => `<line x1="24" y1="${i % 2 ? 11 : 6}" x2="24" y2="22" transform="rotate(${i * 30} 24 24)"/>`).join('')}</svg>`,
  },
];

const SVG = `
<svg viewBox="0 0 100 120" class="g-svg" aria-hidden="true">
  <ellipse cx="50" cy="116" rx="26" ry="3.5" fill="rgba(20,24,28,.12)"/>
  <ellipse class="g-foot-a" cx="40" cy="112" rx="7.5" ry="4" fill="#a9c58f"/>
  <ellipse class="g-foot-b" cx="60" cy="112" rx="7.5" ry="4" fill="#a9c58f"/>
  <path d="M29 112 Q26 82 40 72 Q50 67 60 72 Q74 82 71 112 Z" fill="#cdb08a"/>
  <path d="M40 72 Q50 82 60 72 L58 84 Q50 89 42 84 Z" fill="#b08f66"/>
  <g class="g-arm-l"><path d="M35 80 Q26 90 30 100" stroke="#cdb08a" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="30" cy="102" r="4" fill="#b7d29c"/></g>
  <g class="g-head">
    <g class="g-ear-l"><path d="M28 47 Q6 34 -8 54 Q8 64 28 60 Z" fill="#b7d29c"/><path d="M25 49 Q8 42 0 54 Q10 60 25 57 Z" fill="#e1bd9f"/></g>
    <g class="g-ear-r"><path d="M72 47 Q94 34 108 54 Q92 64 72 60 Z" fill="#b7d29c"/><path d="M75 49 Q92 42 100 54 Q90 60 75 57 Z" fill="#e1bd9f"/></g>
    <ellipse cx="50" cy="50" rx="24" ry="22" fill="#b7d29c"/>
    <ellipse class="g-cheek" cx="32" cy="60" rx="5" ry="4.5" fill="#a5c58a"/><ellipse class="g-cheek" cx="68" cy="60" rx="5" ry="4.5" fill="#a5c58a"/>
    <path d="M46 29 Q48 23 50 29 M51 29 Q54 24 56 29" stroke="#e6ecd9" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <g class="g-eyes"><circle cx="40" cy="51" r="7" fill="#1c2118"/><circle cx="60" cy="51" r="7" fill="#1c2118"/><circle cx="42.5" cy="48.5" r="2.2" fill="#fff"/><circle cx="62.5" cy="48.5" r="2.2" fill="#fff"/></g>
    <path d="M49 58 L50 59.5 L51 58" stroke="#8db073" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="g-mouth" d="M45 64 Q50 67 55 64" stroke="#5d7a48" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse class="g-mouth-open" cx="50" cy="65" rx="6.5" ry="5" fill="#6b2b2b"/>
  </g>
  <g class="g-arm-r"><path d="M65 80 Q74 90 70 100" stroke="#cdb08a" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="70" cy="102" r="4" fill="#b7d29c"/></g>
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
  root.innerHTML = `<div class="yoda-bubble"></div><span class="g-alert">!</span><div class="g-jump"><div class="g-flip">${SVG}</div></div>`;
  const logoEl = document.createElement('div');
  logoEl.className = 'g-logo';
  logoEl.setAttribute('aria-hidden', 'true');
  document.body.append(root, logoEl);
  const bubble = root.querySelector('.yoda-bubble');
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

  const say = (text, at, gw, w) => {
    bubble.textContent = text;
    bubble.style.maxWidth = `${Math.min(240, w - 12)}px`;
    bubble.classList.add('show');
    const bw = bubble.offsetWidth;
    const centre = at + gw / 2;
    const left = clamp(centre - bw / 2, 4, w - bw - 4);
    bubble.style.left = `${left - at}px`;
    bubble.style.setProperty('--tail', `${centre - left}px`);
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
    say(logo.say, target, gw, w);
    await wait(1700);
    bubble.classList.remove('show');
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
