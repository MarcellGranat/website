// Padmé and R2-D2 run in from opposite sides and meet in the middle. R2 beeps, Padmé bends down to him
// and records the message, like the one that was sent to a certain Jedi master.
const TOOLS = [
  'Bayes’ Theorem',
  'Central Limit Theorem',
  'Random Forest',
  'Kalman Filter',
  'Law of Large Numbers',
];

const PADME_SVG = `
<svg viewBox="0 0 120 150" class="p-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(20,24,28,.13)"/>
  <ellipse class="p-foot-a" cx="48" cy="144" rx="7" ry="3.5" fill="#4a3322"/>
  <ellipse class="p-foot-b" cx="72" cy="144" rx="7" ry="3.5" fill="#4a3322"/>
  <g class="p-skirt">
    <path d="M35 144 Q38 114 43 104 L77 104 Q82 114 85 144 Z" fill="#fbf9f4"/>
    <path d="M50 110 Q46 126 44 143 M60 110 L60 144 M70 110 Q74 126 76 143" stroke="#e2ddd2" stroke-width="1.4" fill="none"/>
  </g>
  <g class="p-upper">
    <g class="p-arm-l">
      <path d="M49 86 Q39 97 43 109" stroke="#fbf9f4" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M39.5 108 Q43 113 47.5 108" stroke="#e2ddd2" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="43" cy="114" r="3.6" fill="#efc9a3"/>
    </g>
    <path d="M47 80 Q60 75 73 80 Q79 92 81 114 L39 114 Q41 92 47 80 Z" fill="#fbf9f4"/>
    <rect x="56" y="70" width="8" height="12" fill="#efc9a3"/>
    <path d="M42 80 Q60 69 78 80 Q83 88 78 92 Q60 84 42 92 Q37 88 42 80 Z" fill="#fbf9f4" stroke="#d9d3c6" stroke-width="1.2"/>
    <path d="M52 80 Q60 88 68 80" stroke="#d9d3c6" stroke-width="1.2" fill="none"/>
    <path d="M56 84 V98 M64 84 V98" stroke="#cfc8bb" stroke-width="1.5" stroke-linecap="round"/><circle cx="56" cy="99" r="1.4" fill="#cfc8bb"/><circle cx="64" cy="99" r="1.4" fill="#cfc8bb"/>
    <path d="M49 99 L71 99 L73 109 L47 109 Z" fill="#f1ede4" stroke="#dcd6c9" stroke-width="1"/>
    <g class="p-head">
      <ellipse cx="60" cy="54" rx="15" ry="16" fill="#3b2418"/>
      <circle cx="43" cy="54" r="7" fill="#3b2418"/><circle cx="77" cy="54" r="7" fill="#3b2418"/>
      <path d="M40 54 Q43 49 46 54 M74 54 Q77 49 80 54" stroke="#2a1a10" stroke-width="1.2" fill="none"/>
      <ellipse cx="60" cy="58" rx="11" ry="13" fill="#efc9a3"/>
      <path d="M48 55 Q50 42 60 42 Q70 42 72 55 Q66 48 60 48 Q54 48 48 55 Z" fill="#3b2418"/>
      <ellipse cx="55" cy="58" rx="2.9" ry="3.2" fill="#fff" stroke="#3b2418" stroke-width=".8"/><ellipse cx="65" cy="58" rx="2.9" ry="3.2" fill="#fff" stroke="#3b2418" stroke-width=".8"/>
      <circle cx="55" cy="59" r="1.2" fill="#2a1a12"/><circle cx="65" cy="59" r="1.2" fill="#2a1a12"/>
      <path d="M51 53.5 L58 51.8 M69 53.5 L62 51.8" stroke="#3b2418" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="66.5" rx="1.8" ry="1.9" fill="#7a2f3a"/>
      <path d="M73 49 Q76 54 73.4 56.5 Q70.6 54 73 49 Z" fill="#8ecbff" stroke="#5aa6e0" stroke-width=".6"/>
    </g>
    <g class="p-arm">
      <path d="M71 86 Q81 97 80 109" stroke="#fbf9f4" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M76.5 108 Q80 113 84.5 108" stroke="#e2ddd2" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="114" r="3.8" fill="#efc9a3"/>
    </g>
  </g>
</svg>`;

