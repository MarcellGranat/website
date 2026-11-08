// A steam locomotive hauling wagons loaded with the tools of the stack.
// Everything is a pure function of time t (seconds), so a frame can be frozen with data-time.
const TOOLS = [
  ['Python', '#0f8f86'], ['DuckDB', '#d98a00'], ['Rust', '#b4492b'], ['R', '#2f6fb0'],
  ['uv', '#6d4fc2'], ['Quarto', '#2a8a5b'], ['git', '#14181c'], ['Claude Code', '#c46a2d'],
  ['pytest', '#0f8f86'], ['Parquet', '#2f6fb0'],
];
const H = 230, G = 186, SPEED = 95, WAGON = 124, PUFF_EVERY = 0.2, PUFF_LIFE = 3.2;
const INK = '#14181c', MONO = "'JetBrains Mono', ui-monospace, monospace";

function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
const hill = (c, W, dist, amp, base, seed, color, par) => {
  c.fillStyle = color; c.beginPath(); c.moveTo(0, G);
  for (let x = 0; x <= W; x += 8) c.lineTo(x, base - amp * (0.55 * Math.sin((x + dist * par) / 140 + seed) + 0.45 * Math.sin((x + dist * par) / 63 + seed * 2.1)));
  c.lineTo(W, G); c.closePath(); c.fill();
};

function wheel(c, x, y, r, ang, color = INK) {
  c.fillStyle = color; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.fillStyle = '#f6f5f1'; c.beginPath(); c.arc(x, y, r * 0.62, 0, 7); c.fill();
  c.strokeStyle = color; c.lineWidth = 2;
  for (let k = 0; k < 4; k++) { const a = ang + k * Math.PI / 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62); c.stroke(); }
  c.fillStyle = color; c.beginPath(); c.arc(x, y, r * 0.18, 0, 7); c.fill();
}

function loco(c, L, t, dist) {
  const R = 19, wy = G - R;
  const bob = Math.sin(t * 9) * 0.6;
  c.save(); c.translate(0, bob);
  // boiler + cab
  c.fillStyle = '#1f2a30'; rr(c, L + 52, G - 78, 96, 46, [6, 20, 20, 6]); c.fill();
  c.fillStyle = '#0f8f86'; c.fillRect(L + 52, G - 62, 96, 7);
  c.fillStyle = '#1f2a30'; rr(c, L + 6, G - 100, 54, 68, 5); c.fill();
  c.fillStyle = '#d98a00'; rr(c, L - 2, G - 106, 70, 8, 3); c.fill();          // cab roof
  c.fillStyle = '#f6efdc'; rr(c, L + 16, G - 90, 24, 22, 3); c.fill();          // window
  c.fillStyle = '#14181c'; c.font = `700 9px ${MONO}`; c.textAlign = 'center'; c.fillText('DS', L + 28, G - 49);
  // chimney, dome, headlamp
  c.fillStyle = '#14181c'; rr(c, L + 118, G - 108, 14, 34, 2); c.fill(); rr(c, L + 113, G - 114, 24, 8, 3); c.fill();
  c.fillStyle = '#d98a00'; c.beginPath(); c.arc(L + 86, G - 78, 12, Math.PI, 0); c.fill();
  c.fillStyle = '#ffd966'; c.beginPath(); c.arc(L + 150, G - 56, 5, 0, 7); c.fill();
  // cowcatcher + footplate
  c.fillStyle = '#14181c'; c.beginPath(); c.moveTo(L + 148, G - 28); c.lineTo(L + 170, G - 4); c.lineTo(L + 138, G - 4); c.closePath(); c.fill();
  c.fillRect(L + 4, G - 32, 146, 7);
  // wheels + rods
  const ws = [L + 40, L + 82, L + 124];
  ws.forEach((x) => wheel(c, x, wy, R, dist / R));
  const px = (x) => x + Math.cos(dist / R) * 9, py = () => wy + Math.sin(dist / R) * 9;
  c.strokeStyle = '#d98a00'; c.lineWidth = 4; c.lineCap = 'round';
  c.beginPath(); c.moveTo(px(ws[0]), py(ws[0])); c.lineTo(px(ws[2]), py(ws[2])); c.stroke();
  c.restore();
}

