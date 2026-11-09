// A Star Wars fleet flies across the band: the Millennium Falcon leads at the top, with X-wings,
// Y-wings, A-wings and Jedi starfighters in formation below, each carrying a tool tag.
// Everything is a pure function of time t (seconds), so a frame can be frozen with data-time.
const TOOLS = [
  ['Python', '#0f8f86'], ['DuckDB', '#d98a00'], ['Rust', '#b4492b'], ['R', '#2f6fb0'],
  ['uv', '#6d4fc2'], ['Quarto', '#2a8a5b'], ['git', '#14181c'], ['Claude Code', '#c46a2d'],
  ['pytest', '#0f8f86'], ['Parquet', '#2f6fb0'],
];
// Formation: dx behind the Falcon, y = flight height (canvas units). The Falcon flies highest.
const SHIPS = [
  { type: 'falcon', dx: 0, y: 188 },
  { type: 'xwing', dx: -150, y: 258 }, { type: 'xwing', dx: -150, y: 332 },
  { type: 'jedi', dx: -300, y: 228 }, { type: 'ywing', dx: -300, y: 296 },
  { type: 'awing', dx: -450, y: 262 }, { type: 'awing', dx: -450, y: 334 },
  { type: 'jedi', dx: -600, y: 216 }, { type: 'ywing', dx: -600, y: 278 }, { type: 'xwing', dx: -600, y: 342 },
];
const SCALE = 0.85; // ship size
const H = 420, G = 382, SPEED = 130, FLEET = 820, GAP = 200, BOLT_EVERY = 0.7, BOLT_LIFE = 1.3, BOLT_SPEED = 560;
const INK = '#14181c', MONO = "'JetBrains Mono', ui-monospace, monospace";
const HULL = '#e9ecee', HULL_EDGE = '#8c939a', METAL = '#8f969c', GLASS = '#3a4a5c';

function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
const poly = (c, pts) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
const hill = (c, W, amp, base, seed, color) => {
  c.fillStyle = color; c.beginPath(); c.moveTo(0, G);
  for (let x = 0; x <= W; x += 8) c.lineTo(x, base - amp * (0.55 * Math.sin(x / 140 + seed) + 0.45 * Math.sin(x / 63 + seed * 2.1)));
  c.lineTo(W, G); c.closePath(); c.fill();
};