const R2_SVG = `
<svg viewBox="0 0 90 110" class="r2-svg" aria-hidden="true">
  <ellipse cx="45" cy="107" rx="30" ry="3.5" fill="rgba(20,24,28,.13)"/>
  <rect x="10" y="52" width="14" height="50" rx="5" fill="#e9edf2" stroke="#b8c0cb"/><rect x="10" y="70" width="14" height="8" fill="#2f6db5"/>
  <rect x="66" y="52" width="14" height="50" rx="5" fill="#e9edf2" stroke="#b8c0cb"/><rect x="66" y="70" width="14" height="8" fill="#2f6db5"/>
  <ellipse cx="17" cy="102" rx="11" ry="5" fill="#cfd6df"/><ellipse cx="73" cy="102" rx="11" ry="5" fill="#cfd6df"/>
  <rect x="38" y="94" width="14" height="8" rx="3" fill="#cfd6df"/>
  <rect x="20" y="42" width="50" height="52" rx="6" fill="#f3f6f9" stroke="#b8c0cb"/>
  <rect x="26" y="50" width="14" height="10" fill="#2f6db5"/><rect x="26" y="64" width="38" height="6" fill="#2f6db5"/>
  <circle cx="57" cy="55" r="5" fill="#cfd6df"/><circle cx="57" cy="55" r="2" fill="#e03a3a"/>
  <rect x="28" y="76" width="34" height="12" rx="2" fill="#dfe5ec"/><path d="M33 80 H57 M33 84 H57" stroke="#9aa4b1" stroke-width="1.2"/>
  <defs><linearGradient id="r2beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#2f9bff" stop-opacity=".9"/><stop offset="1" stop-color="#2f9bff" stop-opacity=".3"/></linearGradient></defs>
  <g class="r2-scan"><path d="M38 28 L-62 -8 L-62 76 Z" fill="url(#r2beam)"/><rect class="r2-sweep" x="-62" y="-8" width="3" height="40" rx="1.5" fill="#9fd4ff"/></g>
  <g class="r2-dome">
    <path d="M20 42 A25 25 0 0 1 70 42 Z" fill="#f3f6f9" stroke="#b8c0cb"/>
    <path d="M54 18 A25 25 0 0 1 70 42 L52 42 Z" fill="#2f6db5"/>
    <rect x="20" y="38" width="50" height="4" fill="#2f6db5"/>
    <path d="M60 17 L62 8" stroke="#4a4e57" stroke-width="1.6" stroke-linecap="round"/>
    <g class="r2-eye"><circle cx="40" cy="28" r="6.2" fill="#1b1d22" stroke="#cfd6df" stroke-width="2"/><circle class="r2-pupil" cx="40" cy="28" r="2.5" fill="#e03a3a"/></g>
    <circle class="r2-psi" cx="53" cy="29" r="2" fill="#e03a3a"/>
  </g>
</svg>`;

const PADME_STOP = 0.72; // her front edge, as a share of her width (when she faces right)
const R2_BODY = [0.13, 0.87]; // R2's body edges

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createPadme() {
  const padme = document.createElement('div');
  padme.className = 'padme';
  padme.setAttribute('aria-hidden', 'true');
  padme.innerHTML = `<div class="yoda-bubble"></div><div class="p-bob"><div class="p-flip">${PADME_SVG}</div></div>`;
  const r2 = document.createElement('div');
  r2.className = 'r2';
  r2.setAttribute('aria-hidden', 'true');
  r2.innerHTML = `<div class="r2-bob"><div class="r2-flip">${R2_SVG}</div></div>`;
  document.body.append(padme, r2);
  const bubble = padme.querySelector('.yoda-bubble');
  const pFlip = padme.querySelector('.p-flip');
  const rFlip = r2.querySelector('.r2-flip');

  let bag = [];
  const nextTool = () => {
    if (!bag.length) bag = [...TOOLS].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const run = async (el, from, to, speed) => {
    el.classList.add('walking');
    const anim = el.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: (Math.abs(to - from) / speed) * 1000, easing: 'ease-in-out', fill: 'forwards' },
    );
    await anim.finished;
    el.style.transform = `translateX(${to}px)`;
    anim.cancel();
    el.classList.remove('walking');
  };

  const visit = async () => {
    const dir = Math.random() < 0.5 ? 1 : -1; // 1 = Padmé comes from the left, R2 from the right
    const tool = nextTool();
    const w = document.documentElement.clientWidth;
    const mid = w / 2;
    const pw = padme.offsetWidth;
    const rw = r2.offsetWidth;
    const startP = dir === 1 ? -pw - 12 : w + 12;
    const startR = dir === 1 ? w + 12 : -rw - 12;
    const stopP = dir === 1 ? mid - 14 - PADME_STOP * pw : mid + 14 - (1 - PADME_STOP) * pw;
    const stopR = dir === 1 ? mid + 18 - R2_BODY[0] * rw : mid - 18 - R2_BODY[1] * rw;

    pFlip.style.scale = `${dir} 1`;
    rFlip.style.scale = `${dir} 1`;
    padme.style.transform = `translateX(${startP}px)`;
    r2.style.transform = `translateX(${startR}px)`;
    padme.classList.add('on');
    r2.classList.add('on');
    await Promise.all([run(padme, startP, stopP, 300), run(r2, startR, stopR, 200)]);

    // they meet: R2 beeps and looks up, Padmé bends down to him and starts recording
    r2.classList.add('beep');
    await wait(500);
    padme.classList.add('bend');
    await wait(750);
    padme.classList.add('rec');
    r2.classList.add('scan');

    bubble.style.maxWidth = `${Math.min(260, w - 12)}px`;
    for (const line of [`Help me, ${tool}. You’re my only hope.`]) {
      bubble.textContent = line;
      bubble.classList.add('show');
      const bw = bubble.offsetWidth;
      const left = Math.min(Math.max(mid - bw / 2, 4), w - bw - 4);
      bubble.style.left = `${left - stopP}px`;
      bubble.style.setProperty('--tail', `${mid - left}px`);
      await wait(1900 + line.length * 45);
      bubble.classList.remove('show');
      await wait(350);
    }

    padme.classList.remove('rec');
    r2.classList.remove('scan');
    await wait(250);
    padme.classList.remove('bend');
    r2.classList.remove('beep');
    await wait(600);
    await Promise.all([run(padme, stopP, startP, 300), run(r2, stopR, startR, 200)]);
    padme.classList.remove('on');
    r2.classList.remove('on');
  };

  return {
    async visit() {
      try { await visit(); } catch (e) {
        console.error('padme visit failed', e);
        padme.classList.remove('on', 'walking', 'bend', 'rec');
        r2.classList.remove('on', 'walking', 'beep', 'scan');
        bubble.classList.remove('show');
      }
    },
  };
}