function wagon(c, x, i, t, dist) {
  const [name, color] = TOOLS[i % TOOLS.length];
  const bob = Math.sin(t * 8 + i * 1.7) * 0.5;
  c.save(); c.translate(0, bob);
  // coupling
  c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(x + WAGON - 4, G - 24); c.lineTo(x + WAGON + 10, G - 24); c.stroke();
  // bed
  c.fillStyle = '#8a6a43'; rr(c, x, G - 44, WAGON - 8, 20, 3); c.fill();
  c.fillStyle = '#a98558'; c.fillRect(x + 4, G - 41, WAGON - 16, 3);
  // crate with the tool name
  const cw = WAGON - 26, chh = 46;
  c.fillStyle = color; rr(c, x + 9, G - 44 - chh, cw, chh, 5); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.strokeRect(x + 14, G - 44 - chh + 5, cw - 10, chh - 10);
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `700 ${name.length > 7 ? 11 : 14}px ${MONO}`; c.fillText(name, x + 9 + cw / 2, G - 44 - chh / 2 + 1);
  c.textBaseline = 'alphabetic';
  wheel(c, x + 24, G - 12, 12, dist / 12); wheel(c, x + 86, G - 12, 12, dist / 12);
  c.restore();
}

function draw(c, W, t) {
  const dist = t * SPEED;
  c.clearRect(0, 0, W, H);
  // landscape (slow parallax)
  hill(c, W, dist, 34, G - 52, 1.3, 'rgba(15,143,134,.10)', 0.12);
  hill(c, W, dist, 22, G - 22, 4.1, 'rgba(217,138,0,.10)', 0.28);
  // ground, gravel, sleepers, rails
  c.fillStyle = 'rgba(20,24,28,.06)'; c.fillRect(0, G, W, H - G);
  c.fillStyle = 'rgba(20,24,28,.22)';
  for (let x = -((dist) % 26); x < W; x += 26) c.fillRect(x, G + 6, 14, 6);
  c.fillStyle = INK; c.fillRect(0, G - 1, W, 4);
  // steam
  const born = Math.floor(t / PUFF_EVERY);
  const L = Math.min(W - 190, Math.max(WAGON, W * 0.72));
  for (let k = born; k > born - PUFF_LIFE / PUFF_EVERY; k--) {
    const age = t - k * PUFF_EVERY; if (age < 0) continue;
    const u = age / PUFF_LIFE;
    const x = L + 125 - age * 62 - u * 30, y = G - 116 - age * 26 - u * 16;
    c.fillStyle = `rgba(222,221,214,${0.9 * (1 - u)})`; c.strokeStyle = `rgba(20,24,28,${0.08 * (1 - u)})`;
    c.beginPath(); c.arc(x, y, 6 + u * 24, 0, 7); c.fill(); c.stroke();
  }
  loco(c, L, t, dist);
  for (let i = 0, x = L - WAGON; x > -WAGON; i++, x -= WAGON) wagon(c, x, i, t, dist);
}

export function mount(cv, { reduced = false } = {}) {
  const c = cv.getContext('2d');
  let W = 0, vis = false, raf = 0, t0 = 0;
  const frozen = cv.dataset.time !== undefined ? +cv.dataset.time : null;
  function size() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const s = r.height / H;
    W = r.width / s;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    c.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    paint(performance.now());
  }
  const paint = (now) => draw(c, W, frozen ?? (reduced ? 2.5 : (now - t0) / 1000));
  function loop(now) { if (!vis) return; paint(now); raf = requestAnimationFrame(loop); }
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => {
    vis = e.isIntersecting; cancelAnimationFrame(raf);
    if (vis && !reduced && frozen === null) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop); }
  }, { threshold: 0.05 }).observe(cv);
  size();
}