// ---- ships, seen from above, nose pointing right, centred on the origin ----
function falcon(c) {
  c.fillStyle = '#d3d7da'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.5; c.lineJoin = 'round';
  poly(c, [[18, -17], [54, -10], [54, -4], [28, -4], [28, 4], [54, 4], [54, 10], [18, 17]]); c.fill(); c.stroke();
  rr(c, 12, 20, 32, 9, 4); c.fillStyle = '#b6bcc1'; c.fill(); c.stroke();           // cockpit tube
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(40, 24.5, 3.5, 2.5, 0, 0, 7); c.fill();
  c.fillStyle = '#d3d7da'; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#aab0b6'; c.beginPath(); c.arc(0, 0, 19, 0, 7); c.stroke();
  c.beginPath(); c.arc(-8, -13, 5, 0, 7); c.stroke(); c.moveTo(-8, -13); c.lineTo(-2, -19); c.stroke();   // dish
  c.fillStyle = '#6b7078'; c.fillRect(-35, -16, 6, 32);
  c.fillStyle = '#7fb4ff'; c.fillRect(-36, -12, 2.5, 24);
}
function xwing(c) {
  for (const s of [-1, 1]) {
    c.fillStyle = '#dfe3e6'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2; c.lineJoin = 'round';
    poly(c, [[6, s * 4], [-22, s * 26], [-6, s * 26], [18, s * 4]]); c.fill(); c.stroke();
    c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(-10, s * 20); c.lineTo(4, s * 12); c.stroke();
    c.strokeStyle = '#6b7078'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-6, s * 27); c.lineTo(26, s * 27); c.stroke();
    c.fillStyle = METAL; rr(c, -36, s * 24 - 4.5, 28, 9, 3); c.fill();
  }
  c.fillStyle = '#eef0f1'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2;
  poly(c, [[-30, -5], [26, -5], [48, 0], [26, 5], [-30, 5]]); c.fill(); c.stroke();
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(12, 0, 7, 3.2, 0, 0, 7); c.fill();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-14, 0, 3.6, 0, 7); c.fill();
  c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(-14, 0, 1.2, 0, 7); c.fill();
}
function ywing(c) {
  c.lineJoin = 'round'; c.lineWidth = 1.2; c.strokeStyle = '#7a6a45';
  c.fillStyle = '#8a7a52'; c.fillRect(-20, -14, 7, 28);
  for (const s of [-1, 1]) { c.fillStyle = '#b9a36f'; rr(c, -44, s * 15 - 5, 52, 10, 4); c.fill(); c.stroke(); c.fillStyle = '#5d6269'; rr(c, -44, s * 15 - 5, 7, 10, 3); c.fill(); }
  c.fillStyle = '#c9b27c'; rr(c, -14, -5, 62, 10, 5); c.fill(); c.stroke();
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(24, 0, 7, 3.4, 0, 0, 7); c.fill();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-14, 0, 4, 0, 7); c.fill();
}
function awing(c) {
  c.fillStyle = METAL; rr(c, -40, -17, 16, 7, 3); c.fill(); rr(c, -40, 10, 16, 7, 3); c.fill();
  c.fillStyle = '#eef0f1'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2; c.lineJoin = 'round';
  poly(c, [[46, 0], [-4, -9], [-28, -24], [-34, -12], [-26, -4], [-26, 4], [-34, 12], [-28, 24], [-4, 9]]); c.fill(); c.stroke();
  c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -8); c.lineTo(-24, -20); c.moveTo(-6, 8); c.lineTo(-24, 20); c.stroke();
  c.fillStyle = '#2f4a66'; c.beginPath(); c.ellipse(14, 0, 9, 3.5, 0, 0, 7); c.fill();
}
function jedi(c) {
  c.fillStyle = METAL; rr(c, -40, -3.5, 10, 7, 2); c.fill();
  c.fillStyle = '#e0b030'; c.strokeStyle = '#9b6a10'; c.lineWidth = 1.2; c.lineJoin = 'round';
  poly(c, [[48, 0], [8, -7], [-20, -8], [-28, -19], [-35, -19], [-31, -6], [-31, 6], [-35, 19], [-28, 19], [-20, 8], [8, 7]]); c.fill(); c.stroke();
  c.strokeStyle = '#9b6a10'; c.beginPath(); c.moveTo(34, 0); c.lineTo(-14, 0); c.stroke();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-6, 0, 4.6, 0, 7); c.fill();
  c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(-6, 0, 1.4, 0, 7); c.fill();
}
const KIND = {
  falcon: { draw: falcon, engines: [-9, 9], tail: -36, rgb: '120,175,255', len: 100, bolt: '#5aa0ff', nose: 54 },
  xwing: { draw: xwing, engines: [-24, 24], tail: -36, rgb: '255,150,70', len: 74, bolt: '#ff4d4d', nose: 48 },
  ywing: { draw: ywing, engines: [-15, 15], tail: -44, rgb: '255,150,70', len: 70, bolt: '#ff4d4d', nose: 48 },
  awing: { draw: awing, engines: [-13.5, 13.5], tail: -40, rgb: '120,175,255', len: 66, bolt: '#46e08a', nose: 46 },
  jedi: { draw: jedi, engines: [0], tail: -40, rgb: '120,175,255', len: 66, bolt: '#46e08a', nose: 48 },
};

function trails(c, k, t, i) {
  for (const y of k.engines) {
    const len = k.len * (0.88 + 0.12 * Math.sin(t * 31 + i * 2 + y));
    const g = c.createLinearGradient(k.tail, 0, k.tail - len, 0);
    g.addColorStop(0, `rgba(${k.rgb},.85)`); g.addColorStop(1, `rgba(${k.rgb},0)`);
    c.fillStyle = g; c.beginPath(); c.moveTo(k.tail, y - 3.4); c.lineTo(k.tail - len, y); c.lineTo(k.tail, y + 3.4); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(k.tail + 1, y, 2.4, 0, 7); c.fill();
  }
}

function tag(c, x, y, i) {
  const [name, color] = TOOLS[i % TOOLS.length];
  c.font = `700 ${name.length > 7 ? 9.5 : 10.5}px ${MONO}`;
  const w = c.measureText(name).width + 14;
  c.fillStyle = color; rr(c, x - w / 2, y, w, 15, 5); c.fill();
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, x, y + 8); c.textBaseline = 'alphabetic';
}

function sky(c, W) {
  // twin suns and a distant Death Star, kept faint so the heading stays readable
  c.fillStyle = 'rgba(217,138,0,.35)'; c.beginPath(); c.arc(W * 0.93, 70, 17, 0, 7); c.fill();
  c.fillStyle = 'rgba(217,138,0,.22)'; c.beginPath(); c.arc(W * 0.93 - 34, 92, 11, 0, 7); c.fill();
  c.fillStyle = 'rgba(20,24,28,.075)'; c.beginPath(); c.arc(W * 0.76, 104, 42, 0, 7); c.fill();
  c.strokeStyle = 'rgba(20,24,28,.09)'; c.lineWidth = 2; c.beginPath(); c.moveTo(W * 0.76 - 42, 104); c.lineTo(W * 0.76 + 42, 104); c.stroke();
  c.fillStyle = 'rgba(20,24,28,.09)'; c.beginPath(); c.arc(W * 0.76 + 16, 90, 10, 0, 7); c.fill();
}

function draw(c, W, t, fixedL) {
  const P = W + FLEET + GAP;
  const posAt = (tt) => ((tt * SPEED) % P) - 170;
  const L = fixedL ?? posAt(t);
  c.clearRect(0, 0, W, H);
  sky(c, W);
  // Tatooine dunes
  hill(c, W, 38, G - 60, 1.3, 'rgba(217,138,0,.10)');
  hill(c, W, 24, G - 24, 4.1, 'rgba(217,138,0,.16)');
  c.fillStyle = 'rgba(217,138,0,.18)'; c.fillRect(0, G, W, H - G);

  SHIPS.forEach((s, i) => {
    const x = L + s.dx, k = KIND[s.type];
    if (x < -130 || x > W + 100) return;
    const y = s.y + Math.sin(t * 1.8 + i * 1.3) * 3.5;
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.4 + i) * 0.03); c.scale(SCALE, SCALE);
    trails(c, k, t, i); k.draw(c);
    c.restore();
  });
  // tool tags go on top so no ship covers them
  SHIPS.forEach((s, i) => {
    const x = L + s.dx;
    if (x < -130 || x > W + 100) return;
    tag(c, x - 4, s.y + Math.sin(t * 1.8 + i * 1.3) * 3.5 + 25, i);
  });

  if (fixedL === undefined) { // laser bolts
    const born = Math.floor(t / BOLT_EVERY);
    for (let n = born; n > born - BOLT_LIFE / BOLT_EVERY; n--) {
      const age = t - n * BOLT_EVERY; if (n < 0 || age < 0) continue;
      const s = SHIPS[(n * 3 + 1) % SHIPS.length], k = KIND[s.type];
      const bx = posAt(n * BOLT_EVERY) + s.dx + k.nose * SCALE + age * BOLT_SPEED, a = 1 - age / BOLT_LIFE;
      if (bx < -20 || bx > W + 20) continue;
      c.lineCap = 'round';
      c.strokeStyle = k.bolt; c.globalAlpha = 0.28 * a; c.lineWidth = 7; c.beginPath(); c.moveTo(bx - 16, s.y); c.lineTo(bx, s.y); c.stroke();
      c.globalAlpha = a; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - 16, s.y); c.lineTo(bx, s.y); c.stroke();
      c.globalAlpha = 1;
    }
  }
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
  const paint = (now) => reduced && frozen === null ? draw(c, W, 0, W * 0.82) : draw(c, W, frozen ?? (now - t0) / 1000);
  function loop(now) { if (!vis) return; paint(now); raf = requestAnimationFrame(loop); }
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => {
    vis = e.isIntersecting; cancelAnimationFrame(raf);
    if (vis && !reduced && frozen === null) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop); }
  }, { threshold: 0.05 }).observe(cv);
  size();
}
